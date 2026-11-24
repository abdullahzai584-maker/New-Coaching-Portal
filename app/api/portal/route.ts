import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';

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

const AttendanceSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: String,
    date: { type: String, required: true },
    status: { type: String, default: 'Present' },
    markedBy: String,
  },
  { timestamps: true, strict: false }
);

const UserModel: any = mongoose.models.User || mongoose.model('User', UserSchema);
const ConfigModel: any =
  mongoose.models.PortalConfig || mongoose.model('PortalConfig', PortalConfigSchema);
const AttendanceModel: any =
  mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

async function getCurrentUser(req: NextRequest) {
  const sessionId = req.cookies.get('portal_session')?.value;
  if (!sessionId) return null;
  const u: any = await UserModel.findById(sessionId).lean();
  if (!u) return null;
  return {
    ...u,
    id: String(u._id),
  };
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentIP = getClientIP(req);
    let config: any = await ConfigModel.findOne({ key: 'main_portal' }).lean();

    if (!config) {
      config = {
        key: 'main_portal',
        killSwitchActive: false,
        ipAttendanceLock: false,
        allowedCoachingIP: currentIP,
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const students = await UserModel.find({ role: 'student' }).sort({ createdAt: -1 }).lean();
    const teachers = await UserModel.find({ role: 'teacher' }).sort({ createdAt: -1 }).lean();
    const attendance = await AttendanceModel.find({ date: todayStr }).lean();

    let trialDaysLeft: number | undefined;
    if (user.role === 'trial') {
      const startDate = user.trialStartDate ? new Date(user.trialStartDate) : new Date();
      const elapsedDays = Math.floor(
        (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      trialDaysLeft = Math.max(0, 4 - elapsedDays);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        classGrade: user.classGrade || '',
        feeStatus: user.feeStatus || 'Paid',
        trialDaysLeft,
      },
      currentIP,
      config,
      students,
      teachers,
      attendance,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Data load karne mein masla aaya.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: any = await req.json();
    const action = String(body?.action || '');
    const currentIP = getClientIP(req);

    if (action === 'TOGGLE_KILL_SWITCH') {
      if (user.role !== 'owner') {
        return NextResponse.json({ error: 'Sirf Owner allowed hai.' }, { status: 403 });
      }
      const state = Boolean(body?.state);
      await ConfigModel.findOneAndUpdate(
        { key: 'main_portal' },
        { $set: { key: 'main_portal', killSwitchActive: state } },
        { upsert: true, new: true }
      );
      return NextResponse.json({ ok: true, killSwitchActive: state });
    }

    if (action === 'TOGGLE_IP_LOCK') {
      if (!['owner', 'teacher', 'trial'].includes(user.role)) {
        return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
      }
      const state = Boolean(body?.state);
      await ConfigModel.findOneAndUpdate(
        { key: 'main_portal' },
        {
          $set: {
            key: 'main_portal',
            ipAttendanceLock: state,
            allowedCoachingIP: currentIP,
          },
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ ok: true, ipAttendanceLock: state });
    }

    if (action === 'ADD_USER') {
      if (!['owner', 'teacher', 'trial'].includes(user.role)) {
        return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
      }
      const cleanEmail = String(body?.email || '')
        .toLowerCase()
        .trim();
      const role = body?.role === 'teacher' ? 'teacher' : 'student';
      const createdUser: any = await UserModel.create({
        name: String(body?.name || '').trim(),
        email: cleanEmail,
        password: String(body?.password || '123456'),
        plainPasswordHint: String(body?.password || '123456'),
        role,
        classGrade: String(body?.classGrade || '10th Matric').trim(),
        feeStatus: body?.feeStatus === 'Pending' ? 'Pending' : 'Paid',
      });
      return NextResponse.json({ ok: true, user: createdUser });
    }

    if (action === 'DELETE_USER') {
      if (!['owner', 'teacher', 'trial'].includes(user.role)) {
        return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
      }
      const userId = String(body?.userId || '');
      if (userId) {
        await UserModel.deleteOne({ _id: userId });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'MARK_ATTENDANCE') {
      const config: any = await ConfigModel.findOne({ key: 'main_portal' }).lean();

      if (
        user.role === 'student' &&
        config?.ipAttendanceLock &&
        config?.allowedCoachingIP &&
        config.allowedCoachingIP !== currentIP
      ) {
        return NextResponse.json(
          {
            error: `Attendance lock active! Coaching Wi-Fi IP (${config.allowedCoachingIP}) se connect karein. Aapka IP: ${currentIP}`,
          },
          { status: 403 }
        );
      }

      const targetStudentId =
        user.role === 'student' ? String(user.id) : String(body?.studentId || user.id);
      const targetStudentName =
        user.role === 'student' ? String(user.name) : String(body?.studentName || 'Student');
      const status = body?.status === 'Absent' ? 'Absent' : 'Present';
      const todayStr = new Date().toISOString().split('T')[0];

      await AttendanceModel.findOneAndUpdate(
        { studentId: targetStudentId, date: todayStr },
        {
          $set: {
            studentId: targetStudentId,
            studentName: targetStudentName,
            date: todayStr,
            status,
            markedBy: `${user.name} (${user.role}) • IP ${currentIP}`,
          },
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ ok: true, status });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Action complete nahi ho saka.' },
      { status: 500 }
    );
  }
}