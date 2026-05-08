"use client";

export default function NewsTicker() {
  // Fallback articles (no API call needed)
  const items = [
    "Vivo X300 Pro vs Xiaomi 17 Ultra: Best Camera Phone?",
    "OnePlus Pad Go 2 Review",
    "AMD RYZEN AI 300 PRO — Game Changer Laptop",
    "Samsung vs Infinix Comparison",
    "Next Level AI Features Coming Soon",
  ];

  // Remove emojis from text
  const cleanText = (text: string) => {
    return text
      .replace(/[🤯🥴😱⭐️🔥💎🎮📱💻⚡️🙆‍♂️🚀🔔📰🎨🔮👑😎😤🌟✨💰🎯🎁🏆]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const displayItems = items.map(cleanText).slice(0, 5);
  const doubled = [...displayItems, ...displayItems];

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes pulseLight {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        .news-ticker-container {
          background: linear-gradient(90deg, #ff4d00 0%, #e63d00 100%);
          height: 40px;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(255, 77, 0, 0.3);
        }

        .ticker-label {
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.2);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 0 14px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          border-right: 1px solid rgba(255, 255, 255, 0.15);
          white-space: nowrap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'DM Sans', sans-serif;
        }

        .ticker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          display: inline-block;
          animation: pulseLight 1.5s ease-in-out infinite;
          flex-shrink: 0;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
        }

        .ticker-content {
          overflow: hidden;
          flex: 1;
          position: relative;
        }

        .ticker-track {
          display: flex;
          gap: 0;
          animation: tickerScroll 35s linear infinite;
          width: max-content;
          will-change: transform;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        .ticker-item {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'DM Sans', sans-serif;
          white-space: nowrap;
          padding: 0 3px;
          opacity: 0.95;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .ticker-separator {
          color: rgba(255, 255, 255, 0.4);
          padding: 0 12px;
          flex-shrink: 0;
          font-weight: 300;
          font-size: 11px;
        }

        .ticker-fade-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 50px;
          background: linear-gradient(to left, #ff4d00, transparent);
          pointer-events: none;
          z-index: 5;
        }

        /* Mobile optimization */
        @media (max-width: 640px) {
          .news-ticker-container {
            height: 36px;
          }

          .ticker-label {
            padding: 0 10px;
            font-size: 10px;
            letter-spacing: 1px;
          }

          .ticker-item {
            font-size: 12px;
          }

          .ticker-separator {
            padding: 0 8px;
          }

          .ticker-dot {
            width: 5px;
            height: 5px;
          }

          .ticker-fade-right {
            width: 40px;
          }
        }

        /* Tablet */
        @media (min-width: 768px) {
          .news-ticker-container {
            height: 42px;
          }

          .ticker-item {
            font-size: 14px;
          }
        }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }

          .ticker-dot {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <div className="news-ticker-container">
        {/* LIVE Label */}
        <div className="ticker-label">
          <span className="ticker-dot" />
          <span>Trending</span>
        </div>

        {/* Scrolling Content */}
        <div className="ticker-content">
          <div className="ticker-track">
            {doubled.map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                <span className="ticker-item">{item}</span>
                <span className="ticker-separator">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Fade Effect */}
        <div className="ticker-fade-right" />
      </div>
    </>
  );
}
