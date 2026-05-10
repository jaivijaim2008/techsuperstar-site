// lib/category-colors.ts
// These are your exact category colors from your constants

export const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  phones: {
    color: "#ff4d00",      // Your exact orange
    bg: "rgba(255, 77, 0, 0.1)",
    border: "rgba(255, 77, 0, 0.3)"
  },
  laptops: {
    color: "#3b82f6",      // Your exact blue
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)"
  },
  tablets: {
    color: "#f59e0b",      // Your exact amber/gold
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)"
  },
  gaming: {
    color: "#a855f7",      // Your exact purple
    bg: "rgba(168, 85, 247, 0.1)",
    border: "rgba(168, 85, 247, 0.3)"
  },
  reviews: {
    color: "#f59e0b",      // Yellow/orange
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)"
  },
  accessories: {
    color: "#06b6d4",      // Your exact cyan
    bg: "rgba(6, 182, 212, 0.1)",
    border: "rgba(6, 182, 212, 0.3)"
  },
  comparisons: {
  color: "#eab308",        // Yellow to match sidebar
  bg: "rgba(234, 179, 8, 0.1)",
  border: "rgba(234, 179, 8, 0.3)"
},
};

export function getCategoryColor(category: string) {
  const normalized = category?.toLowerCase().replace(/[^a-z]/g, "") || "phones";
  return CATEGORY_COLORS[normalized] || CATEGORY_COLORS.phones;
}
