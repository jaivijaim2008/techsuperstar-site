import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { FaYoutube, FaInstagram, FaXTwitter } from "react-icons/fa6";
export const dynamic = "force-dynamic";
export default function AboutPage() {
  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <style suppressHydrationWarning>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 50px 50px; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,77,0,0.3); }
          50%     { box-shadow: 0 0 0 8px rgba(255,77,0,0); }
        }
        @keyframes logoPulse {
          0%,100% { box-shadow: 0 0 8px rgba(255,77,0,0.4), 0 0 16px rgba(255,77,0,0.2); }
          50%     { box-shadow: 0 0 20px rgba(255,77,0,0.9), 0 0 40px rgba(255,77,0,0.4); }
        }
        @keyframes orbFloat1 {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-20px); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(15px); }
        }
        @keyframes dotBlink {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.4; transform: scale(0.6); }
        }
        @keyframes ytGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,0,0,0.3); }
          50%     { box-shadow: 0 0 0 10px rgba(255,0,0,0); }
        }

        .about-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,77,0,0.1);
          border-radius: 20px;
          padding: clamp(24px, 4vw, 40px);
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .about-card:hover {
          border-color: rgba(255,77,0,0.25);
          box-shadow: 0 0 40px rgba(255,77,0,0.06);
        }
        .about-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,77,0,0.05), transparent 70%);
          pointer-events: none;
        }

        .section-heading {
          color: #ff4d00;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          margin: 0 0 14px;
          font-family: var(--font-dm-sans), sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-heading::before {
          content: '';
          width: 4px; height: 16px;
          background: #ff4d00;
          border-radius: 2px;
          display: inline-block;
        }

        .cover-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .cover-card:hover {
          background: rgba(255,77,0,0.05);
          border-color: rgba(255,77,0,0.25);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(255,77,0,0.08);
        }

        .social-row-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 12px;
          padding: 14px 20px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-dm-sans), sans-serif;
          transition: all 0.25s ease;
          flex: 1;
          min-width: 140px;
        }
        .social-row-btn:hover {
          transform: translateY(-3px);
          filter: brightness(1.3);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .yt-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #ff4d00, #ff7300, #ff9900, #ff7300, #ff4d00);
          background-size: 200% auto;
          color: #fff;
          padding: 14px 36px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          font-family: var(--font-dm-sans), sans-serif;
          box-shadow: 0 4px 24px rgba(255,77,0,0.4);
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }
        .yt-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 10px 40px rgba(255,77,0,0.6);
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,77,0,0.08);
          border: 1px solid rgba(255,77,0,0.25);
          color: #ff4d00;
          padding: 12px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-dm-sans), sans-serif;
          transition: all 0.25s ease;
        }
        .contact-btn:hover {
          background: rgba(255,77,0,0.15);
          border-color: rgba(255,77,0,0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,77,0,0.2);
        }

        .stat-pill {
          background: rgba(255,77,0,0.08);
          border: 1px solid rgba(255,77,0,0.2);
          border-radius: 50px;
          padding: 10px 24px;
          text-align: center;
          flex: 1;
          min-width: 100px;
        }

        @media (max-width: 640px) {
          .social-row { flex-direction: column !important; }
          .stats-row { flex-direction: column !important; gap: 10px !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #060606 0%, #0f0600 50%, #060606 100%)",
        padding: "70px 1.5rem 60px",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)", backgroundSize: "55px 55px", animation: "gridPan 20s linear infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 320, height: 320, top: "-80px", left: "5%", borderRadius: "50%", background: "rgba(255,77,0,0.06)", filter: "blur(70px)", animation: "orbFloat1 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 220, height: 220, bottom: "-40px", right: "8%", borderRadius: "50%", background: "rgba(255,100,0,0.04)", filter: "blur(55px)", animation: "orbFloat2 11s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            overflow: "hidden", border: "2px solid #ff4d00",
            margin: "0 auto 24px",
            animation: "logoPulse 2.5s ease-in-out infinite",
          }}>
            <img src="/favicon.jpg" alt="TechSuperStar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.28)",
            color: "#ff6622", fontSize: "10px", fontWeight: "700",
            padding: "6px 18px", borderRadius: "50px",
            letterSpacing: "2.5px", textTransform: "uppercase",
            marginBottom: "24px",
            animation: "badgePulse 2.5s ease infinite",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d00", display: "inline-block", animation: "dotBlink 1.5s ease-in-out infinite" }} />
            About Us
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "900", margin: "0 0 18px",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            letterSpacing: "-1px", lineHeight: 1.15,
            background: "linear-gradient(135deg, #ffffff 0%, #ff4d00 50%, #ffaa44 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmerText 4s linear infinite",
          }}>
            We are TechSuperStar
          </h1>

          <p style={{ color: "#555", fontSize: "clamp(13px, 2vw, 16px)", lineHeight: "1.75", margin: "0 0 32px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Your ultimate source for <span style={{ color: "#ff6622", fontWeight: 600 }}>honest tech reviews</span>, buying guides, and the latest news — all in Tamil.
          </p>

          <div className="stats-row" style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            {[
              { value: "2.06M+", label: "Subscribers" },
              { value: "3.2M+",  label: "Total Views" },
              { value: "203K",   label: "Likes" },
            ].map((stat) => (
              <div key={stat.label} className="stat-pill">
                <div style={{ color: "#ff4d00", fontSize: "20px", fontWeight: "900", fontFamily: "var(--font-playfair), serif", lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ color: "#444", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "52px 1.5rem 80px" }}>

        <ScrollReveal direction="up">
          <div className="about-card">
            <div className="section-heading">Who We Are</div>
            <h2 style={{ color: "#fff", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "900", fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
              Tamil Tech, Honest Reviews
            </h2>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.85", margin: "0 0 14px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
              TechSuperStar is a Tamil tech YouTube channel and blog dedicated to bringing you the most honest and detailed tech reviews in Tamil Nadu and across India.
            </p>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.85", margin: 0, fontFamily: "var(--font-dm-sans), sans-serif" }}>
              From budget smartphones to high-end laptops, gaming gear to accessories — we cover it all so you can make the <span style={{ color: "#ff6622", fontWeight: 600 }}>best buying decisions</span> without wasting your hard-earned money.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={50}>
          <div className="about-card">
            <div className="section-heading">What We Cover</div>
            <h2 style={{ color: "#fff", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "900", fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif", margin: "0 0 24px" }}>
              Every Category. Every Budget.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
              {[
                { icon: "📱", title: "Phones",      desc: "Budget to flagship smartphone reviews" },
                { icon: "💻", title: "Laptops",     desc: "Gaming and work laptop buying guides" },
                { icon: "📟", title: "Tablets",     desc: "Tablet reviews and comparisons" },
                { icon: "🎮", title: "Gaming",      desc: "Gaming hardware and accessories" },
                { icon: "⭐", title: "Reviews",     desc: "In-depth honest product reviews" },
                { icon: "🎧", title: "Accessories", desc: "Earbuds, chargers and more" },
              ].map((item) => (
                <div key={item.title} className="cover-card">
                  <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                  <div style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "6px", fontFamily: "var(--font-dm-sans), sans-serif" }}>{item.title}</div>
                  <div style={{ color: "#444", fontSize: "12px", lineHeight: "1.6", fontFamily: "var(--font-dm-sans), sans-serif" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={50}>
          <div className="about-card" style={{
            background: "linear-gradient(135deg, #1a0800 0%, #0e0500 50%, #1a0800 100%)",
            border: "1px solid rgba(255,77,0,0.2)",
            textAlign: "center",
          }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(255,0,0,0.1)", border: "2px solid rgba(255,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              animation: "ytGlow 2.5s ease-in-out infinite",
            }}>
              <FaYoutube size={36} color="#FF0000" />
            </div>

            <div className="section-heading" style={{ justifyContent: "center" }}>YouTube Channel</div>

            <h2 style={{
              color: "#fff", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: "900",
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              margin: "0 0 14px",
            }}>
              Watch on YouTube
            </h2>
            <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.75", margin: "0 auto 28px", maxWidth: "480px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
              Subscribe to our YouTube channel for video reviews, unboxings, and tech news in Tamil. New videos every week!
            </p>

            <Link href="https://www.youtube.com/@TechSuperStarOfficial" target="_blank" className="yt-btn">
              <FaYoutube size={18} /> Subscribe Now →
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={50}>
          <div className="about-card" style={{ textAlign: "center" }}>
            <div className="section-heading" style={{ justifyContent: "center" }}>Connect With Us</div>
            <h2 style={{
              color: "#fff", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "900",
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              margin: "0 0 12px",
            }}>
              Get In Touch
            </h2>
            <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.75", margin: "0 auto 28px", maxWidth: "420px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
              For business inquiries, collaborations, or just to say hi — reach out to us on any platform!
            </p>

            <div className="social-row" style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
              {[
                { label: "YouTube",     icon: <FaYoutube size={18} />,   url: "https://www.youtube.com/@TechSuperStarOfficial",   color: "#ff4444", bg: "rgba(255,0,0,0.08)",     border: "rgba(255,0,0,0.25)" },
                { label: "Instagram",   icon: <FaInstagram size={18} />, url: "https://www.instagram.com/techsuperstarofficial/", color: "#e1306c", bg: "rgba(225,48,108,0.08)",  border: "rgba(225,48,108,0.25)" },
                { label: "Twitter / X", icon: <FaXTwitter size={18} />,  url: "https://x.com/Tech_SuperStar",                    color: "#aaa",    bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.12)" },
              ].map((s) => (
                <Link key={s.label} href={s.url} target="_blank"
                  className="social-row-btn"
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    color: s.color,
                  }}
                >
                  {s.icon}
                  {s.label}
                  <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.5 }}>→</span>
                </Link>
              ))}
            </div>

            <Link href="/contact" className="contact-btn">
              Send a Message →
            </Link>
          </div>
        </ScrollReveal>

      </div>

      <Footer />
    </div>
  );
}