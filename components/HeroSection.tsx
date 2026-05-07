"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState({ subs: 0, views: 0, likes: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // ── 3D Canvas Effect (pure canvas, no Three.js dependency needed) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const isMobile = W < 640;

    // Floating 3D-style tech icons as wireframe shapes
    const SHAPE_COUNT = isMobile ? 6 : 12;
    const PARTICLE_COUNT = isMobile ? 40 : 100;

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
      color: string;
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

    const colors = ["#ff4d00", "#ff6622", "#ff9933", "#ffaa44", "#ff3300"];
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 500 + 50,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.3 + 0.1),
      vz: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Project 3D → 2D
    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
      const fov = 500;
      const scale = fov / (fov + z);
      return {
        sx: cx + x * scale,
        sy: cy + y * scale,
        scale,
      };
    };

    // Rotate point around axes
    const rotatePoint = (px: number, py: number, pz: number, rx: number, ry: number, rz: number) => {
      // X rotation
      let y1 = py * Math.cos(rx) - pz * Math.sin(rx);
      let z1 = py * Math.sin(rx) + pz * Math.cos(rx);
      // Y rotation
      let x2 = px * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -px * Math.sin(ry) + z1 * Math.cos(ry);
      // Z rotation
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
      return { x: x3, y: y3, z: z2 };
    };

    const drawCube = (ctx: CanvasRenderingContext2D, shape: Shape, cx: number, cy: number, t: number) => {
      const s = shape.size;
      const verts: [number,number,number][] = [
        [-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
        [-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s],
      ];
      const edges: [number,number][] = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7],
      ];
      const pulse = 1 + Math.sin(t * 0.002 + shape.pulseOffset) * 0.08;
      const projected = verts.map(([px, py, pz]) => {
        const r = rotatePoint(px * pulse, py * pulse, pz * pulse, shape.rotX, shape.rotY, shape.rotZ);
        return project(r.x + shape.x, r.y + shape.y, r.z + shape.z, cx, cy);
      });
      const alpha = shape.alpha * (0.85 + Math.sin(t * 0.001 + shape.pulseOffset) * 0.15);
      ctx.strokeStyle = `rgba(255,100,30,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.shadowColor = "rgba(255,77,0,0.6)";
      ctx.shadowBlur = 6;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].sx, projected[a].sy);
        ctx.lineTo(projected[b].sx, projected[b].sy);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    };

    const drawTetra = (ctx: CanvasRenderingContext2D, shape: Shape, cx: number, cy: number, t: number) => {
      const s = shape.size * 1.3;
      const verts: [number,number,number][] = [
        [0, -s, 0],
        [-s * 0.866, s * 0.5, s * 0.5],
        [s * 0.866, s * 0.5, s * 0.5],
        [0, s * 0.5, -s],
      ];
      const edges: [number,number][] = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];
      const pulse = 1 + Math.sin(t * 0.0015 + shape.pulseOffset) * 0.1;
      const projected = verts.map(([px, py, pz]) => {
        const r = rotatePoint(px * pulse, py * pulse, pz * pulse, shape.rotX, shape.rotY, shape.rotZ);
        return project(r.x + shape.x, r.y + shape.y, r.z + shape.z, cx, cy);
      });
      const alpha = shape.alpha * (0.85 + Math.sin(t * 0.0013 + shape.pulseOffset) * 0.15);
      ctx.strokeStyle = `rgba(255,140,40,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.shadowColor = "rgba(255,120,0,0.5)";
      ctx.shadowBlur = 5;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].sx, projected[a].sy);
        ctx.lineTo(projected[b].sx, projected[b].sy);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    };

    const drawRing = (ctx: CanvasRenderingContext2D, shape: Shape, cx: number, cy: number, t: number) => {
      const segments = 16;
      const r = shape.size;
      const verts: [number,number,number][] = Array.from({ length: segments }, (_, i) => {
        const angle = (i / segments) * Math.PI * 2;
        return [Math.cos(angle) * r, Math.sin(angle) * r, 0];
      });
      const pulse = 1 + Math.sin(t * 0.002 + shape.pulseOffset) * 0.06;
      const projected = verts.map(([px, py, pz]) => {
        const r2 = rotatePoint(px * pulse, py * pulse, pz * pulse, shape.rotX, shape.rotY, shape.rotZ);
        return project(r2.x + shape.x, r2.y + shape.y, r2.z + shape.z, cx, cy);
      });
      const alpha = shape.alpha * (0.9 + Math.sin(t * 0.0018 + shape.pulseOffset) * 0.1);
      ctx.strokeStyle = `rgba(255,70,0,${alpha})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(255,50,0,0.7)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      projected.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    let t = 0;
    const render = () => {
      t++;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.z < 0) p.z = 500;
        if (p.z > 500) p.z = 0;

        const proj = project(p.x - cx, p.y - cy, p.z, cx, cy);
        const sz = p.size * proj.scale;
        const alpha = p.alpha * proj.scale;
        ctx.beginPath();
        ctx.arc(proj.sx, proj.sy, Math.max(sz, 0.3), 0, Math.PI * 2);
        const hex = p.color;
        ctx.fillStyle = hex.replace("#", "rgba(").replace(/(..)(..)(..)/, (_,r,g,b) =>
          `${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},`) + `${alpha})`;
        // simple: use fillStyle directly
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Update and draw 3D shapes
      shapes.forEach(shape => {
        shape.rotX += shape.rotSpeedX;
        shape.rotY += shape.rotSpeedY;
        shape.rotZ += shape.rotSpeedZ;
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.z += shape.vz;

        // Boundary bounce
        if (Math.abs(shape.x) > W * 0.8) shape.vx *= -1;
        if (Math.abs(shape.y) > H * 0.8) shape.vy *= -1;
        if (shape.z < 50 || shape.z > 600) shape.vz *= -1;

        if (shape.type === "cube") drawCube(ctx, shape, cx, cy, t);
        else if (shape.type === "tetra") drawTetra(ctx, shape, cx, cy, t);
        else drawRing(ctx, shape, cx, cy, t);
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ── Stats counter ──
  useEffect(() => {
    setMounted(true);
    let step = 0;
    const steps = 60;
    const duration = 1800;
    const interval = duration / steps;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        subs: Math.floor(ease * 206),
        views: Math.floor(ease * 320),
        likes: Math.floor(ease * 203),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
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
          from { background-position: 0 0; }
          to   { background-position: 50px 50px; }
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
        @keyframes scanLine {
          from { top: -10%; }
          to   { top: 110%; }
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
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: btnShimmer 4s ease infinite, btnGlow 2.5s ease infinite;
          position: relative;
          overflow: hidden;
          will-change: transform;
        }
        .hero-btn:hover {
          transform: scale(1.06) translateY(-2px) !important;
          box-shadow: 0 12px 50px rgba(255,77,0,0.7) !important;
        }
        .hero-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-20deg);
          animation: scanLine 3s ease infinite;
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
          transition: all 0.3s ease;
          will-change: transform;
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
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          will-change: transform;
        }
        .stat-card:hover {
          background: rgba(255,77,0,0.05);
          border-color: rgba(255,77,0,0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(255,77,0,0.1);
        }

        .floating-tag {
          position: absolute;
          background: rgba(255,77,0,0.08);
          border: 1px solid rgba(255,77,0,0.2);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 11px;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          font-weight: 600;
          color: rgba(255,77,0,0.7);
          letter-spacing: 0.5px;
          backdrop-filter: blur(8px);
          white-space: nowrap;
          pointer-events: none;
          will-change: transform;
        }

        @media (max-width: 640px) {
          .floating-tag { display: none; }
          .stat-card { padding: 16px 14px; min-width: 90px; }
          .hero-actions { flex-direction: column; align-items: center; }
          .hero-btn, .hero-secondary-btn { width: 100%; max-width: 300px; justify-content: center; }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          canvas { display: none; }
        }
      `}</style>

      {/* ── 3D Canvas Layer (bottom-most) ── */}
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
        }}
      />

      {/* ── Animated grid ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)",
        backgroundSize: "55px 55px",
        animation: "gridPan 20s linear infinite",
        willChange: "background-position",
        transform: "translateZ(0)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Radial vignette ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,77,0,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Floating orbs ── */}
      {[
        { w:380, h:380, top:"5%",    left:"-5%",  color:"rgba(255,60,0,0.07)",  anim:"orbFloat1 10s ease-in-out infinite",          blur:40 },
        { w:260, h:260, top:"55%",   right:"-3%", color:"rgba(255,100,0,0.05)", anim:"orbFloat2 13s ease-in-out infinite",          blur:35 },
        { w:200, h:200, top:"20%",   right:"15%", color:"rgba(255,140,0,0.04)", anim:"orbFloat3 8s ease-in-out infinite",           blur:28 },
        { w:150, h:150, bottom:"10%",left:"15%",  color:"rgba(255,40,0,0.05)",  anim:"orbFloat2 11s ease-in-out infinite reverse",  blur:22 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          width: orb.w, height: orb.h,
          borderRadius: "50%",
          background: orb.color,
          filter: `blur(${orb.blur}px)`,
          animation: orb.anim,
          willChange: "transform",
          top: (orb as any).top,
          bottom: (orb as any).bottom,
          left: (orb as any).left,
          right: (orb as any).right,
          pointerEvents: "none",
          zIndex: 0,
        }} />
      ))}

      {/* ── Floating tags (desktop only) ── */}
      {[
        { text: "📱 Smartphone Reviews", top: "18%", left: "4%",   delay: "0s" },
        { text: "💻 Laptop Guides",      top: "28%", right: "4%",  delay: "0.4s" },
        { text: "🎮 Gaming Gear",        bottom: "28%", left: "3%",  delay: "0.8s" },
        { text: "⭐ Honest Opinions",    bottom: "22%", right: "3%", delay: "1.2s" },
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
          Tamil Tech Reviews & News
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
            { num: `${(count.subs / 100).toFixed(2)}M`,  suffix: "+", label: "YouTube Subscribers" },
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
