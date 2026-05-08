"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Detect high-refresh-rate support
const supportsHighFPS = typeof window !== "undefined"
  ? (window.screen as any).refreshRate > 60 || matchMedia("(min-resolution: 2dppx)").matches
  : false;

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState({ subs: 0, views: 0, likes: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // ── 3D Canvas Effect ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const isMobile = W < 640;
    const SHAPE_COUNT    = isMobile ? 5  : 12;
    const PARTICLE_COUNT = isMobile ? 35 : 100;

    type Shape = {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      rotX: number; rotY: number; rotZ: number;
      rotSpeedX: number; rotSpeedY: number; rotSpeedZ: number;
      size: number;
      type: "cube" | "tetra" | "ring";
      alpha: number;
      pulseOffset: number;
    };

    type Particle = {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      size: number;
      alpha: number;
      colorR: number; colorG: number; colorB: number;
    };

    const shapes: Shape[] = Array.from({ length: SHAPE_COUNT }, () => ({
      x: (Math.random() - 0.5) * W * 1.4,
      y: (Math.random() - 0.5) * H * 1.4,
      z: Math.random() * 300 + 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      vz: (Math.random() - 0.5) * 0.15,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 0.01,
      rotSpeedY: (Math.random() - 0.5) * 0.012,
      rotSpeedZ: (Math.random() - 0.5) * 0.008,
      size: isMobile ? Math.random() * 20 + 14 : Math.random() * 32 + 18,
      type: (["cube", "tetra", "ring"] as const)[Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.25 + 0.08,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const colorPalette = [
      [255, 77,  0],
      [255, 102, 34],
      [255, 153, 51],
      [255, 170, 68],
      [255, 51,  0],
    ] as const;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 500 + 50,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.3 + 0.1),
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        colorR: c[0], colorG: c[1], colorB: c[2],
      };
    });

    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
      const scale = 500 / (500 + z);
      return { sx: cx + x * scale, sy: cy + y * scale, scale };
    };

    const rotatePoint = (px: number, py: number, pz: number, rx: number, ry: number, rz: number) => {
      const y1 = py * Math.cos(rx) - pz * Math.sin(rx);
      const z1 = py * Math.sin(rx) + pz * Math.cos(rx);
      const x2 = px * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -px * Math.sin(ry) + z1 * Math.cos(ry);
      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
      return { x: x3, y: y3, z: z2 };
    };

    const projBuf: { sx: number; sy: number }[] = Array.from({ length: 16 }, () => ({ sx: 0, sy: 0 }));

    const drawCube = (shape: Shape, cx: number, cy: number, t: number) => {
      const s = shape.size;
      const verts: [number, number, number][] = [
        [-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
        [-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s],
      ];
      const edges: [number, number][] = [
        [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],
      ];
      const pulse = 1 + Math.sin(t * 0.002 + shape.pulseOffset) * 0.08;
      for (let i = 0; i < 8; i++) {
        const [px, py, pz] = verts[i];
        const r = rotatePoint(px * pulse, py * pulse, pz * pulse, shape.rotX, shape.rotY, shape.rotZ);
        const p = project(r.x + shape.x, r.y + shape.y, r.z + shape.z, cx, cy);
        projBuf[i].sx = p.sx; projBuf[i].sy = p.sy;
      }
      const alpha = shape.alpha * (0.85 + Math.sin(t * 0.001 + shape.pulseOffset) * 0.15);
      ctx.strokeStyle = `rgba(255,100,30,${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(projBuf[a].sx, projBuf[a].sy);
        ctx.lineTo(projBuf[b].sx, projBuf[b].sy);
      }
      ctx.stroke();
    };

    const drawTetra = (shape: Shape, cx: number, cy: number, t: number) => {
      const s = shape.size * 1.3;
      const verts: [number, number, number][] = [
        [0, -s, 0],
        [-s * 0.866, s * 0.5, s * 0.5],
        [s * 0.866, s * 0.5, s * 0.5],
        [0, s * 0.5, -s],
      ];
      const edges: [number, number][] = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];
      const pulse = 1 + Math.sin(t * 0.0015 + shape.pulseOffset) * 0.1;
      for (let i = 0; i < 4; i++) {
        const [px, py, pz] = verts[i];
        const r = rotatePoint(px * pulse, py * pulse, pz * pulse, shape.rotX, shape.rotY, shape.rotZ);
        const p = project(r.x + shape.x, r.y + shape.y, r.z + shape.z, cx, cy);
        projBuf[i].sx = p.sx; projBuf[i].sy = p.sy;
      }
      const alpha = shape.alpha * (0.85 + Math.sin(t * 0.0013 + shape.pulseOffset) * 0.15);
      ctx.strokeStyle = `rgba(255,140,40,${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(projBuf[a].sx, projBuf[a].sy);
        ctx.lineTo(projBuf[b].sx, projBuf[b].sy);
      }
      ctx.stroke();
    };

    const drawRing = (shape: Shape, cx: number, cy: number, t: number) => {
      const segments = 12;
      const r = shape.size;
      const pulse = 1 + Math.sin(t * 0.002 + shape.pulseOffset) * 0.06;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const px = Math.cos(angle) * r * pulse;
        const py = Math.sin(angle) * r * pulse;
        const rot = rotatePoint(px, py, 0, shape.rotX, shape.rotY, shape.rotZ);
        const p = project(rot.x + shape.x, rot.y + shape.y, rot.z + shape.z, cx, cy);
        projBuf[i].sx = p.sx; projBuf[i].sy = p.sy;
      }
      const alpha = shape.alpha * (0.9 + Math.sin(t * 0.0018 + shape.pulseOffset) * 0.1);
      ctx.strokeStyle = `rgba(255,70,0,${alpha.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(projBuf[0].sx, projBuf[0].sy);
      for (let i = 1; i < segments; i++) ctx.lineTo(projBuf[i].sx, projBuf[i].sy);
      ctx.closePath();
      ctx.stroke();
    };

    let lastTs = 0;
    let t = 0;

    const render = (ts: number) => {
      animFrameRef.current = requestAnimationFrame(render);
      const delta = ts - lastTs;
      if (delta < 4) return;
      lastTs = ts;
      const dtFactor = Math.min(delta / 16.67, 3);
      t += dtFactor;

      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * dtFactor;
        p.y += p.vy * dtFactor;
        p.z += p.vz * dtFactor;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.z < 0)   p.z = 500;
        if (p.z > 500) p.z = 0;

        const proj = project(p.x - cx, p.y - cy, p.z, cx, cy);
        const sz    = Math.max(p.size * proj.scale, 0.3);
        const alpha = Math.min(p.alpha * proj.scale, 1);

        ctx.globalAlpha = alpha;
        ctx.fillStyle   = `rgb(${p.colorR},${p.colorG},${p.colorB})`;
        ctx.beginPath();
        ctx.arc(proj.sx, proj.sy, sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        shape.rotX += shape.rotSpeedX * dtFactor;
        shape.rotY += shape.rotSpeedY * dtFactor;
        shape.rotZ += shape.rotSpeedZ * dtFactor;
        shape.x    += shape.vx * dtFactor;
        shape.y    += shape.vy * dtFactor;
        shape.z    += shape.vz * dtFactor;

        if (Math.abs(shape.x) > W * 0.8) shape.vx *= -1;
        if (Math.abs(shape.y) > H * 0.8) shape.vy *= -1;
        if (shape.z < 50 || shape.z > 600) shape.vz *= -1;

        if      (shape.type === "cube")  drawCube(shape, cx, cy, t);
        else if (shape.type === "tetra") drawTetra(shape, cx, cy, t);
        else                             drawRing(shape, cx, cy, t);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Stats counter (FIXED) ──
  useEffect(() => {
    setMounted(true);

    // Delay matches the statsReveal CSS animation delay (0.9s)
    // so the counter starts counting exactly when the cards become visible
    const delay = setTimeout(() => {
      let step = 0;
      const steps = 60;
      const duration = 1800;
      const interval = duration / steps;

      const timer = setInterval(() => {
        step++;
        const ease = 1 - Math.pow(1 - step / steps, 3);
        setCount({
          subs:  Math.floor(ease * 206),
          views: Math.floor(ease * 320),
          likes: Math.floor(ease * 203),
        });
        if (step >= steps) clearInterval(timer);
      }, interval);

      // Cleanup inner interval if outer timeout is cleared
      return () => clearInterval(timer);
    }, 900); // ← THE FIX: wait for reveal animation before counting

    return () => clearTimeout(delay);
  }, []);

  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(160deg, #060606 0%, #0f0600 45%, #060606 100%)",
      padding: "clamp(80px, 12vw, 130px) 1.5rem clamp(60px, 10vw, 100px)",
      textAlign: "center",
      borderBottom: "1px solid rgba(255,77,0,0.12)",
    }}>

      <style>{`
        @keyframes orbFloat1 {
          0%,100% { transform: translateY(0) translateX(0) scale(1); }
          33%      { transform: translateY(-40px) translateX(20px) scale(1.05); }
          66%      { transform: translateY(20px) translateX(-15px) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translateY(0) translateX(0); }
          50%      { transform: translateY(30px) translateX(-25px); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-20px) rotate(8deg); }
        }
        @keyframes gridPan {
          from { transform: translate(0, 0); }
          to   { transform: translate(55px, 55px); }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.3); }
          50%      { box-shadow: 0 0 0 8px rgba(255,77,0,0); }
        }
        @keyframes dotBlink {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes titleReveal {
          from { opacity: 0; transform: translateY(40px) skewY(2deg); }
          to   { opacity: 1; transform: translateY(0) skewY(0deg); }
        }
        @keyframes nameShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes subtitleFade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnGlow {
          0%,100% { box-shadow: 0 4px 20px rgba(255,77,0,0.35), 0 0 0 0 rgba(255,77,0,0.2); }
          50%      { box-shadow: 0 8px 40px rgba(255,77,0,0.6), 0 0 0 8px rgba(255,77,0,0); }
        }
        @keyframes btnShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes statsReveal {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnScan {
          from { left: -100%; }
          to   { left: 160%; }
        }
        @keyframes tagFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #ff4d00, #ff6600, #ff9900, #ff6600, #ff4d00);
          background-size: 300% 300%;
          color: #fff;
          padding: clamp(14px, 2.5vw, 18px) clamp(28px, 5vw, 48px);
          border-radius: 60px;
          text-decoration: none;
          font-weight: 700;
          font-size: clamp(13px, 2vw, 15px);
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          animation: btnShimmer 4s ease infinite, btnGlow 2.5s ease infinite;
          position: relative;
          overflow: hidden;
        }
        .hero-btn:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow: 0 12px 50px rgba(255,77,0,0.7);
        }
        .hero-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-20deg);
          animation: btnScan 3s ease infinite;
        }

        .hero-secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          color: #888;
          padding: clamp(14px, 2.5vw, 18px) clamp(20px, 4vw, 36px);
          border-radius: 60px;
          text-decoration: none;
          font-weight: 600;
          font-size: clamp(12px, 1.8vw, 14px);
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .hero-secondary-btn:hover {
          background: rgba(255,255,255,0.07);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .stat-card {
          position: relative;
          padding: 20px 28px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,77,0,0.1);
          border-radius: 16px;
          text-align: center;
          flex: 1;
          min-width: 120px;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        .stat-card:hover {
          background: rgba(255,77,0,0.05);
          border-color: rgba(255,77,0,0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(255,77,0,0.1);
        }

        .floating-tag {
          position: absolute;
          background: rgba(20,5,0,0.85);
          border: 1px solid rgba(255,77,0,0.2);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 11px;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          font-weight: 600;
          color: rgba(255,77,0,0.7);
          letter-spacing: 0.5px;
          white-space: nowrap;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .floating-tag { display: none; }
          .stat-card { padding: 16px 14px; min-width: 90px; }
          .hero-actions { flex-direction: column; align-items: center; }
          .hero-btn, .hero-secondary-btn { width: 100%; max-width: 300px; justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          canvas { display: none; }
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── 3D Canvas ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.75,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />

      {/* ── Grid ── */}
      <div style={{
        position: "absolute",
        inset: "-55px",
        backgroundImage: "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)",
        backgroundSize: "55px 55px",
        animation: "gridPan 20s linear infinite",
        pointerEvents: "none",
        zIndex: 0,
        transform: "translateZ(0)",
      }} />

      {/* ── Radial vignette ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,77,0,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Orbs ── */}
      {([
        { w:380, h:380, top:"5%",    left:"-5%",  color:"rgba(255,60,0,0.07)",  anim:"orbFloat1 10s ease-in-out infinite",         blur:40 },
        { w:260, h:260, top:"55%",   right:"-3%", color:"rgba(255,100,0,0.05)", anim:"orbFloat2 13s ease-in-out infinite",         blur:35 },
        { w:200, h:200, top:"20%",   right:"15%", color:"rgba(255,140,0,0.04)", anim:"orbFloat3 8s ease-in-out infinite",          blur:28 },
        { w:150, h:150, bottom:"10%",left:"15%",  color:"rgba(255,40,0,0.05)",  anim:"orbFloat2 11s ease-in-out infinite reverse", blur:22 },
      ] as const).map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          width: orb.w, height: orb.h,
          borderRadius: "50%",
          background: orb.color,
          filter: `blur(${orb.blur}px)`,
          animation: orb.anim,
          top: (orb as any).top,
          bottom: (orb as any).bottom,
          left: (orb as any).left,
          right: (orb as any).right,
          pointerEvents: "none",
          zIndex: 0,
        }} />
      ))}

      {/* ── Floating tags ── */}
      {[
        { text: "📱 Smartphone Reviews", top: "18%", left: "4%",    delay: "0s" },
        { text: "💻 Laptop Guides",      top: "28%", right: "4%",   delay: "0.4s" },
        { text: "🎮 Gaming Gear",        bottom: "28%", left: "3%", delay: "0.8s" },
        { text: "⭐ Honest Opinions",    bottom: "22%", right: "3%",delay: "1.2s" },
      ].map((tag, i) => (
        <div key={i} className="floating-tag" style={{
          top: (tag as any).top,
          bottom: (tag as any).bottom,
          left: (tag as any).left,
          right: (tag as any).right,
          animation: `tagFloat ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: tag.delay,
          opacity: mounted ? 1 : 0,
          transition: `opacity 0.6s ease ${tag.delay}`,
          zIndex: 1,
        }}>
          {tag.text}
        </div>
      ))}

      {/* ── Main content ── */}
      <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,77,0,0.08)",
          border: "1px solid rgba(255,77,0,0.28)",
          color: "#ff6622",
          fontSize: "10px", fontWeight: "700",
          padding: "6px 18px", borderRadius: "50px",
          letterSpacing: "2.5px", textTransform: "uppercase",
          marginBottom: "32px",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          animation: mounted ? "badgePulse 2.5s ease infinite, subtitleFade 0.6s ease both" : "none",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#ff4d00", display: "inline-block",
            animation: "dotBlink 1.5s ease-in-out infinite",
          }} />
          Tamil Tech Reviews &amp; News
        </div>

        {/* Main title */}
        <div style={{ marginBottom: "10px" }}>
          <h1 style={{
            fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
            fontWeight: "700",
            color: "#999",
            lineHeight: "1.1",
            margin: 0,
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            letterSpacing: "-0.5px",
            animation: mounted ? "titleReveal 0.9s ease 0.1s both" : "none",
          }}>
            Welcome to
          </h1>
        </div>

        <h1 style={{
          fontSize: "clamp(3rem, 9vw, 6.5rem)",
          fontWeight: "900",
          lineHeight: "1.0",
          margin: "0 0 28px",
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          letterSpacing: "-3px",
          background: "linear-gradient(135deg, #ff6622 0%, #ffaa44 30%, #ff4d00 55%, #ffcc66 75%, #ff4d00 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: mounted ? "titleReveal 0.9s ease 0.25s both, nameShimmer 4s linear infinite" : "none",
        }}>
          TechSuperStar
        </h1>

        <p style={{
          color: "#666",
          fontSize: "clamp(14px, 2.2vw, 18px)",
          lineHeight: "1.75",
          margin: "0 auto 44px",
          maxWidth: "520px",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontWeight: "400",
          animation: mounted ? "subtitleFade 0.8s ease 0.5s both" : "none",
        }}>
          Your ultimate source for <span style={{ color: "#ff6622", fontWeight: 600 }}>honest tech reviews</span>, buying guides, and the latest news — all in Tamil.
        </p>

        {/* CTAs */}
        <div className="hero-actions" style={{
          display: "flex", justifyContent: "center",
          gap: "14px", flexWrap: "wrap",
          animation: mounted ? "subtitleFade 0.8s ease 0.65s both" : "none",
        }}>
          <Link href="/articles" className="hero-btn">
            Browse All Articles
            <span style={{ fontSize: "18px", lineHeight: 1 }}>→</span>
          </Link>
          <Link href="https://www.youtube.com/@TechSuperStarOfficial" target="_blank" className="hero-secondary-btn">
            ▶ Watch on YouTube
          </Link>
        </div>

        {/* Divider */}
        <div style={{
          width: "1px", height: "48px",
          background: "linear-gradient(to bottom, transparent, rgba(255,77,0,0.3), transparent)",
          margin: "48px auto 0",
          animation: mounted ? "subtitleFade 0.8s ease 0.8s both" : "none",
        }} />

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "12px", marginTop: "28px",
          flexWrap: "wrap",
          animation: mounted ? "statsReveal 0.8s ease 0.9s both" : "none",
        }}>
          {[
            { num: `${(count.subs  / 100).toFixed(2)}M`, suffix: "+", label: "YouTube Subscribers" },
            { num: `${(count.views / 100).toFixed(1)}M`, suffix: "+", label: "Video Views" },
            { num: `${count.likes}K`,                    suffix: "",  label: "Likes" },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div style={{
                fontSize: "clamp(22px, 3.5vw, 30px)",
                fontWeight: "900",
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                color: "#ff4d00",
                lineHeight: "1",
                marginBottom: "6px",
              }}>
                {stat.num}<span style={{ color: "#ff7733" }}>{stat.suffix}</span>
              </div>
              <div style={{
                fontSize: "10px",
                color: "#444",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: "600",
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}