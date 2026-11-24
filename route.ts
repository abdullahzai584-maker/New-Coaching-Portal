import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PortalConfig from '@/models/PortalConfig';

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
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

    const dbUser: any = await (User as any).findOne({ email }).lean();
    if (!dbUser || dbUser.password !== password) {
      return NextResponse.json(
        { error: 'Galat email ya password hai.' },
        { status: 401 }
      );
    }

    const configDoc: any = await (PortalConfig as any)
      .findOne({ key: 'main_portal' })
      .lean();

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
    await (User as any).updateOne(
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