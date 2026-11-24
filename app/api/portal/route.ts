import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
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

const AttendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
  markedBy: { type: String },
  ipUsed: { type: String },
});

const User = models.User || model('User', UserSchema);
const SystemConfig = models.SystemConfig || model('SystemConfig', SystemConfigSchema);
const Attendance = models.Attendance || model('Attendance', AttendanceSchema);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('coaching_token')?.value;
  const decoded: any = token ? await verifyToken(token) : null;
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const config = await SystemConfig.findOne({ key: 'GLOBAL_CONFIG' });
  if (config?.killSwitchActive && decoded.role !== 'owner') {
    return NextResponse.json(
      { error: 'PORTAL_KILLED', message: config.killSwitchMessage },
      { status: 403 }
    );
  }

  const students = await User.find({ role: 'student' }).sort({ createdAt: -1 }).lean();
  const teachers = await User.find({ role: 'teacher' }).sort({ createdAt: -1 }).lean();
  const today = new Date().toISOString().split('T')[0];
  const attendance = await Attendance.find({ date: today }).lean();
  const currentIP = getClientIP(req);

  return NextResponse.json({
    user: decoded,
    config,
    students,
    teachers,
    attendance,
    currentIP,
  });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('coaching_token')?.value;
  const decoded: any = token ? await verifyToken(token) : null;
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const clientIP = getClientIP(req);
  const today = new Date().toISOString().split('T')[0];

  if (body.action === 'TOGGLE_KILL_SWITCH' && decoded.role === 'owner') {
    const config = await SystemConfig.findOneAndUpdate(
      { key: 'GLOBAL_CONFIG' },
      { killSwitchActive: body.state },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, config });
  }

  if (body.action === 'TOGGLE_IP_LOCK' && ['owner', 'teacher', 'trial'].includes(decoded.role)) {
    const config = await SystemConfig.findOneAndUpdate(
      { key: 'GLOBAL_CONFIG' },
      { ipAttendanceLock: body.state, allowedCoachingIP: body.state ? clientIP : '' },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, config });
  }

  if (body.action === 'ADD_USER' && ['owner', 'teacher', 'trial'].includes(decoded.role)) {
    const { name, email, password, role, classGrade, feeStatus } = body;
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return NextResponse.json({ error: 'Email already registered!' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      plainPasswordHint: password,
      role: role || 'student',
      classGrade: classGrade || '10th Matric',
      feeStatus: feeStatus || 'Paid',
      createdBy: decoded.email,
    });
    return NextResponse.json({ success: true, user: newUser });
  }

  if (body.action === 'DELETE_USER' && ['owner', 'teacher'].includes(decoded.role)) {
    await User.findByIdAndDelete(body.userId);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'MARK_ATTENDANCE') {
    const config = await SystemConfig.findOne({ key: 'GLOBAL_CONFIG' });

    if (decoded.role === 'student') {
      if (config?.ipAttendanceLock && config.allowedCoachingIP !== clientIP) {
        return NextResponse.json(
          {
            error: `IP Security Active: Aapki IP (${clientIP}) Coaching Wi-Fi (${config.allowedCoachingIP}) se match nahi kar rahi! Coaching aakar present lagayein.`,
          },
          { status: 403 }
        );
      }
    }

    const targetId = decoded.role === 'student' ? decoded.id : body.studentId;
    const targetName = decoded.role === 'student' ? decoded.name : body.studentName;
    const status = decoded.role === 'student' ? 'Present' : body.status;

    await Attendance.findOneAndUpdate(
      { studentId: targetId, date: today },
      {
        studentId: targetId,
        studentName: targetName,
        date: today,
        status,
        markedBy: decoded.role === 'student' ? 'Student (Self-IP Verified)' : `Teacher (${decoded.name})`,
        ipUsed: clientIP,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
}