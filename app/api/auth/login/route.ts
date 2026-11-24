import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import mongoose, { Schema, model, models } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_2026');

let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  plainPasswordHint: { type: String },
  role: { type: String, enum: ['owner', 'trial', 'teacher', 'student'], required: true },
  classGrade: { type: String, default: 'General' },
  feeStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const SystemConfigSchema = new Schema({
  key: { type: String, default: 'GLOBAL_CONFIG', unique: true },
  killSwitchActive: { type: Boolean, default: false },
  killSwitchMessage: {
    type: String,
    default: 'Portal suspended due to pending subscription clearance. Contact Administration.',
  },
  ipAttendanceLock: { type: Boolean, default: false },
  allowedCoachingIP: { type: String, default: '' },
});

const TrialLogSchema = new Schema({
  ipAddress: { type: String, required: true, unique: true },
  firstLoginAt: { type: Date, default: Date.now },
  deviceCount: { type: Number, default: 1 },
});

const User = models.User || model('User', UserSchema);
const SystemConfig = models.SystemConfig || model('SystemConfig', SystemConfigSchema);
const TrialLog = models.TrialLog || model('TrialLog', TrialLogSchema);

async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const clientIP = getClientIP(req);

    const ownerExists = await User.findOne({ email: 'abdullah.owner@ourcoaching.pk' });
    if (!ownerExists) {
      const hashedOwnerPass = await bcrypt.hash('abdullah', 10);
      await User.create({
        name: 'Muhammad Abdullah (Owner)',
        email: 'abdullah.owner@ourcoaching.pk',
        password: hashedOwnerPass,
        role: 'owner',
      });
    }

    const trialExists = await User.findOne({ email: 'trail@ourcoaching.pk' });
    if (!trialExists) {
      const hashedTrialPass = await bcrypt.hash('trail123', 10);
      await User.create({
        name: 'Demo Trial User',
        email: 'trail@ourcoaching.pk',
        password: hashedTrialPass,
        role: 'trial',
      });
    }

    let config = await SystemConfig.findOne({ key: 'GLOBAL_CONFIG' });
    if (!config) config = await SystemConfig.create({ key: 'GLOBAL_CONFIG' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid Email or Password' }, { status: 401 });
    }

    if (config.killSwitchActive && user.role !== 'owner') {
      return NextResponse.json(
        { error: `PORTAL LOCKED: ${config.killSwitchMessage}` },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid Email or Password' }, { status: 401 });
    }

    let trialDaysLeft = 4;
    if (user.role === 'trial') {
      let trialRecord = await TrialLog.findOne({ ipAddress: clientIP });
      if (!trialRecord) {
        trialRecord = await TrialLog.create({ ipAddress: clientIP, firstLoginAt: new Date(), deviceCount: 1 });
      } else {
        const diffMs = Date.now() - new Date(trialRecord.firstLoginAt).getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays > 4) {
          return NextResponse.json(
            {
              error:
                'Your 4-Day Free Trial from this IP Network has expired! Contact Abdullah to purchase full access.',
            },
            { status: 403 }
          );
        }
        trialDaysLeft = Math.max(0, Math.ceil(4 - diffDays));
        trialRecord.deviceCount += 1;
        await trialRecord.save();
      }
    }

    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, trialDaysLeft },
    });

    response.cookies.set('coaching_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}