import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <style suppressHydrationWarning>{`
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 60px 60px; }
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50%     { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(14px); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(255,77,0,0.5), 0 0 20px rgba(255,77,0,0.3); }
          70%  { box-shadow: 0 0 0 14px rgba(255,77,0,0), 0 0 20px rgba(255,77,0,0.3); }
          100% { box-shadow: 0 0 0 0 rgba(255,77,0,0), 0 0 20px rgba(255,77,0,0.3); }
        }
        @keyframes dotBlink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.3; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          background: #0d0d0d;
          border: 1px solid rgba(255,77,0,0.12);
          border-radius: 18px;
          padding: 18px 12px;
          text-align: center;
          flex: 1; min-width: 80px; max-width: 140px;
          transition: all 0.3s ease;
          position: relative; overflow: hidden;
          animation: countUp 0.6s ease both;
        }
        .stat-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #ff4d00, transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .stat-card:hover { border-color: rgba(255,77,0,0.4); transform: translateY(-6px); box-shadow: 0 20px 48px rgba(255,77,0,0.12); }
        .stat-card:hover::after { opacity: 1; }

        .story-grid {
          display: grid; grid-template-columns: 1fr; gap: 32px; align-items: center;
        }
        @media (min-width: 760px) { .story-grid { grid-template-columns: 1fr 1fr; } }

        .cover-card {
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 22px;
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .cover-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #ff4d00, #ff8800);
          transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
        }
        .cover-card:hover { border-color: rgba(255,77,0,0.3); transform: translateY(-5px); box-shadow: 0 16px 40px rgba(255,77,0,0.08); }
        .cover-card:hover::before { transform: scaleX(1); }

        .timeline-item {
          display: flex; gap: 20px; padding-bottom: 32px; position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: ''; position: absolute; left: 19px; top: 44px;
          width: 2px; bottom: 0;
          background: linear-gradient(180deg, rgba(255,77,0,0.25), transparent);
        }
        .timeline-dot {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: rgba(255,77,0,0.08); border: 2px solid rgba(255,77,0,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; position: relative; z-index: 1;
        }

        .social-card {
          display: flex; align-items: center; gap: 14px;
          border-radius: 16px; padding: 18px 20px;
          text-decoration: none; transition: all 0.25s ease;
        }
        .social-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          color: #ff4d00; font-size: 10px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; margin-bottom: 14px;
        }

        .cta-box {
          background: linear-gradient(135deg, #140800, #0a0400, #140800);
          border: 1px solid rgba(255,77,0,0.2);
          border-radius: 24px;
          padding: clamp(36px,6vw,60px) clamp(24px,5vw,52px);
          text-align: center; position: relative; overflow: hidden;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 9px;
          background: linear-gradient(135deg, #ff4d00, #ff7a00);
          color: #fff; padding: 14px 30px; border-radius: 12px;
          text-decoration: none; font-weight: 700; font-size: 14px;
          box-shadow: 0 4px 20px rgba(255,77,0,0.4);
          transition: all 0.25s ease; min-height: 48px;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(255,77,0,0.55); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 9px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: #888; padding: 14px 30px; border-radius: 12px;
          text-decoration: none; font-weight: 600; font-size: 14px;
          transition: all 0.25s ease; min-height: 48px;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.08); color: #fff; transform: translateY(-3px); }

        @media (max-width: 600px) {
          .cta-btns { flex-direction: column !important; align-items: stretch !important; }
          .cta-btns a { justify-content: center; }
          .stats-row { flex-direction: row !important; flex-wrap: wrap !important; justify-content: center !important; gap: 8px !important; }
          .stat-card { min-width: 70px !important; max-width: calc(50% - 8px) !important; padding: 14px 10px !important; }
          .social-grid { grid-template-columns: 1fr !important; }
          .story-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #060606 0%, #100500 55%, #060606 100%)",
        padding: "80px 1.5rem 70px",
        borderBottom: "1px solid rgba(255,77,0,0.08)",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,77,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", animation: "gridPan 18s linear infinite" }} />
        <div style={{ position: "absolute", width: 360, height: 360, top: "-120px", left: "0%", borderRadius: "50%", background: "rgba(255,77,0,0.07)", filter: "blur(90px)", animation: "orbFloat 10s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 260, height: 260, bottom: "-80px", right: "3%", borderRadius: "50%", background: "rgba(255,100,0,0.05)", filter: "blur(70px)", animation: "orbFloat2 13s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: "3px solid #ff4d00", margin: "0 auto 28px", animation: "pulse-ring 2.5s ease-in-out infinite" }}>
            <img src="/favicon.jpg" alt="TechSuperStar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.28)", color: "#ff6622", fontSize: "10px", fontWeight: 700, padding: "6px 18px", borderRadius: "50px", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d00", display: "inline-block", animation: "dotBlink 1.5s ease-in-out infinite" }} />
            Tamil Nadu&apos;s #1 Tech Channel
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 900, margin: "0 0 20px", fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif", letterSpacing: "-1.5px", lineHeight: 1.1, background: "linear-gradient(135deg, #fff 20%, #ff4d00 55%, #ffbb66 80%, #fff 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 5s linear infinite" }}>
            We are TechSuperStar
          </h1>

          <p style={{ color: "#555", fontSize: "clamp(13px,2vw,16px)", lineHeight: 1.8, margin: "0 0 40px" }}>
            Honest tech reviews, real buying advice, and the latest gadget news —{" "}
            <span style={{ color: "#ff6622", fontWeight: 600 }}>all in Tamil</span>. Trusted by millions.
          </p>

          <div className="stats-row" style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[
              { value: "2.08M+", label: "Subscribers", icon: "📺" },
              { value: "3.2M+",  label: "Total Views",  icon: "👁️" },
              { value: "500+",   label: "Videos",       icon: "🎬" },
              { value: "#1",     label: "Tamil Tech",   icon: "🏆" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ color: "#ff4d00", fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, fontFamily: "var(--font-playfair), serif", lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 1.5rem 80px" }}>

        {/* WHO WE ARE */}
        <ScrollReveal direction="up">
          <div style={{ marginBottom: 64 }}>
            <div className="story-grid">
              <div>
                <div className="eyebrow">
                  <span style={{ width: 28, height: 2, background: "#ff4d00", borderRadius: 2, display: "inline-block" }} />
                  Who We Are
                </div>
                <h2 style={{ color: "#fff", fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, fontFamily: "var(--font-playfair), serif", margin: "0 0 20px", lineHeight: 1.2 }}>
                  Tamil Tech,<br /><span style={{ color: "#ff4d00" }}>Honest Reviews</span>
                </h2>
                <p style={{ color: "#666", fontSize: 15, lineHeight: 1.85, margin: "0 0 16px" }}>
                  TechSuperStar is Tamil Nadu&apos;s most trusted tech YouTube channel and blog. We bring you the most detailed, unbiased tech reviews in your language — Tamil.
                </p>
                <p style={{ color: "#666", fontSize: 15, lineHeight: 1.85, margin: 0 }}>
                  From ₹8,000 budget phones to ₹2 lakh flagship laptops — we test everything so you don&apos;t waste a single rupee on the wrong device.
                </p>
              </div>

              <div style={{ background: "linear-gradient(135deg, #150800, #0c0400)", border: "1px solid rgba(255,77,0,0.2)", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,77,0,0.15), transparent 70%)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid #ff4d00", boxShadow: "0 0 20px rgba(255,77,0,0.4)", flexShrink: 0 }}>
                    <img src="/favicon.jpg" alt="TechSuperStar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "var(--font-playfair), serif" }}>Tech<span style={{ color: "#ff4d00" }}>SuperStar</span></div>
                    <div style={{ color: "#444", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600, marginTop: 3 }}>Tamil Tech Reviews</div>
                  </div>
                </div>
                <p style={{ color: "#888", fontSize: 14, lineHeight: 1.75, borderLeft: "3px solid #ff4d00", paddingLeft: 16, margin: "0 0 20px", fontStyle: "italic" }}>
                  &ldquo;Our goal is simple — help every Tamil-speaking person make the best tech decision for their budget, without any bias.&rdquo;
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { Icon: FaYoutube,   label: "YouTube",   color: "#ff4444", bg: "rgba(255,68,68,0.1)",   border: "rgba(255,68,68,0.2)",   href: "https://www.youtube.com/@TechSuperStarOfficial" },
                    { Icon: FaInstagram, label: "Instagram", color: "#e1306c", bg: "rgba(225,48,108,0.1)", border: "rgba(225,48,108,0.2)", href: "https://www.instagram.com/techsuperstarofficial/" },
                    { Icon: FaXTwitter,  label: "Twitter",   color: "#aaa",    bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", href: "https://x.com/Tech_SuperStar" },
                  ].map(({ Icon, label, color, bg, border, href }) => (
                    <Link key={label} href={href} target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, background: bg, border: `1px solid ${border}`, color, padding: "7px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}>
                      <Icon size={13} /> {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* WHAT WE COVER */}
        <ScrollReveal direction="up" delay={50}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <div className="eyebrow" style={{ justifyContent: "center" }}>
                <span style={{ width: 28, height: 2, background: "#ff4d00", borderRadius: 2, display: "inline-block" }} />
                What We Cover
              </div>
              <h2 style={{ color: "#fff", fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, fontFamily: "var(--font-playfair), serif", margin: "0 0 12px" }}>Every Category. Every Budget.</h2>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>From your first smartphone to your dream laptop — we&apos;ve got a review for every gadget you&apos;re eyeing.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {[
                { icon: "📱", title: "Phones",      desc: "Budget to flagship — find the perfect phone for your money." },
                { icon: "💻", title: "Laptops",     desc: "Work, gaming, and student laptops reviewed for every budget." },
                { icon: "📟", title: "Tablets",     desc: "iPad vs Android — which tablet is actually worth buying?" },
                { icon: "🎮", title: "Gaming",      desc: "Gaming phones, consoles, and gear for Tamil gamers." },
                { icon: "🔄", title: "Comparisons", desc: "Side-by-side battles to help you pick the winner." },
                { icon: "🎧", title: "Accessories", desc: "Earbuds, chargers, cases — the accessories that matter." },
              ].map((item) => (
                <div key={item.title} className="cover-card">
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 800, marginBottom: 7, fontFamily: "var(--font-playfair), serif" }}>{item.title}</div>
                  <div style={{ color: "#555", fontSize: 12, lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* JOURNEY TIMELINE */}
        <ScrollReveal direction="up" delay={50}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 32 }}>
              <div className="eyebrow">
                <span style={{ width: 28, height: 2, background: "#ff4d00", borderRadius: 2, display: "inline-block" }} />
                Our Journey
              </div>
              <h2 style={{ color: "#fff", fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, fontFamily: "var(--font-playfair), serif", margin: 0 }}>How We Got Here</h2>
            </div>
            {[
              { year: "2018", icon: "🎬", title: "First Video",       desc: "Started with a budget phone review in Tamil. Just a camera, a phone, and a passion for tech." },
              { year: "2020", icon: "📈", title: "100K Subscribers",  desc: "Crossed 100K subs during the pandemic — people needed honest buying advice more than ever." },
              { year: "2022", icon: "🏆", title: "1M Milestone",      desc: "Became one of Tamil Nadu's largest tech channels. Every review honest, every rupee respected." },
              { year: "2024", icon: "🌐", title: "Website Launch",    desc: "Launched TechSuperStar.in so our community could read reviews anytime, anywhere." },
              { year: "2025", icon: "🚀", title: "2M+ Subscribers",   desc: "Over 2 million Tamil tech lovers now trust us for their buying decisions. Just the beginning." },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot">{item.icon}</div>
                <div style={{ flex: 1, paddingTop: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ color: "#ff4d00", fontSize: 11, fontWeight: 700, letterSpacing: 1, background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.2)", padding: "3px 10px", borderRadius: 50 }}>{item.year}</span>
                    <span style={{ color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "var(--font-playfair), serif" }}>{item.title}</span>
                  </div>
                  <p style={{ color: "#555", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CONNECT */}
        <ScrollReveal direction="up" delay={50}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 28, textAlign: "center" }}>
              <div className="eyebrow" style={{ justifyContent: "center" }}>
                <span style={{ width: 28, height: 2, background: "#ff4d00", borderRadius: 2, display: "inline-block" }} />
                Find Us Online
              </div>
              <h2 style={{ color: "#fff", fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, fontFamily: "var(--font-playfair), serif", margin: 0 }}>Connect With Us</h2>
            </div>
            <div className="social-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { Icon: FaYoutube,   label: "YouTube",     sub: "2.08M Subscribers",      href: "https://www.youtube.com/@TechSuperStarOfficial",   iconColor: "#ff4444", bg: "rgba(255,68,68,0.08)",   border: "rgba(255,68,68,0.18)" },
                { Icon: FaInstagram, label: "Instagram",   sub: "@techsuperstarofficial", href: "https://www.instagram.com/techsuperstarofficial/", iconColor: "#e1306c", bg: "rgba(225,48,108,0.08)", border: "rgba(225,48,108,0.18)" },
                { Icon: FaXTwitter,  label: "Twitter / X", sub: "@Tech_SuperStar",         href: "https://x.com/Tech_SuperStar",                      iconColor: "#eee",    bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
              ].map(({ Icon, label, sub, href, iconColor, bg, border }) => (
                <Link key={label} href={href} target="_blank" className="social-card" style={{ background: "#0d0d0d", border: `1px solid ${border}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={iconColor} />
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{label}</div>
                    <div style={{ color: "#444", fontSize: 11 }}>{sub}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#333", fontSize: 16 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={50}>
          <div className="cta-box">
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 220, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,77,0,0.1), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
              <h3 style={{ color: "#fff", fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, fontFamily: "var(--font-playfair), serif", margin: "0 0 12px" }}>
                Ready to Stay Ahead of the Curve?
              </h3>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.75, maxWidth: 440, margin: "0 auto 32px" }}>
                Subscribe to our YouTube channel and never miss a review, unboxing, or buying guide — all in Tamil. It&apos;s free.
              </p>
              <div className="cta-btns" style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <Link href="https://www.youtube.com/@TechSuperStarOfficial" target="_blank" className="btn-primary">
                  <FaYoutube size={18} /> Subscribe on YouTube
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>

      <Footer />
    </div>
  );
}
