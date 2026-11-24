import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseAuthCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cachedDb = globalWithMongoose._mongooseAuthCache || {
  conn: null,
  promise: null,
};
globalWithMongoose._mongooseAuthCache = cachedDb;

async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }
  if (cachedDb.conn) return cachedDb.conn;
  if (!cachedDb.promise) {
    cachedDb.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cachedDb.conn = await cachedDb.promise;
  return cachedDb.conn;
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plainPasswordHint: String,
    role: { type: String, default: 'student' },
    classGrade: String,
    feeStatus: { type: String, default: 'Paid' },
    trialStartDate: Date,
    ipAddress: String,
    lastLoginAt: Date,
  },
  { timestamps: true, strict: false }
);

const PortalConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    killSwitchActive: { type: Boolean, default: false },
    ipAttendanceLock: { type: Boolean, default: false },
    allowedCoachingIP: String,
  },
  { timestamps: true, strict: false }
);

const UserModel: any = mongoose.models.User || mongoose.model('User', UserSchema);
const ConfigModel: any =
  mongoose.models.PortalConfig || mongoose.model('PortalConfig', PortalConfigSchema);

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const existingCount = await UserModel.countDocuments();
    if (existingCount === 0) {
      await UserModel.insertMany([
        {
          name: 'Portal Owner',
          email: 'owner@ourcoaching.pk',
          password: 'owner123',
          role: 'owner',
          feeStatus: 'Paid',
        },
        {
          name: 'Trial Coaching',
          email: 'trial@ourcoaching.pk',
          password: 'trial123',
          role: 'trial',
          trialStartDate: new Date(),
          feeStatus: 'Paid',
        },
      ]);
    }

    const body: any = await req.json();
    const email = String(body?.email || '')
      .toLowerCase()
      .trim();
    const password = String(body?.password || '');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email aur password dono zaroori hain.' },
        { status: 400 }
      );
    }

    const dbUser: any = await UserModel.findOne({ email }).lean();
    if (!dbUser || dbUser.password !== password) {
      return NextResponse.json(
        { error: 'Galat email ya password hai.' },
        { status: 401 }
      );
    }

    const configDoc: any = await ConfigModel.findOne({ key: 'main_portal' }).lean();

    if (configDoc?.killSwitchActive && dbUser.role !== 'owner') {
      return NextResponse.json(
        { error: 'Portal is currently locked by Owner.' },
        { status: 423 }
      );
    }

    let trialDaysLeft: number | undefined;
    if (dbUser.role === 'trial') {
      const startDate = dbUser.trialStartDate ? new Date(dbUser.trialStartDate) : new Date();
      const elapsedDays = Math.floor(
        (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      trialDaysLeft = Math.max(0, 4 - elapsedDays);
    }

    const currentIP = getClientIP(req);
    await UserModel.updateOne(
      { _id: dbUser._id },
      { $set: { ipAddress: currentIP, lastLoginAt: new Date() } }
    );

    const safeUser = {
      id: String(dbUser._id),
      name: dbUser.name || 'Portal User',
      email: dbUser.email,
      role: dbUser.role || 'student',
      classGrade: dbUser.classGrade || '',
      feeStatus: dbUser.feeStatus || 'Paid',
      trialDaysLeft,
    };

    const res = NextResponse.json({ user: safeUser, currentIP });
    res.cookies.set('portal_session', String(dbUser._id), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Login mein masla aaya.' },
      { status: 500 }
    );
  }
}
