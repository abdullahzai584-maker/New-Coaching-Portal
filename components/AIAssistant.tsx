'use client';
import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function AIAssistant({ role }: { role: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Salam! Main aapka Coaching AI Assistant hoon. Aap abhi "${role.toUpperCase()}" mode mein hain. IP Lock, Attendance, ya Student Credentials ke baare mein kuch bhi poochein!`,
    },
  ]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.toLowerCase();
    let reply = 'Aap dashboard se Students, Attendance, aur Security settings manage kar sakte hain.';

    if (q.includes('ip') || q.includes('attendance') || q.includes('present')) {
      reply =
        'IP Attendance Lock ON karne par portal current Wi-Fi IP save kar leta hai. Student jab apni ID se login karega to sirf usi coaching Wi-Fi par apni Present mark kar sakega!';
    } else if (q.includes('kill') || q.includes('band') || q.includes('lock')) {
      reply =
        'Owner Dashboard mein "Master Kill Switch" red button hai. Agar kisi client ne payment nahi ki to usay ON karein—foran sabka access lock ho jayega (sirf Owner login kar sakega).';
    } else if (q.includes('trial') || q.includes('4 din')) {
      reply =
        'Trial account (trail@ourcoaching.pk) har IP network par pehle login se exact 4 din tak chalta hai. 10 devices se bhi login ho, 4 din baad us IP ke sab logins auto-expire ho jayenge.';
    } else if (q.includes('password') || q.includes('student')) {
      reply =
        'Teacher panel mein "Add Student" form se aap apni marzi ka Email aur Password set kar sakte hain, aur table mein har student ka password dekh bhi sakte hain.';
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