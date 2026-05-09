"use client";
import { useEffect, useState } from "react";

export default function YoutubeStats() {
  const [stats, setStats] = useState({ subscribers: "2.08M", views: "3.2M" });

  useEffect(() => {
    fetch("/api/youtube-stats")
      .then(r => r.json())
      .then(data => setStats(data));
  }, []);

  return <>{stats.subscribers}</>;
}