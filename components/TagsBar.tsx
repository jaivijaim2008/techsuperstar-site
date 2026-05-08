"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TAGS = [
  { name: "All",         href: "/articles",           icon: "🔥" },
  { name: "Phones",      href: "/category/phones",     icon: "📱" },
  { name: "Laptops",     href: "/category/laptops",    icon: "💻" },
  { name: "Tablets",     href: "/category/tablets",    icon: "📟" },
  { name: "Gaming",      href: "/category/gaming",     icon: "🎮" },
  { name: "Reviews",     href: "/category/reviews",    icon: "⭐" },
  { name: "Accessories", href: "/category/accessories",icon: "🎧" },
];

export default function TagsBar() {
  const pathname = usePathname();

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
        .tags-bar-wrap::-webkit-scrollbar {
          display: none;
        }
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
          gap: 5px;
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
        .tag-pill:hover {
          background: rgba(255,77,0,0.1);
          border-color: rgba(255,77,0,0.35);
          color: #ff4d00;
        }
        .tag-pill.active {
          background: #ff4d00;
          border-color: #ff4d00;
          color: #fff;
        }
        .tag-icon {
          font-size: 13px;
          line-height: 1;
        }
      `}</style>

      <div className="tags-bar-wrap">
        <div className="tags-bar-inner">
          {TAGS.map((tag) => {
            const isActive =
              tag.href === "/articles"
                ? pathname === "/" || pathname === "/articles"
                : pathname.startsWith(tag.href);

            return (
              <Link
                key={tag.name}
                href={tag.href}
                className={`tag-pill${isActive ? " active" : ""}`}
              >
                <span className="tag-icon">{tag.icon}</span>
                {tag.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
