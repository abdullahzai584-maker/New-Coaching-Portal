"use client";

import React, { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const canvasRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 34 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(129, 140, 248, 0.45)";
      ctx.strokeStyle = "rgba(129, 140, 248, 0.12)";

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  async function handleLogin(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage("");
    setActiveUser(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || "Login failed.");
      } else {
        setActiveUser(data?.user || null);
        setMessage(
          `Login successful! Welcome, ${data?.user?.name || "User"} (${data?.user?.role || "member"})`
        );
      }
    } catch {
      setMessage("Network error while logging in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="portal-shell">
      <canvas ref={canvasRef} className="portal-canvas" />

      <section className="login-card">
        <div className="brand-row">
          <div className="brand-badge">🎓</div>
          <div>
            <h1 className="brand-title">OurCoaching Pro</h1>
            <p className="brand-subtitle">
              Next-Gen Coaching Management &amp; Attendance OS
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <input
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@ourcoaching.pk"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing In..." : "Sign In to Portal"}
          </button>
        </form>

        <div className="quick-grid">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEmail("trial@ourcoaching.pk");
              setPassword("trial123");
              setMessage("4-Day Trial credentials filled (trial@ourcoaching.pk / trial123).");
            }}
          >
            ⚡ Fill 4-Day Trial
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEmail("owner@ourcoaching.pk");
              setPassword("owner123");
              setMessage("Owner credentials filled (owner@ourcoaching.pk / owner123).");
            }}
          >
            👑 Owner Login
          </button>
        </div>

        <button
          type="button"
          className="btn-guide"
          onClick={() =>
            setMessage(
              "AI Guide: Owner Login ya Fill 4-Day Trial dabakar Sign In to Portal click karein."
            )
          }
        >
          🤖 AI Guide
        </button>

        {message && <div className="status-box">{message}</div>}

        {activeUser && (
          <div className="status-box">
            <strong>Account:</strong> {activeUser.email}
            <br />
            <strong>Role:</strong> {activeUser.role}
            {typeof activeUser.trialDaysLeft === "number" && (
              <>
                <br />
                <strong>Trial Days Left:</strong> {activeUser.trialDaysLeft}
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
