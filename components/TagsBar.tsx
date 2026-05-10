"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  MdPhoneAndroid,
  MdLaptop,
  MdTablet,
  MdSportsEsports,
  MdStar,
  MdHeadphones,
  MdGridView,
} from "react-icons/md";
import { CATEGORY_COLORS } from "@/lib/category-colors";

const TAGS = [
  { name: "All",         filter: null,          icon: MdGridView      },
  { name: "Phones",      filter: "phones",      icon: MdPhoneAndroid  },
  { name: "Laptops",     filter: "laptops",     icon: MdLaptop        },
  { name: "Tablets",     filter: "tablets",     icon: MdTablet        },
  { name: "Gaming",      filter: "gaming",      icon: MdSportsEsports },
  { name: "Comparisons", filter: "comparisons", icon: MdStar          },
  { name: "Accessories", filter: "accessories", icon: MdHeadphones    },
];

export default function TagsBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter");

  return (
    <>
      <style suppressHydrationWarning>{`
        .tags-bar-wrap {
          background: #0f0f0f;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .tags-bar-wrap::-webkit-scrollbar { display: none; }
        .tags-bar-inner {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          width: max-content;
          min-width: 100%;
        }
        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #888;
          transition: all 0.2s ease;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          min-height: 34px;
        }
      `}</style>

      <div className="tags-bar-wrap">
        <div className="tags-bar-inner">
          {TAGS.map((tag) => {
            const isActive = pathname === "/" || pathname === "/articles"
              ? tag.filter === currentFilter
              : false;

            const href = tag.filter ? `/?filter=${tag.filter}` : "/";
            const Icon = tag.icon;

            // Get the category color (fallback to orange for "All")
            const categoryColor = tag.filter
              ? CATEGORY_COLORS[tag.filter]
              : null;

            // Build inline active styles per category
            const activeStyle = isActive && categoryColor
              ? {
                  background: categoryColor.color,
                  borderColor: categoryColor.color,
                  color: "#fff",
                }
              : isActive && !categoryColor
              ? {
                  // "All" button — keep orange
                  background: "#ff4d00",
                  borderColor: "#ff4d00",
                  color: "#fff",
                }
              : {};

            // Hover is handled via inline onMouseEnter/Leave
            return (
              <Link
                key={tag.name}
                href={href}
                className="tag-pill"
                style={activeStyle}
                onMouseEnter={(e) => {
                  if (isActive) return; // don't override active state
                  const el = e.currentTarget;
                  const c = categoryColor?.color || "#ff4d00";
                  el.style.background = categoryColor?.bg || "rgba(255,77,0,0.1)";
                  el.style.borderColor = categoryColor?.border || "rgba(255,77,0,0.35)";
                  el.style.color = c;
                }}
                onMouseLeave={(e) => {
                  if (isActive) return;
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.03)";
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.color = "#888";
                }}
              >
                <Icon size={14} />
                {tag.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}