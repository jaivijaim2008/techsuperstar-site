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
      `}</style>

      <div className="tags-bar-wrap">
        <div className="tags-bar-inner">
          {TAGS.map((tag) => {
            const isActive = pathname === "/" || pathname === "/articles"
              ? tag.filter === currentFilter
              : false;

            const href = tag.filter ? `/?filter=${tag.filter}` : "/";
            const Icon = tag.icon;

            return (
              <Link
                key={tag.name}
                href={href}
                className={`tag-pill${isActive ? " active" : ""}`}
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
