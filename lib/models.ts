import mongoose, { Schema, model, models } from 'mongoose';

// 1. User Schema (Owner, Trial, Teacher, Student)
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  plainPasswordHint: { type: String }, // Teacher ko student ka password dikhane ke liye
  role: { type: String, enum: ['owner', 'trial', 'teacher', 'student'], required: true },
  classGrade: { type: String, default: 'General' },
  feeStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// 2. System Settings (Kill Switch & IP Attendance Lock)
const SystemConfigSchema = new Schema({
  key: { type: String, default: 'GLOBAL_CONFIG', unique: true },
  killSwitchActive: { type: Boolean, default: false },
  killSwitchMessage: { type: String, default: 'Portal suspended due to pending subscription clearance. Contact Administration.' },
  ipAttendanceLock: { type: Boolean, default: false },
  allowedCoachingIP: { type: String, default: '' },
});

// 3. 4-Day IP Trial Tracker
const TrialLogSchema = new Schema({
  ipAddress: { type: String, required: true, unique: true },
  firstLoginAt: { type: Date, default: Date.now },
  deviceCount: { type: Number, default: 1 },
});

// 4. Attendance & Marks Schema
const AttendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
  markedBy: { type: String }, // 'Teacher' or 'Student (Self)'
  ipUsed: { type: String },
});

export const User = models.User || model('User', UserSchema);
export const SystemConfig = models.SystemConfig || model('SystemConfig', SystemConfigSchema);
export const TrialLog = models.TrialLog || model('TrialLog', TrialLogSchema);
export const Attendance = models.Attendance || model('Attendance', AttendanceSchema);