"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TickerPost {
  title: string;
  slug: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  phones: "#00b4d8",
  laptops: "#7209b7",
  tablets: "#10b981",
  gaming: "#f72585",
  comparisons: "#f77f00",
  accessories: "#06d6a0",
  default: "#ff4d00",
};

export default function NewsTicker() {
  const [items, setItems] = useState<TickerPost[]>([
    { title: "Vivo X300 Pro vs Xiaomi 17 Ultra: Best Camera Phone?", slug: "vivo-x300-pro-vs-xiaomi-17-ultra-comparison-camera-battle", category: "comparisons" },
    { title: "OnePlus Pad Go 2 Review", slug: "oneplus-pad-go-2-review-budget-tablet-upgrade", category: "tablets" },
    { title: "AMD RYZEN AI 300 PRO — Game Changer Laptop", slug: "amd-ryzen-ai-300-pro-dell-latitude-14-review-performance-benchmarks", category: "laptops" },
    { title: "Nothing Phone 4A vs 4A Pro Comparison", slug: "nothing-phone-4a-vs-4a-pro-comparison-price-hike", category: "comparisons" },
    { title: "AirPods Pro 3 Honest Review", slug: "airpods-pro-3-honest-review-techsuperstar", category: "accessories" },
  ]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/trending`);
        const data = await res.json();
        if (data?.length > 0) {
          setItems(data.map((p: TickerPost) => ({
            title: p.title,
            slug: p.slug,
            category: (p.category || "default").toLowerCase(),
          })));
        }
      } catch {
        // fallback to default items
      }
    };
    fetchLatest();
  }, []);

  const cleanText = (text: string) =>
    text.replace(/[\u{1F000}-\u{1FFFF}]/gu, "").replace(/\s+/g, " ").trim();

  const doubled = [...items, ...items];

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulseLight {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(255,255,255,0.6); }
          50%       { opacity: 0.4; box-shadow: none; }
        }
        @keyframes labelGlow {
          0%, 100% { box-shadow: inset 0 0 8px rgba(255,77,0,0.3); }
          50%       { box-shadow: inset 0 0 16px rgba(255,77,0,0.6); }
        }

        .news-ticker-container {
          background: linear-gradient(90deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%);
          height: 42px;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(255,77,0,0.2);
          box-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }

        .ticker-label {
          flex-shrink: 0;
          background: linear-gradient(135deg, #ff4d00, #cc3d00);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 0 16px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%);
          padding-right: 24px;
          animation: labelGlow 2s ease-in-out infinite;
          min-width: 110px;
        }

        .ticker-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          display: inline-block;
          animation: pulseLight 1.2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .ticker-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,77,0,0.3);
          flex-shrink: 0;
        }

        .ticker-content {
          overflow: hidden;
          flex: 1;
          position: relative;
          mask-image: linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%);
        }

        .ticker-track {
          display: flex;
          align-items: center;
          gap: 0;
          animation: tickerScroll 40s linear infinite;
          width: max-content;
          will-change: transform;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        .ticker-item-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 6px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .ticker-item-wrapper:hover {
          opacity: 0.75;
        }

        .ticker-badge {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          border: 1px solid currentColor;
          opacity: 0.9;
        }

        .ticker-item {
          color: #ccc;
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          white-space: nowrap;
          opacity: 0.95;
        }
        .ticker-item-wrapper:hover .ticker-item {
          color: #fff;
        }

        .ticker-separator {
          color: rgba(255,77,0,0.4);
          padding: 0 14px;
          flex-shrink: 0;
          font-size: 16px;
          line-height: 1;
        }

        @media (max-width: 640px) {
          .news-ticker-container { height: 36px; }
          .ticker-label { font-size: 9px; padding: 0 12px 0 12px; padding-right: 20px; min-width: 95px; }
          .ticker-item { font-size: 12px; }
          .ticker-badge { font-size: 8px; padding: 1px 5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
          .ticker-dot { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="news-ticker-container">
        <div className="ticker-label">
          <span className="ticker-dot" />
          <span>Trending</span>
        </div>

        <div className="ticker-divider" />

        <div className="ticker-content">
          <div className="ticker-track">
            {doubled.map((item, i) => {
              const color = categoryColors[item.category] || categoryColors.default;
              return (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  <Link href={`/post/${item.slug}`} className="ticker-item-wrapper">
                    <span
                      className="ticker-badge"
                      style={{ color, borderColor: color, background: `${color}18` }}
                    >
                      {item.category === "default" ? "TECH" : item.category.toUpperCase()}
                    </span>
                    <span className="ticker-item">{cleanText(item.title)}</span>
                  </Link>
                  <span className="ticker-separator">◆</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}