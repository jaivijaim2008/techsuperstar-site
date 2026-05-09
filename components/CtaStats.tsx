"use client";
import { useEffect, useState } from "react";

export default function CtaStats() {
  const [subscribers, setSubscribers] = useState("2.08M");

  useEffect(() => {
    fetch("/api/youtube-stats")
      .then((r) => r.json())
      .then((data) => { if (data.subscribers) setSubscribers(data.subscribers); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", gap: "24px", marginTop: "18px", flexWrap: "wrap", justifyContent: "center" }}>
      <div>
        <div className="cta-stat-value">{subscribers}</div>
        <div className="cta-stat-label">Subscribers</div>
      </div>
    </div>
  );
}