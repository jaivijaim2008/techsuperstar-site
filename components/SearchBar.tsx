"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setOpen(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Search Icon Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#aaa", fontSize: "18px", padding: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "8px", transition: "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#ff4d00")}
        onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
      >
        🔍
      </button>

      {/* Search Dropdown */}
      {open && (
        <form
          onSubmit={handleSearch}
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "#141414", border: "1px solid #2a2a2a",
            borderRadius: "10px", padding: "12px",
            width: "280px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles..."
              style={{
                flex: 1, background: "#0a0a0a",
                border: "1px solid #2a2a2a", borderRadius: "6px",
                padding: "8px 12px", color: "#fff", fontSize: "14px",
                outline: "none",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#ff4d00")}
              onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
            />
            <button
              type="submit"
              style={{
                background: "#ff4d00", border: "none",
                borderRadius: "6px", padding: "8px 14px",
                color: "#fff", fontWeight: "700", fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Go
            </button>
          </div>
        </form>
      )}

      {/* Click outside to close */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
          }}
        />
      )}
    </div>
  );
}