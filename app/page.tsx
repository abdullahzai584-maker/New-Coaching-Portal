'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Wifi,
  UserPlus,
  Users,
  CheckCircle2,
  XCircle,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  GraduationCap,
  KeyRound,
  Bot,
  X,
  Send,
  Sparkles,
  LayoutDashboard,
  Settings,
  UserCheck,
  DollarSign,
  CalendarCheck,
  Search,
  Copy,
  Check,
  Building2,
  CalendarClock,
  FileSpreadsheet,
  ClipboardList,
  BookOpen,
  Download,
  Crown,
  Activity,
  Globe,
  Megaphone,
  Sliders,
  Receipt,
  Printer,
  Wallet,
} from 'lucide-react';

const WHATSAPP_NUMBER = '923213091550';

function InlineBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2, radius: 190 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.75,
      vy: (Math.random() - 0.5) * 0.75,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 340);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);

        if (distMouse < mouse.radius) {
          p.x -= dxMouse * 0.015;
          p.y -= dyMouse * 0.015;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.z * 1.75, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${0.3 * p.z})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 130) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pointer-events-none"
    />
  );
}

function InlineAIAssistant({ role, coachingName }: { role: string; coachingName: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Salam! Main ${coachingName} ka AI Assistant hoon (${role.toUpperCase()} mode). Student fees, Teacher salary, Batches, Exams, ya Owner controls ke baare mein poochein!`,
    },
  ]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.toLowerCase();
    let reply =
      'Students tab se har bache ki alag fee set karein aur Staff tab se har teacher ki salary manage karein.';

    if (q.includes('fee') || q.includes('student')) {
      reply =
        'Student add karte waqt aap uski apni monthly fee amount (Rs.) likh sakte hain. Har student ki fee alag record aur calculate hoti hai.';
    } else if (q.includes('salary') || q.includes('teacher') || q.includes('staff')) {
      reply =
        'Role "Teacher" select karne par Monthly Salary (Rs.) ka field aata hai, jisse aap har teacher/staff ki salary set aur Staff tab mein dekh sakte hain.';
    } else if (q.includes('ip') || q.includes('attendance') || q.includes('present')) {
      reply =
        'IP Attendance Lock ON karne par current Wi-Fi IP save ho jata hai. Students sirf coaching Wi-Fi par apni Present mark kar sakenge.';
    } else if (q.includes('plan') || q.includes('whatsapp') || q.includes('upgrade')) {
      reply =
        'Plan upgrade/renew button par click karne par seedha 03213091550 WhatsApp par paid plan ki details mangne ka message open hota hai.';
    } else if (q.includes('owner') || q.includes('tenant') || q.includes('kill') || q.includes('billing')) {
      reply =
        'Owner Super Admin tab mein All Tenants, Trial/Subscription control, Billing/Revenue, Plan Limits, Health Monitor, IP Logs, Announcements, aur Master Kill Switch maujood hain.';
    }

    setMessages([...messages, { sender: 'user', text: input }, { sender: 'ai', text: reply }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Sparkles className="w-4 h-4" /> Coaching AI Helper
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 h-64 overflow-y-auto space-y-2.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                  m.sender === 'ai'
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-indigo-600 text-white ml-auto'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleAsk} className="p-2.5 border-t border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI guide..."
              className="flex-1 bg-slate-800 text-white text-xs rounded-xl px-3 py-2 outline-none border border-slate-700 focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform text-white px-4 py-3 rounded-full shadow-lg shadow-indigo-500/30 font-medium text-sm"
        >
          <Bot className="w-5 h-5" /> AI Guide
        </button>
      )}
    </div>
  );
}

type TabKey =
  | 'dashboard'
  | 'students'
  | 'batches'
  | 'exams'
  | 'homework'
  | 'teachers'
  | 'reports'
  | 'settings'
  | 'superadmin';

type TenantItem = {
  id: string;
  name: string;
  ownerEmail: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Trial' | 'Expired' | 'Suspended';
  trialStart: string;
  trialEnd: string;
  daysLeft: number;
  studentLimit: number;
  studentsUsed: number;
  monthlyFee: number;
  paidStatus: 'Paid' | 'Unpaid';
  lastIP: string;
  devices: number;
};

export default function CoachingPortal() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

  const [coachingName, setCoachingName] = useState('OurCoaching Pro');
  const [defaultBatch, setDefaultBatch] = useState('10th Matric');
  const [autoPresentNote, setAutoPresentNote] = useState(true);

  const [studentFeeAmountMap, setStudentFeeAmountMap] = useState<{ [id: string]: number }>({});
  const [localFeeMap, setLocalFeeMap] = useState<{ [id: string]: 'Paid' | 'Pending' }>({});
  const [selectedInvoiceStudent, setSelectedInvoiceStudent] = useState<any>(null);

  const [teacherSalaryMap, setTeacherSalaryMap] = useState<{ [id: string]: number }>({});
  const [localTeachers, setLocalTeachers] = useState<any[]>([]);

  const [batches, setBatches] = useState([
    { id: 'b1', title: '10th Matric Science', schedule: 'Mon - Thu • 04:00 PM - 05:30 PM', teacher: 'Sir Bilal', room: 'Lab A' },
    { id: 'b2', title: '9th Pre-Engineering', schedule: 'Tue - Fri • 05:30 PM - 07:00 PM', teacher: 'Ms. Hina', room: 'Room 2' },
  ]);
  const [batchTitle, setBatchTitle] = useState('');
  const [batchSchedule, setBatchSchedule] = useState('Mon - Wed • 04:00 PM - 05:00 PM');
  const [batchTeacher, setBatchTeacher] = useState('');
  const [batchRoom, setBatchRoom] = useState('Hall 1');

  const [examRecords, setExamRecords] = useState([
    { id: 'e1', studentName: 'Sample Student', subject: 'Physics Ch-1', obtained: 44, total: 50, date: '2026-11-20' },
  ]);
  const [examStudentName, setExamStudentName] = useState('');
  const [examSubject, setExamSubject] = useState('Mathematics Quiz');
  const [examObtained, setExamObtained] = useState('42');
  const [examTotal, setExamTotal] = useState('50');

  const [materials, setMaterials] = useState([
    {
      id: 'm1',
      title: 'Chapter 3 Notes & Practice Sheet',
      batch: '10th Matric',
      type: 'Study Note',
      dueDate: '2026-11-28',
      linkOrNote: 'Solve Q1 to Q12 from workbook before next class.',
    },
  ]);
  const [hwTitle, setHwTitle] = useState('');
  const [hwBatch, setHwBatch] = useState('10th Matric');
  const [hwType, setHwType] = useState<'Homework' | 'Study Note' | 'Assignment'>('Homework');
  const [hwDueDate, setHwDueDate] = useState('2026-11-30');
  const [hwNote, setHwNote] = useState('');

  const [tenantFilter, setTenantFilter] = useState<'All' | 'Trial' | 'Active' | 'Expired' | 'Suspended'>('All');
  const [tenants, setTenants] = useState<TenantItem[]>([
    {
      id: 't1',
      name: 'Bright Future Academy',
      ownerEmail: 'brightfuture@coaching.pk',
      plan: 'Pro',
      status: 'Active',
      trialStart: '2026-10-01',
      trialEnd: '2026-10-05',
      daysLeft: 24,
      studentLimit: 250,
      studentsUsed: 118,
      monthlyFee: 18000,
      paidStatus: 'Paid',
      lastIP: '119.152.44.18',
      devices: 3,
    },
    {
      id: 't2',
      name: 'Karachi Scholars Coaching',
      ownerEmail: 'scholars.khi@coaching.pk',
      plan: 'Starter',
      status: 'Trial',
      trialStart: '2026-11-22',
      trialEnd: '2026-11-26',
      daysLeft: 2,
      studentLimit: 75,
      studentsUsed: 29,
      monthlyFee: 9000,
      paidStatus: 'Unpaid',
      lastIP: '110.37.92.104',
      devices: 2,
    },
    {
      id: 't3',
      name: 'Apex Prep Institute',
      ownerEmail: 'apexprep@coaching.pk',
      plan: 'Enterprise',
      status: 'Suspended',
      trialStart: '2026-08-10',
      trialEnd: '2026-08-14',
      daysLeft: 0,
      studentLimit: 1000,
      studentsUsed: 412,
      monthlyFee: 35000,
      paidStatus: 'Unpaid',
      lastIP: '202.47.211.65',
      devices: 6,
    },
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 'a1',
      title: 'IP Attendance & 3D Portal v2.4 Live',
      message: 'Per-student custom fees, per-teacher salaries, exams, homework, and reports are live.',
      target: 'All Tenants',
      date: 'Today',
    },
  ]);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeTarget, setNoticeTarget] = useState('All Tenants');
  const [noticeBody, setNoticeBody] = useState('');

  const [supportTickets, setSupportTickets] = useState([
    {
      id: 's1',
      tenant: 'Karachi Scholars Coaching',
      subject: 'Need 3 extra days to test student bulk attendance',
      status: 'Open',
    },
    {
      id: 's2',
      tenant: 'Bright Future Academy',
      subject: 'Invoice receipt for November monthly plan',
      status: 'Resolved',
    },
  ]);

  const [data, setData] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newRole, setNewRole] = useState<'student' | 'teacher'>('student');
  const [newGrade, setNewGrade] = useState('10th Matric');
  const [newFee, setNewFee] = useState<'Paid' | 'Pending'>('Paid');
  const [newStudentFeeAmount, setNewStudentFeeAmount] = useState('');
  const [newTeacherSalary, setNewTeacherSalary] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    setNewGrade(defaultBatch);
    setHwBatch(defaultBatch);
  }, [defaultBatch]);

  const fetchPortalData = async () => {
    try {
      const res = await fetch('/api/portal');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setUser(json.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const showToast = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const openWhatsAppPlan = (sourceLabel: string) => {
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum, mujhe ${coachingName} ke paid plan ki details bta den (${sourceLabel}). Plans, pricing aur activation ka tareeqa share kar dein.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
    } else {
      setUser(json.user);
      setActiveTab('dashboard');
      fetchPortalData();
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setData(null);
  };

  const triggerAction = async (payload: any) => {
    setActionMsg('');
    const res = await fetch('/api/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error);
      return null;
    } else {
      showToast('Updated Successfully!');
      fetchPortalData();
      return json;
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmail.toLowerCase().trim();
    const parsedStudentFee = Math.max(0, Number(newStudentFeeAmount) || 0);
    const parsedSalary = Math.max(0, Number(newTeacherSalary) || 0);

    const created = await triggerAction({
      action: 'ADD_USER',
      name: newName,
      email: cleanEmail,
      password: newPass,
      role: newRole,
      classGrade: newGrade || defaultBatch,
      feeStatus: newFee,
    });

    if (newRole === 'student') {
      const createdId = created?.user?._id || `email:${cleanEmail}`;
      setStudentFeeAmountMap((prev) => ({
        ...prev,
        [createdId]: parsedStudentFee,
        [`email:${cleanEmail}`]: parsedStudentFee,
      }));
    } else {
      const createdId = created?.user?._id || `tc-${Date.now()}`;
      setTeacherSalaryMap((prev) => ({
        ...prev,
        [createdId]: parsedSalary,
        [`email:${cleanEmail}`]: parsedSalary,
      }));
      setLocalTeachers((prev) => [
        {
          _id: createdId,
          name: newName,
          email: cleanEmail,
          classGrade: newGrade || defaultBatch,
          salary: parsedSalary,
        },
        ...prev,
      ]);
    }

    setNewName('');
    setNewEmail('');
    setNewPass('');
    setNewStudentFeeAmount('');
    setNewTeacherSalary('');
  };

  const getStudentFeeAmount = (st: any): number => {
    if (typeof studentFeeAmountMap[st._id] === 'number') return studentFeeAmountMap[st._id];
    if (st.email && typeof studentFeeAmountMap[`email:${st.email}`] === 'number') {
      return studentFeeAmountMap[`email:${st.email}`];
    }
    return 0;
  };

  const getTeacherSalary = (tc: any): number => {
    if (typeof teacherSalaryMap[tc._id] === 'number') return teacherSalaryMap[tc._id];
    if (tc.email && typeof teacherSalaryMap[`email:${tc.email}`] === 'number') {
      return teacherSalaryMap[`email:${tc.email}`];
    }
    return Number(tc.salary) || 0;
  };

  const getStudentFeeStatus = (st: any): 'Paid' | 'Pending' => {
    return localFeeMap[st._id] || (st.feeStatus === 'Pending' ? 'Pending' : 'Paid');
  };

  const toggleStudentFee = (st: any) => {
    const current = getStudentFeeStatus(st);
    const next: 'Paid' | 'Pending' = current === 'Paid' ? 'Pending' : 'Paid';
    setLocalFeeMap((prev) => ({ ...prev, [st._id]: next }));
    showToast(`${st.name} fee marked as ${next}`);
  };

  const copyReminderText = (st: any) => {
    const status = getStudentFeeStatus(st);
    const feeAmt = getStudentFeeAmount(st);
    const text = `Assalam-o-Alaikum, reminder from ${coachingName} for ${st.name} (${st.classGrade}). Fee: Rs. ${feeAmt.toLocaleString()} (${status}).`;
    navigator.clipboard?.writeText(text);
    setCopiedId(st._id);
    showToast(`Reminder copied for ${st.name}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const markAllFilteredPresent = async () => {
    const list = data?.students || [];
    for (const st of list) {
      await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MARK_ATTENDANCE',
          studentId: st._id,
          studentName: st.name,
          status: 'Present',
        }),
      });
    }
    showToast('All students marked Present for today!');
    fetchPortalData();
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchTitle.trim()) return;
    setBatches((prev) => [
      {
        id: `b-${Date.now()}`,
        title: batchTitle.trim(),
        schedule: batchSchedule.trim(),
        teacher: batchTeacher.trim() || 'Assigned Teacher',
        room: batchRoom.trim() || 'Classroom',
      },
      ...prev,
    ]);
    setBatchTitle('');
    setBatchTeacher('');
    showToast('Batch & timetable added!');
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    const obtained = Number(examObtained) || 0;
    const total = Math.max(1, Number(examTotal) || 100);
    if (!examStudentName.trim()) return;
    setExamRecords((prev) => [
      {
        id: `e-${Date.now()}`,
        studentName: examStudentName.trim(),
        subject: examSubject.trim() || 'Test',
        obtained,
        total,
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);
    setExamStudentName('');
    showToast('Exam result recorded!');
  };

  const getGrade = (obtained: number, total: number) => {
    const pct = (obtained / Math.max(1, total)) * 100;
    if (pct >= 85) return { pct: pct.toFixed(1), grade: 'A+' };
    if (pct >= 75) return { pct: pct.toFixed(1), grade: 'A' };
    if (pct >= 60) return { pct: pct.toFixed(1), grade: 'B' };
    if (pct >= 50) return { pct: pct.toFixed(1), grade: 'C' };
    return { pct: pct.toFixed(1), grade: 'Fail' };
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;
    setMaterials((prev) => [
      {
        id: `m-${Date.now()}`,
        title: hwTitle.trim(),
        batch: hwBatch,
        type: hwType,
        dueDate: hwDueDate,
        linkOrNote: hwNote.trim() || 'Study resource shared with batch.',
      },
      ...prev,
    ]);
    setHwTitle('');
    setHwNote('');
    showToast(`${hwType} added!`);
  };

  const exportStudentsCSV = () => {
    const rows = [
      ['Name', 'Email', 'Class', 'Fee Amount (Rs.)', 'Fee Status', 'Today Attendance'],
      ...(data?.students || []).map((st: any) => {
        const att = (data?.attendance || []).find((a: any) => a.studentId === st._id);
        return [
          st.name || '',
          st.email || '',
          st.classGrade || '',
          getStudentFeeAmount(st),
          getStudentFeeStatus(st),
          att?.status || 'Unmarked',
        ];
      }),
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${coachingName.toLowerCase().replace(/\s+/g, '-')}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV report downloaded!');
  };

  const extendTenantTrial = (id: string, extraDays: number) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              daysLeft: t.daysLeft + extraDays,
              status: t.status === 'Expired' ? 'Trial' : t.status,
            }
          : t
      )
    );
    showToast(`Extended trial by +${extraDays} days`);
  };

  const toggleTenantLock = (id: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Suspended' ? 'Active' : 'Suspended' }
          : t
      )
    );
    showToast('Tenant lock/unlock status updated');
  };

  const updateTenantPlan = (id: string, plan: 'Starter' | 'Pro' | 'Enterprise') => {
    const limits = { Starter: 75, Pro: 250, Enterprise: 1000 };
    const fees = { Starter: 9000, Pro: 18000, Enterprise: 35000 };
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, plan, studentLimit: limits[plan], monthlyFee: fees[plan] }
          : t
      )
    );
    showToast(`Plan changed to ${plan}`);
  };

  const toggleTenantInvoice = (id: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, paidStatus: t.paidStatus === 'Paid' ? 'Unpaid' : 'Paid' }
          : t
      )
    );
    showToast('Billing invoice status updated');
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeBody.trim()) return;
    setAnnouncements((prev) => [
      {
        id: `a-${Date.now()}`,
        title: noticeTitle.trim(),
        message: noticeBody.trim(),
        target: noticeTarget,
        date: 'Just now',
      },
      ...prev,
    ]);
    setNoticeTitle('');
    setNoticeBody('');
    showToast('Announcement sent to clients!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400 font-semibold">
        <InlineBackground3D />
        Loading 3D Coaching OS...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-white">
        <InlineBackground3D />
        <div className="w-full max-w-md bg-slate-900/75 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl p-8 shadow-2xl transform transition-all hover:border-indigo-400/50">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{coachingName}</h1>
            <p className="text-slate-400 text-xs mt-1">Next-Gen Coaching Management & Attendance OS</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ourcoaching.pk"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              Sign In to Portal
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('trail@ourcoaching.pk');
                setPassword('trail123');
              }}
              className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-300"
            >
              ⚡ Fill 4-Day Trial
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('abdullah.owner@ourcoaching.pk');
                setPassword('abdullah');
              }}
              className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-indigo-300"
            >
              👑 Owner Login
            </button>
          </div>
        </div>
        <InlineAIAssistant role="guest" coachingName={coachingName} />
      </div>
    );
  }

  const isStaff = ['owner', 'teacher', 'trial'].includes(user.role);
  const isOwner = user.role === 'owner';
  const studentsList = data?.students || [];

  const dbTeachers = data?.teachers || [];
  const mergedTeachers = [
    ...localTeachers.filter((lt) => !dbTeachers.some((dt: any) => dt.email === lt.email)),
    ...dbTeachers,
  ];

  const attendanceList = data?.attendance || [];
  const myAttendance = attendanceList.find((a: any) => a.studentId === user.id);

  const presentCount = attendanceList.filter((a: any) => a.status === 'Present').length;
  const paidStudents = studentsList.filter((s: any) => getStudentFeeStatus(s) === 'Paid');
  const pendingStudents = studentsList.filter((s: any) => getStudentFeeStatus(s) === 'Pending');

  const paidFeeAmountTotal = paidStudents.reduce((sum: number, s: any) => sum + getStudentFeeAmount(s), 0);
  const pendingFeeAmountTotal = pendingStudents.reduce((sum: number, s: any) => sum + getStudentFeeAmount(s), 0);
  const totalTeacherSalaries = mergedTeachers.reduce((sum: number, t: any) => sum + getTeacherSalary(t), 0);

  const filteredStudents = studentsList.filter(
    (s: any) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.classGrade?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTenants = tenants.filter((t) =>
    tenantFilter === 'All' ? true : t.status === tenantFilter
  );

  const totalMRR = tenants
    .filter((t) => t.status !== 'Suspended')
    .reduce((acc, t) => acc + t.monthlyFee, 0);
  const collectedRevenue = tenants
    .filter((t) => t.paidStatus === 'Paid')
    .reduce((acc, t) => acc + t.monthlyFee, 0);
  const unpaidRevenue = tenants
    .filter((t) => t.paidStatus === 'Unpaid')
    .reduce((acc, t) => acc + t.monthlyFee, 0);

  const navItems: { key: TabKey; label: string; icon: any; ownerOnly?: boolean }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'students', label: `Students (${studentsList.length})`, icon: Users },
    { key: 'batches', label: `Batches (${batches.length})`, icon: CalendarClock },
    { key: 'exams', label: 'Exams', icon: ClipboardList },
    { key: 'homework', label: 'Homework', icon: BookOpen },
    { key: 'teachers', label: `Staff (${mergedTeachers.length})`, icon: UserCheck },
    { key: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'superadmin', label: 'Owner Hub', icon: Crown, ownerOnly: true },
  ];

  return (
    <div className="min-h-screen text-white pb-24">
      <InlineBackground3D />

      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-indigo-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg leading-tight">{coachingName}</h1>
            <span className="text-[11px] text-indigo-400 uppercase font-semibold tracking-wider">
              {user.role} Panel • IP: {data?.currentIP}
            </span>
          </div>
        </div>

        {isStaff && (
          <nav className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl text-xs overflow-x-auto max-w-full">
            {navItems
              .filter((item) => (!item.ownerOnly ? true : isOwner))
              .map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                      active
                        ? item.ownerOnly
                          ? 'bg-amber-500 text-slate-950 font-bold shadow'
                          : 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {item.label}
                  </button>
                );
              })}
          </nav>
        )}

        <div className="flex items-center gap-2.5">
          {actionMsg && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
              {actionMsg}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-600/80 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {isStaff && !isOwner && showUpgradeBanner && (
          <div className="bg-gradient-to-r from-indigo-950/85 via-purple-950/70 to-slate-900/85 backdrop-blur-xl border border-indigo-400/35 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white">
                  {user.role === 'trial'
                    ? `Free Trial Active • ${typeof user.trialDaysLeft === 'number' ? user.trialDaysLeft : 4} Day(s) Left`
                    : 'Active Coaching Plan'}
                </span>
                <span className="text-slate-300 ml-2">
                  Students: <strong className="text-indigo-300">{studentsList.length}</strong> • Staff:{' '}
                  <strong className="text-indigo-300">{mergedTeachers.length}</strong> • Batches:{' '}
                  <strong className="text-indigo-300">{batches.length}</strong>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openWhatsAppPlan('Trial Banner')}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl hover:opacity-95"
              >
                ⚡ Upgrade / Renew Plan
              </button>
              <button
                type="button"
                onClick={() => setShowUpgradeBanner(false)}
                className="text-slate-400 hover:text-white p-1"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {isOwner && (
          <div className="bg-gradient-to-r from-red-950/75 to-slate-900/85 backdrop-blur-xl border border-red-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-7 h-7 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-red-300 text-base">Owner Master Kill Switch</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Agar client payment na kare to isay ON karein—poora portal sab ke liye lock ho jayega (sirf aap login kar sakenge).
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                triggerAction({ action: 'TOGGLE_KILL_SWITCH', state: !data?.config?.killSwitchActive })
              }
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                data?.config?.killSwitchActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
              }`}
            >
              {data?.config?.killSwitchActive ? '🟢 UNLOCK PORTAL' : '🔴 ACTIVATE KILL SWITCH'}
            </button>
          </div>
        )}

        {user.role === 'student' && (
          <div className="space-y-6">
            <div className="bg-slate-900/75 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
              <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
              <p className="text-xs text-slate-400">
                Aaj ki Attendance Status:{' '}
                <span className="font-bold text-indigo-400">{myAttendance?.status || 'Not Marked Yet'}</span>
              </p>

              {data?.config?.ipAttendanceLock && (
                <div className="text-xs bg-amber-500/15 border border-amber-500/40 text-amber-300 p-3 rounded-xl flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  Coaching Wi-Fi IP Security Active ({data.config.allowedCoachingIP})
                </div>
              )}

              <button
                onClick={() => triggerAction({ action: 'MARK_ATTENDANCE' })}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-sm shadow-lg"
              >
                ✅ Mark My Present Today (Fix Absent)
              </button>
            </div>

            <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 max-w-3xl mx-auto">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Latest Homework & Study Material
              </h3>
              <div className="space-y-2.5 text-xs">
                {materials.map((m) => (
                  <div key={m.id} className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-3.5">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{m.title}</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                        {m.type} • Due {m.dueDate}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1">{m.linkOrNote}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isStaff && activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Students</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold mt-2">{studentsList.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {batches.length} Batches • Staff: {mergedTeachers.length}
                </div>
              </div>

              <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Present Today</span>
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-2">{presentCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {data?.config?.ipAttendanceLock ? 'IP Geofence Active' : 'Open attendance mode'}
                </div>
              </div>

              <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Fee Paid ({paidStudents.length})</span>
                  <DollarSign className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold text-teal-300 mt-2">
                  Rs. {paidFeeAmountTotal.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Custom student fees total</div>
              </div>

              <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Fee Pending ({pendingStudents.length})</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-300 mt-2">
                  Rs. {pendingFeeAmountTotal.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Staff Salaries: Rs. {totalTeacherSalaries.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/75 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Wifi className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    Coaching Wi-Fi / IP Address Attendance Lock
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ON karne par students sirf coaching center ke Wi-Fi IP ({data?.currentIP}) se apni present laga sakenge, ghar se nahi.
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  triggerAction({ action: 'TOGGLE_IP_LOCK', state: !data?.config?.ipAttendanceLock })
                }
                className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 ${
                  data?.config?.ipAttendanceLock
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-indigo-600 text-slate-200'
                }`}
              >
                {data?.config?.ipAttendanceLock ? '🔒 IP Lock ON' : '🔓 Enable IP Lock'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  setNewRole('student');
                  setActiveTab('students');
                }}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                + Add Student & Custom Fee
              </button>
              <button
                onClick={() => {
                  setNewRole('teacher');
                  setActiveTab('students');
                }}
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                + Add Staff / Teacher & Salary
              </button>
              <button
                onClick={() => setActiveTab('batches')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                🕒 Batches & Timetable
              </button>
              <button
                onClick={exportStudentsCSV}
                className="bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                ⬇ Export CSV
              </button>
            </div>
          </>
        )}

        {isStaff && activeTab === 'students' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form
                onSubmit={handleAddUser}
                className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-3.5 h-fit"
              >
                <div className="flex items-center gap-2 font-bold text-indigo-300 text-sm">
                  <UserPlus className="w-4 h-4" /> Create Student or Staff ID
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Account Type</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'student' | 'teacher')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none font-semibold text-indigo-200"
                  >
                    <option value="student">Student (Custom Fee)</option>
                    <option value="teacher">Teacher / Staff (Custom Salary)</option>
                  </select>
                </div>

                <input
                  required
                  placeholder={newRole === 'student' ? 'Student Full Name (e.g. Ali Raza)' : 'Teacher / Staff Full Name'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Custom Email (e.g. ali@ourcoaching.pk)"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                />
                <input
                  required
                  type="text"
                  placeholder="Custom Password (Set Any)"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                />

                <input
                  placeholder={newRole === 'student' ? 'Class / Batch (e.g. 10th Matric)' : 'Subject / Role (e.g. Physics Teacher)'}
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                />

                {newRole === 'student' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="number"
                      min="0"
                      placeholder="Student Fee (Rs.)"
                      value={newStudentFeeAmount}
                      onChange={(e) => setNewStudentFeeAmount(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                    <select
                      value={newFee}
                      onChange={(e) => setNewFee(e.target.value as 'Paid' | 'Pending')}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option value="Paid">Fee: Paid</option>
                      <option value="Pending">Fee: Pending</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Salary (Rs.)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      placeholder="Enter Teacher / Staff Salary (e.g. 35000)"
                      value={newTeacherSalary}
                      onChange={(e) => setNewTeacherSalary(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-semibold text-xs"
                >
                  {newRole === 'student'
                    ? '+ Save Student & Custom Fee'
                    : '+ Save Teacher / Staff & Salary'}
                </button>
              </form>

              <div className="lg:col-span-2 bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 overflow-x-auto">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" /> Students, Custom Fees & Attendance ({filteredStudents.length})
                  </h3>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={markAllFilteredPresent}
                      className="bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-[11px] font-semibold shrink-0"
                    >
                      All Present
                    </button>
                    <div className="relative flex-1 sm:w-48">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search student..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-2">Student & Batch</th>
                      <th className="py-2.5 px-2">Credentials</th>
                      <th className="py-2.5 px-2">Fee & Receipt</th>
                      <th className="py-2.5 px-2">Attendance</th>
                      <th className="py-2.5 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStudents.map((st: any) => {
                      const att = attendanceList.find((a: any) => a.studentId === st._id);
                      const isPassVisible = showPasswords[st._id];
                      const feeState = getStudentFeeStatus(st);
                      const feeAmt = getStudentFeeAmount(st);

                      return (
                        <tr key={st._id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-2">
                            <div className="font-semibold text-white">{st.name}</div>
                            <div className="text-[11px] text-slate-400">{st.classGrade}</div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="text-indigo-300">{st.email}</div>
                            <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                              <KeyRound className="w-3 h-3" />
                              <span>{isPassVisible ? st.plainPasswordHint || '••••••' : '••••••'}</span>
                              <button
                                onClick={() =>
                                  setShowPasswords({ ...showPasswords, [st._id]: !isPassVisible })
                                }
                                className="text-slate-300 hover:text-white"
                              >
                                {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-2 space-y-1">
                            <div className="font-semibold text-slate-200">
                              Rs. {feeAmt.toLocaleString()}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleStudentFee(st)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                                feeState === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {feeState} ↻
                            </button>
                            <div>
                              <button
                                type="button"
                                onClick={() => setSelectedInvoiceStudent(st)}
                                className="text-[10px] text-indigo-300 hover:underline flex items-center gap-1"
                              >
                                <Receipt className="w-3 h-3" /> Invoice
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  triggerAction({
                                    action: 'MARK_ATTENDANCE',
                                    studentId: st._id,
                                    studentName: st.name,
                                    status: 'Present',
                                  })
                                }
                                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                                  att?.status === 'Present'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-emerald-600/40'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> P
                              </button>
                              <button
                                onClick={() =>
                                  triggerAction({
                                    action: 'MARK_ATTENDANCE',
                                    studentId: st._id,
                                    studentName: st.name,
                                    status: 'Absent',
                                  })
                                }
                                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                                  att?.status === 'Absent'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-red-600/40'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" /> A
                              </button>
                            </div>
                            {att?.markedBy && autoPresentNote && (
                              <div className="text-[10px] text-slate-500 mt-1">{att.markedBy}</div>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => copyReminderText(st)}
                                title="Copy Fee Reminder"
                                className="text-indigo-300 hover:text-white bg-slate-800/80 p-1.5 rounded-lg"
                              >
                                {copiedId === st._id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => triggerAction({ action: 'DELETE_USER', userId: st._id })}
                                className="text-red-400 hover:text-red-300 p-1.5"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedInvoiceStudent && (
              <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Fee Invoice Receipt — {coachingName}
                  </div>
                  <div>
                    Student: <strong className="text-white">{selectedInvoiceStudent.name}</strong> ({selectedInvoiceStudent.classGrade})
                  </div>
                  <div>
                    Student Fee:{' '}
                    <strong className="text-emerald-300">
                      Rs. {getStudentFeeAmount(selectedInvoiceStudent).toLocaleString()}
                    </strong>{' '}
                    • Status: <strong>{getStudentFeeStatus(selectedInvoiceStudent)}</strong> • Date:{' '}
                    {new Date().toISOString().split('T')[0]}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Receipt
                  </button>
                  <button
                    onClick={() => setSelectedInvoiceStudent(null)}
                    className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isStaff && activeTab === 'batches' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={handleAddBatch}
              className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-3.5 h-fit"
            >
              <h3 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                <CalendarClock className="w-4 h-4" /> Create Batch & Timetable
              </h3>
              <input
                required
                value={batchTitle}
                onChange={(e) => setBatchTitle(e.target.value)}
                placeholder="Batch Name (e.g. 10th Maths Evening)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
              <input
                required
                value={batchSchedule}
                onChange={(e) => setBatchSchedule(e.target.value)}
                placeholder="Days & Time (e.g. Mon - Thu • 4 PM - 5:30 PM)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
              <input
                value={batchTeacher}
                onChange={(e) => setBatchTeacher(e.target.value)}
                placeholder="Teacher Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
              <input
                value={batchRoom}
                onChange={(e) => setBatchRoom(e.target.value)}
                placeholder="Room / Hall"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-semibold text-xs"
              >
                + Save Batch Schedule
              </button>
            </form>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
              {batches.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-white text-sm">{b.title}</div>
                    <button
                      onClick={() => setBatches((prev) => prev.filter((item) => item.id !== b.id))}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-indigo-300 font-medium">{b.schedule}</div>
                  <div className="text-slate-400">
                    Teacher: <span className="text-slate-200">{b.teacher}</span> • Room:{' '}
                    <span className="text-slate-200">{b.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isStaff && activeTab === 'exams' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={handleAddExam}
              className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-3.5 h-fit"
            >
              <h3 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Enter Test Marks & Grade
              </h3>
              <input
                required
                value={examStudentName}
                onChange={(e) => setExamStudentName(e.target.value)}
                placeholder="Student Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
              <input
                required
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
                placeholder="Test / Subject Title"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="number"
                  value={examObtained}
                  onChange={(e) => setExamObtained(e.target.value)}
                  placeholder="Obtained Marks"
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                />
                <input
                  required
                  type="number"
                  value={examTotal}
                  onChange={(e) => setExamTotal(e.target.value)}
                  placeholder="Total Marks"
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-semibold text-xs"
              >
                + Save Result & Auto-Grade
              </button>
            </form>

            <div className="lg:col-span-2 bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 overflow-x-auto">
              <h3 className="font-bold text-sm mb-4">Exams & Grading Sheet ({examRecords.length})</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-2">Student</th>
                    <th className="py-2.5 px-2">Test / Subject</th>
                    <th className="py-2.5 px-2">Marks</th>
                    <th className="py-2.5 px-2">% & Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {examRecords.map((ex) => {
                    const res = getGrade(ex.obtained, ex.total);
                    return (
                      <tr key={ex.id}>
                        <td className="py-2.5 px-2 font-semibold">{ex.studentName}</td>
                        <td className="py-2.5 px-2 text-slate-300">{ex.subject}</td>
                        <td className="py-2.5 px-2">
                          {ex.obtained} / {ex.total}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                            {res.pct}% ({res.grade})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isStaff && activeTab === 'homework' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={handleAddMaterial}
              className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-3.5 h-fit"
            >
              <h3 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Share Homework / Study Material
              </h3>
              <input
                required
                value={hwTitle}
                onChange={(e) => setHwTitle(e.target.value)}
                placeholder="Title (e.g. Physics Numericals Sheet)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={hwType}
                  onChange={(e) => setHwType(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  <option value="Homework">Homework</option>
                  <option value="Study Note">Study Note</option>
                  <option value="Assignment">Assignment</option>
                </select>
                <input
                  value={hwBatch}
                  onChange={(e) => setHwBatch(e.target.value)}
                  placeholder="Batch"
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
              <input
                type="date"
                value={hwDueDate}
                onChange={(e) => setHwDueDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none"
              />
              <textarea
                rows={3}
                value={hwNote}
                onChange={(e) => setHwNote(e.target.value)}
                placeholder="Instructions or notes link..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-semibold text-xs"
              >
                + Publish Resource
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm text-white">{m.title}</div>
                    <span className="bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                      {m.type} • {m.batch}
                    </span>
                  </div>
                  <p className="text-slate-300">{m.linkOrNote}</p>
                  <div className="text-[11px] text-slate-400">Due / Date: {m.dueDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isStaff && activeTab === 'teachers' && (
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-400" /> Staff & Teachers Directory ({mergedTeachers.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total Monthly Staff Salaries:{' '}
                  <strong className="text-emerald-300">Rs. {totalTeacherSalaries.toLocaleString()}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setNewRole('teacher');
                  setActiveTab('students');
                }}
                className="bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-xl text-xs font-semibold"
              >
                + Add Teacher / Staff & Salary
              </button>
            </div>
            {mergedTeachers.length === 0 ? (
              <p className="text-xs text-slate-400">
                Abhi koi teacher/staff account add nahi hua. "+ Add Teacher / Staff & Salary" par click karke naya teacher account aur salary set kar sakte hain.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {mergedTeachers.map((tc: any) => (
                  <div key={tc._id} className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 space-y-1.5">
                    <div className="font-bold text-white text-sm">{tc.name}</div>
                    <div className="text-indigo-300">{tc.email}</div>
                    <div className="text-slate-400">Batch / Subject: {tc.classGrade || defaultBatch}</div>
                    <div className="pt-1 flex items-center gap-1.5 text-emerald-300 font-semibold">
                      <Wallet className="w-3.5 h-3.5" /> Salary: Rs. {getTeacherSalary(tc).toLocaleString()}/mo
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isStaff && activeTab === 'reports' && (
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Summary Reports & Export
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Download CSV spreadsheet or print formatted summary for {coachingName}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportStudentsCSV}
                  className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
                <div className="text-slate-400">Attendance Rate Today</div>
                <div className="text-xl font-bold text-emerald-300 mt-1">
                  {studentsList.length > 0 ? Math.round((presentCount / studentsList.length) * 100) : 0}%
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
                <div className="text-slate-400">Collected Custom Fees</div>
                <div className="text-xl font-bold text-indigo-300 mt-1">
                  Rs. {paidFeeAmountTotal.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
                <div className="text-slate-400">Monthly Staff Payroll</div>
                <div className="text-xl font-bold text-purple-300 mt-1">
                  Rs. {totalTeacherSalaries.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {isStaff && activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" /> Coaching Workspace Preferences
              </h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Coaching / Academy Name</label>
                <input
                  value={coachingName}
                  onChange={(e) => setCoachingName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Default Class / Batch</label>
                <input
                  value={defaultBatch}
                  onChange={(e) => setDefaultBatch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <label className="flex items-center justify-between text-xs text-slate-300 pt-1 cursor-pointer">
                <span>Show "Marked By" audit note on attendance rows</span>
                <input
                  type="checkbox"
                  checked={autoPresentNote}
                  onChange={(e) => setAutoPresentNote(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4"
                />
              </label>

              <p className="text-[11px] text-slate-400">
                Har student ki fee uske admission form se aur har teacher ki salary uske account form se alag set hoti hai.
              </p>
            </div>

            <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wifi className="w-4 h-4 text-indigo-400" /> Plan, Trial & Network Security
              </h3>
              <div className="text-xs space-y-2 text-slate-300">
                <div>
                  <span className="text-slate-400">Account:</span> {user.name} ({user.role})
                </div>
                <div>
                  <span className="text-slate-400">Session IP:</span>{' '}
                  <span className="font-mono text-indigo-300">{data?.currentIP}</span>
                </div>
                <div>
                  <span className="text-slate-400">IP Attendance Lock:</span>{' '}
                  <span className="font-semibold">
                    {data?.config?.ipAttendanceLock ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                {typeof user.trialDaysLeft === 'number' && (
                  <div>
                    <span className="text-slate-400">Trial Days Remaining:</span>{' '}
                    <span className="text-amber-300 font-semibold">{user.trialDaysLeft} Day(s)</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() =>
                    triggerAction({ action: 'TOGGLE_IP_LOCK', state: !data?.config?.ipAttendanceLock })
                  }
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  {data?.config?.ipAttendanceLock ? 'Disable IP Lock' : 'Lock to Current Wi-Fi IP'}
                </button>
                <button
                  type="button"
                  onClick={() => openWhatsAppPlan('Settings Tab')}
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Request Plan Upgrade
                </button>
              </div>
            </div>
          </div>
        )}

        {isOwner && activeTab === 'superadmin' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Estimated Monthly Recurring Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">Rs. {totalMRR.toLocaleString()}</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-400">Paid Invoices</div>
                <div className="text-2xl font-bold text-emerald-400 mt-2">
                  Rs. {collectedRevenue.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-400">Unpaid / Pending Invoices</div>
                <div className="text-2xl font-bold text-amber-300 mt-2">
                  Rs. {unpaidRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 overflow-x-auto">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-sm flex items-center gap-2 text-amber-300">
                  <Crown className="w-4 h-4" /> All Clients / Tenants, Trial Control & Plans
                </h3>
                <div className="flex items-center gap-1.5 text-xs">
                  {(['All', 'Trial', 'Active', 'Expired', 'Suspended'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setTenantFilter(st)}
                      className={`px-2.5 py-1 rounded-lg ${
                        tenantFilter === st
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-2">Client / Academy</th>
                    <th className="py-2.5 px-2">Status & Trial</th>
                    <th className="py-2.5 px-2">Plan & Limits</th>
                    <th className="py-2.5 px-2">Billing</th>
                    <th className="py-2.5 px-2 text-right">Trial & Lock Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-2">
                        <div className="font-semibold text-white">{t.name}</div>
                        <div className="text-[11px] text-slate-400">{t.ownerEmail}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.status === 'Active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : t.status === 'Trial'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {t.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {t.trialStart} → {t.trialEnd} ({t.daysLeft}d left)
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={t.plan}
                          onChange={(e) => updateTenantPlan(t.id, e.target.value as any)}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] outline-none"
                        >
                          <option value="Starter">Starter (75)</option>
                          <option value="Pro">Pro (250)</option>
                          <option value="Enterprise">Enterprise (1000)</option>
                        </select>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Usage: {t.studentsUsed}/{t.studentLimit}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-semibold">Rs. {t.monthlyFee.toLocaleString()}/mo</div>
                        <button
                          onClick={() => toggleTenantInvoice(t.id)}
                          className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.paidStatus === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {t.paidStatus} ↻
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => extendTenantTrial(t.id, 4)}
                            className="bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                          >
                            +4d Trial
                          </button>
                          <button
                            onClick={() => toggleTenantLock(t.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                              t.status === 'Suspended'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-red-600/80 hover:bg-red-600 text-white'
                            }`}
                          >
                            {t.status === 'Suspended' ? 'Unlock' : 'Lock'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-300">
                  <Activity className="w-4 h-4" /> Global Usage & Health Monitor
                </h4>
                <div className="bg-slate-800/60 rounded-xl p-3 flex justify-between">
                  <span className="text-slate-400">API & Database Cluster</span>
                  <span className="text-emerald-400 font-semibold">● Healthy (MongoDB Connected)</span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 flex justify-between">
                  <span className="text-slate-400">Total Portal Students (Live DB)</span>
                  <span className="font-semibold text-white">{studentsList.length} records</span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 flex justify-between">
                  <span className="text-slate-400">Global Kill Switch</span>
                  <span className="font-semibold text-amber-300">
                    {data?.config?.killSwitchActive ? 'ACTIVE (Locked)' : 'OFF (Normal)'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <h4 className="font-bold text-sm flex items-center gap-2 text-indigo-300">
                  <Globe className="w-4 h-4" /> IP / Access & Activity Logs
                </h4>
                <div className="space-y-2">
                  {tenants.map((t) => (
                    <div
                      key={t.id}
                      className="bg-slate-800/60 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white">{t.name}</div>
                        <div className="text-[10px] text-slate-400">
                          IP: <span className="font-mono text-indigo-300">{t.lastIP}</span> • Devices: {t.devices}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-300">{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <form
                onSubmit={handlePublishNotice}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs"
              >
                <h4 className="font-bold text-sm flex items-center gap-2 text-indigo-300">
                  <Megaphone className="w-4 h-4" /> Send Client Announcement
                </h4>
                <input
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="Announcement Title"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 outline-none"
                />
                <select
                  value={noticeTarget}
                  onChange={(e) => setNoticeTarget(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 outline-none"
                >
                  <option value="All Tenants">All Tenants (Trial + Paid)</option>
                  <option value="Trial Only">Trial Accounts Only</option>
                  <option value="Unpaid Dues">Unpaid Billing Accounts</option>
                </select>
                <textarea
                  required
                  rows={2}
                  value={noticeBody}
                  onChange={(e) => setNoticeBody(e.target.value)}
                  placeholder="Write update or notice..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl font-semibold"
                >
                  Publish Notice
                </button>
              </form>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <h4 className="font-bold text-sm flex items-center gap-2 text-amber-300">
                  <Sliders className="w-4 h-4" /> Support Requests & Recent Notices
                </h4>
                <div className="space-y-2">
                  {supportTickets.map((tk) => (
                    <div
                      key={tk.id}
                      className="bg-slate-800/60 rounded-xl p-3 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-semibold text-white">{tk.tenant}</div>
                        <div className="text-slate-300 mt-0.5">{tk.subject}</div>
                      </div>
                      <button
                        onClick={() =>
                          setSupportTickets((prev) =>
                            prev.map((item) =>
                              item.id === tk.id
                                ? { ...item, status: item.status === 'Open' ? 'Resolved' : 'Open' }
                                : item
                            )
                          )
                        }
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ${
                          tk.status === 'Resolved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {tk.status}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  {announcements.map((a) => (
                    <div key={a.id} className="text-[11px] text-slate-300">
                      <strong className="text-indigo-300">[{a.target}] {a.title}:</strong> {a.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <InlineAIAssistant role={user.role} coachingName={coachingName} />
    </div>
  );
}