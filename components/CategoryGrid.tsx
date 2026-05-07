"use client";
// ✅ ssr: false — skips server rendering entirely for the carousel.
// The carousel reads window.innerWidth and controls animations via JS refs,
// so there is no useful server output. Disabling SSR here eliminates all
// hydration errors (#418, #423) at the source.
import dynamic from "next/dynamic";

const CategoryGridInner = dynamic(() => import("./CategoryGridInner"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "32px 0 0" }}>
      {/* Skeleton matches real layout height to avoid page shift */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        background: "rgba(255,77,0,0.07)",
        border: "1px solid rgba(255,77,0,0.12)",
        height: 28, width: 160, borderRadius: 50, marginBottom: 14,
      }} />
      <div style={{
        height: 36, width: 260,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 8, marginBottom: 12,
      }} />
      <div style={{
        height: 2,
        background: "linear-gradient(90deg, #ff4d00, rgba(255,77,0,0.1))",
        borderRadius: 2, marginBottom: 36,
      }} />
      <div style={{ height: 160 }} />
    </div>
  ),
});

export default function CategoryGrid() {
  return <CategoryGridInner />;
}
