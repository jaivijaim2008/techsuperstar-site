"use client";

export default function NewsTicker({ posts }: { posts: any[] }) {
  const items = posts.length > 0
    ? posts.map((p: any) => p.title)
    : [
        "Vivo X300 Pro vs Xiaomi 17 Ultra: Best Camera Phone?",
        "OnePlus Pad Go 2 — தரமான சம்பவம்!",
        "AMD RYZEN AI 300 PRO — Game Changer Laptop from DELL",
        "Samsung vs Infinix — சண்ட செய்வோமா!",
      ];

  const doubled = [...items, ...items];

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tickerDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .ticker-track {
          display: flex;
          gap: 0;
          animation: tickerScroll 28s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-sep {
          color: rgba(255,255,255,0.3);
          padding: 0 16px;
          flex-shrink: 0;
        }
        @media (max-width: 480px) {
          .ticker-label-text {
            display: none;
          }
          .ticker-label {
            padding: 0 10px !important;
          }
          .ticker-item {
            font-size: 11px !important;
          }
          .ticker-sep {
            padding: 0 10px;
          }
        }
      `}</style>

      <div style={{
        background: "#ff4d00",
        height: "36px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
      }}>
        {/* LIVE label */}
        <div
          className="ticker-label"
          style={{
            flexShrink: 0,
            background: "rgba(0,0,0,0.25)",
            color: "#fff",
            fontSize: "10px",
            fontWeight: "800",
            letterSpacing: "2px",
            textTransform: "uppercase",
            padding: "0 16px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            borderRight: "1px solid rgba(255,255,255,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#fff",
            display: "inline-block",
            boxShadow: "0 0 6px #fff",
            animation: "tickerDot 1.2s ease-in-out infinite",
            flexShrink: 0,
          }} />
          <span className="ticker-label-text">TRENDING</span>
        </div>

        {/* Scrolling track */}
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="ticker-track">
            {doubled.map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <span
                  className="ticker-item"
                  style={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "500",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                    padding: "0 4px",
                    opacity: 0.95,
                  }}
                >
                  {item}
                </span>
                <span className="ticker-sep">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right fade */}
        <div style={{
          position: "absolute",
          right: 0, top: 0, bottom: 0,
          width: "40px",
          background: "linear-gradient(to left, #ff4d00, transparent)",
          pointerEvents: "none",
        }} />
      </div>
    </>
  );
}
