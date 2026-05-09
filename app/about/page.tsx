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
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(255,77,0,0.6), 0 0 20px rgba(255,77,0,0.3); }
          70%  { box-shadow: 0 0 0 16px rgba(255,77,0,0), 0 0 20px rgba(255,77,0,0.3); }
          100% { box-shadow: 0 0 0 0 rgba(255,77,0,0), 0 0 20px rgba(255,77,0,0.3); }
        }
        @keyframes dotBlink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.3; }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% center; }
          50%  { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-12px); }
        }

        .stat-box {
          background: #0d0d0d;
          border: 1px solid rgba(255,77,0,0.15);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-box::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff4d00, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .stat-box:hover {
          border-color: rgba(255,77,0,0.4);
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(255,77,0,0.15);
        }
        .stat-box:hover::before { opacity: 1; }

        .mission-card {
          background: linear-gradient(135deg, #140800, #0a0400);
          border: 1px solid rgba(255,77,0,0.2);
          border-radius: 20px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .mission-card::after {
          content: '';
          position: absolute; top: 0; right: -100px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(255,77,0,0.1), transparent);
          border-radius: 50%;
          pointer-events: none;
        }
        .mission-card:hover {
          border-color: rgba(255,77,0,0.4);
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(255,77,0,0.12);
        }

        .team-member {
          background: #0d0d0d;
          border: 1px solid rgba(255,77,0,0.12);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }
        .team-member:hover {
          border-color: rgba(255,77,0,0.35);
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(255,77,0,0.1);
        }

        .achievement-item {
          display: flex;
          gap: 20px;
          padding: 24px;
          background: rgba(255,77,0,0.03);
          border-left: 4px solid #ff4d00;
          border-radius: 8px;
          transition: all 0.3s ease;
          animation: slideIn 0.6s ease both;
        }
        .achievement-item:nth-child(2) { animation-delay: 0.1s; }
        .achievement-item:nth-child(3) { animation-delay: 0.2s; }
        .achievement-item:nth-child(4) { animation-delay: 0.3s; }
        .achievement-item:hover {
          background: rgba(255,77,0,0.08);
          transform: translateX(8px);
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ff4d00;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: linear-gradient(135deg, #ff4d00, #ff7a00);
          color: #fff;
          padding: 14px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 20px rgba(255,77,0,0.4);
          transition: all 0.25s ease;
          border: none;
          cursor: pointer;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 40px rgba(255,77,0,0.55);
        }

        .social-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,77,0,0.08);
          border: 1px solid rgba(255,77,0,0.2);
          color: #ff4d00;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .social-icon-btn:hover {
          background: rgba(255,77,0,0.15);
          border-color: rgba(255,77,0,0.4);
          transform: translateY(-4px);
        }

        @media (max-width: 768px) {
          .value-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .mission-card { padding: 20px 16px; }
          .achievement-item { flex-direction: column; gap: 12px; }
        }
        @media (max-width: 480px) {
          .value-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, #060606 0%, #100500 50%, #060606 100%)",
        padding: "80px 1.5rem 70px",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
        textAlign: "center",
      }}>
        <div style={{
          position: "absolute",
          width: 400,
          height: 400,
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,77,0,0.12), transparent)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #ff4d00",
            margin: "0 auto 32px",
            animation: "pulseRing 2.5s ease-in-out infinite",
            boxShadow: "0 0 30px rgba(255,77,0,0.3)",
          }}>
            <img src="/favicon.jpg" alt="TechSuperStar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,77,0,0.08)",
            border: "1px solid rgba(255,77,0,0.28)",
            color: "#ff6622",
            fontSize: "10px",
            fontWeight: 700,
            padding: "8px 20px",
            borderRadius: "50px",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: 24,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ff4d00",
              display: "inline-block",
              animation: "dotBlink 1.5s ease-in-out infinite",
            }} />
            Tamil Nadu&apos;s #1 Tech Channel
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 900,
            margin: "0 0 20px",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #fff 20%, #ff4d00 55%, #ffbb66 80%, #fff 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 5s linear infinite",
          }}>
            About TechSuperStar
          </h1>

          <p style={{
            color: "#888",
            fontSize: "clamp(14px, 2vw, 17px)",
            lineHeight: 1.8,
            margin: "0 0 40px",
          }}>
            We&apos;re on a mission to help every Tamil-speaking person make the smartest tech purchases, backed by real reviews and honest advice.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[
              { value: "2.08M+", label: "Subscribers" },
              { value: "500+", label: "Reviews" },
              { value: "10+", label: "Years Experience" },
            ].map((stat) => (
              <div key={stat.label} className="stat-box" style={{ minWidth: "120px" }}>
                <div style={{
                  color: "#ff4d00",
                  fontSize: "24px",
                  fontWeight: 900,
                  fontFamily: "var(--font-playfair), serif",
                  marginBottom: 6,
                }}>{stat.value}</div>
                <div style={{
                  color: "#555",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "70px 1.5rem 80px" }}>

        {/* MISSION & VISION */}
        <ScrollReveal direction="up">
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow">
              <span style={{
                width: 28,
                height: 2,
                background: "#ff4d00",
                borderRadius: 2,
              }} />
              Our Mission
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}>
              <div className="mission-card">
                <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
                <h3 style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 900,
                  fontFamily: "var(--font-playfair), serif",
                  margin: "0 0 12px",
                }}>Honest Reviews</h3>
                <p style={{
                  color: "#888",
                  fontSize: 14,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  No sponsored content. No bias. Just real testing of phones, laptops, tablets, and gadgets with real-world usage, so you know exactly what you&apos;re buying.
                </p>
              </div>

              <div className="mission-card">
                <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
                <h3 style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 900,
                  fontFamily: "var(--font-playfair), serif",
                  margin: "0 0 12px",
                }}>In Your Language</h3>
                <p style={{
                  color: "#888",
                  fontSize: 14,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  Tamil is our language. We explain complex tech in simple, everyday Tamil so everyone understands whether it&apos;s the right buy for their budget.
                </p>
              </div>

              <div className="mission-card">
                <div style={{ fontSize: 40, marginBottom: 16 }}>🏆</div>
                <h3 style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 900,
                  fontFamily: "var(--font-playfair), serif",
                  margin: "0 0 12px",
                }}>Every Budget Covered</h3>
                <p style={{
                  color: "#888",
                  fontSize: 14,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  From ₹5,000 budget phones to ₹2 lakh gaming laptops. We test and review devices at every price point so there&apos;s something for everyone.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* WHO WE ARE */}
        <ScrollReveal direction="up" delay={100}>
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow">
              <span style={{
                width: 28,
                height: 2,
                background: "#ff4d00",
                borderRadius: 2,
              }} />
              Who We Are
            </div>

            <h2 style={{
              color: "#fff",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 900,
              fontFamily: "var(--font-playfair), serif",
              margin: "0 0 32px",
              lineHeight: 1.2,
            }}>
              A Team of Tech Lovers &<br />
              <span style={{ color: "#ff4d00" }}>Tamil Enthusiasts</span>
            </h2>

            <div style={{
              background: "rgba(255,77,0,0.04)",
              border: "1px solid rgba(255,77,0,0.15)",
              borderRadius: 20,
              padding: 40,
              marginBottom: 40,
            }}>
              <p style={{
                color: "#aaa",
                fontSize: 16,
                lineHeight: 1.85,
                margin: 0,
              }}>
                TechSuperStar started with a simple idea: <strong>What if there was a YouTube channel that explained tech in Tamil, without bias, for real people?</strong>
              </p>
              <p style={{
                color: "#aaa",
                fontSize: 16,
                lineHeight: 1.85,
                marginTop: 16,
              }}>
                Today, over 2 million Tamil-speaking tech lovers trust us because we keep it simple — we buy the tech ourselves, test it for weeks, use it in real conditions, and tell you the truth. No scripts written by brands. No reviewing gadgets we haven&apos;t actually used. No bullshit.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {[
                { role: "Founder & Lead Reviewer", name: "Tech Enthusiast", desc: "10+ years testing gadgets, driven by the passion to help Tamil tech lovers." },
                { role: "Video Editor & Producer", name: "Content Creator", desc: "Making complex tech reviews engaging and easy to understand." },
                { role: "Research & Writing", name: "Tech Writer", desc: "Deep dives into specs, performance, and real-world usage." },
              ].map((member, i) => (
                <div key={i} className="team-member">
                  <div style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(255,77,0,0.3), rgba(255,77,0,0.1))",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                  }}>
                    {i === 0 ? "🎬" : i === 1 ? "🎨" : "📝"}
                  </div>
                  <div style={{
                    color: "#ff4d00",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}>{member.role}</div>
                  <div style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 800,
                    marginBottom: 8,
                    fontFamily: "var(--font-playfair), serif",
                  }}>{member.name}</div>
                  <div style={{
                    color: "#555",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}>{member.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* KEY ACHIEVEMENTS */}
        <ScrollReveal direction="up" delay={100}>
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow">
              <span style={{
                width: 28,
                height: 2,
                background: "#ff4d00",
                borderRadius: 2,
              }} />
              Milestones & Achievements
            </div>

            <h2 style={{
              color: "#fff",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 900,
              fontFamily: "var(--font-playfair), serif",
              margin: "0 0 40px",
            }}>
              Growing Trust, One Review at a Time
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "🎥", title: "500+ In-Depth Reviews", desc: "Phones, laptops, tablets, accessories — every category covered with real testing and long-term usage data." },
                { icon: "📺", title: "2.08 Million Subscribers", desc: "Growing community of Tamil tech enthusiasts who rely on us for buying decisions every single day." },
                { icon: "⭐", title: "Trusted by Millions", desc: "Recognized as Tamil Nadu's most credible tech review channel. Zero sponsored reviews. Only honest opinions." },
                { icon: "🌍", title: "Website & Blog", desc: "Written reviews, comparison articles, and buying guides at TechSuperStar.in for those who prefer reading." },
              ].map((achievement, i) => (
                <div key={i} className="achievement-item">
                  <div style={{ fontSize: 32, minWidth: 50, textAlign: "center" }}>
                    {achievement.icon}
                  </div>
                  <div>
                    <div style={{
                      color: "#ff4d00",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}>Achievement</div>
                    <div style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 800,
                      marginBottom: 8,
                      fontFamily: "var(--font-playfair), serif",
                    }}>{achievement.title}</div>
                    <div style={{
                      color: "#888",
                      fontSize: 14,
                      lineHeight: 1.65,
                    }}>{achievement.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* WHAT WE COVER */}
        <ScrollReveal direction="up" delay={100}>
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow">
              <span style={{
                width: 28,
                height: 2,
                background: "#ff4d00",
                borderRadius: 2,
              }} />
              What We Review
            </div>

            <h2 style={{
              color: "#fff",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 900,
              fontFamily: "var(--font-playfair), serif",
              margin: "0 0 40px",
            }}>
              Every Device, Every Budget
            </h2>

            <div className="value-grid">
              {[
                { icon: "📱", title: "Smartphones", desc: "Budget to flagship — from ₹5K to ₹1L+ phones tested in real conditions." },
                { icon: "💻", title: "Laptops", desc: "Work laptops, gaming rigs, ultrabooks — which one is worth your money?" },
                { icon: "📟", title: "Tablets", desc: "iPad vs Android tablets. Real comparisons for professionals and families." },
                { icon: "🎧", title: "Accessories", desc: "Earbuds, chargers, power banks, cases — the complete tech ecosystem." },
                { icon: "🎮", title: "Gaming Devices", desc: "Gaming phones, consoles, gaming laptops for Tamil gamers." },
                { icon: "⌚", title: "Smart Devices", desc: "Smartwatches, fitness trackers, home tech — IoT for everyone." },
              ].map((category, i) => (
                <div key={i} className="mission-card" style={{ background: "#0d0d0d", borderColor: "rgba(255,77,0,0.12)", padding: 24 }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{category.icon}</div>
                  <h3 style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 800,
                    margin: "0 0 10px",
                    fontFamily: "var(--font-playfair), serif",
                  }}>{category.title}</h3>
                  <p style={{
                    color: "#555",
                    fontSize: 13,
                    lineHeight: 1.6,
                    margin: 0,
                  }}>{category.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* OUR VALUES */}
        <ScrollReveal direction="up" delay={100}>
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow">
              <span style={{
                width: 28,
                height: 2,
                background: "#ff4d00",
                borderRadius: 2,
              }} />
              Our Core Values
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}>
              {[
                { title: "Transparency", desc: "We disclose every device we test, every rupee spent, and every limitation we find." },
                { title: "No Bias", desc: "We never accept payment for reviews. Your trust is worth more than any sponsorship deal." },
                { title: "Real Testing", desc: "Not 5-minute reviews. We test gadgets for weeks in real-world conditions." },
                { title: "Tamil First", desc: "Complex tech explained in simple Tamil. Our community understands everything we say." },
                { title: "Value Focus", desc: "We care about your budget. Finding the best tech for your money is our job." },
                { title: "Community Driven", desc: "We listen to your feedback, answer your questions, and review what you ask us to." },
              ].map((value, i) => (
                <div key={i} style={{
                  background: "linear-gradient(135deg, rgba(255,77,0,0.05), rgba(255,77,0,0.01))",
                  border: "1px solid rgba(255,77,0,0.12)",
                  borderRadius: 16,
                  padding: 28,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(255,77,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    fontSize: 22,
                  }}>
                    {i === 0 ? "👁️" : i === 1 ? "⚖️" : i === 2 ? "🔬" : i === 3 ? "📢" : i === 4 ? "💰" : "🤝"}
                  </div>
                  <h3 style={{
                    color: "#ff4d00",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}>{value.title}</h3>
                  <p style={{
                    color: "#666",
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: 0,
                  }}>{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CONNECT WITH US */}
        <ScrollReveal direction="up" delay={100}>
          <div style={{
            background: "linear-gradient(135deg, #140800, #0a0400)",
            border: "1px solid rgba(255,77,0,0.2)",
            borderRadius: 24,
            padding: "60px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,77,0,0.08), transparent)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
              <h2 style={{
                color: "#fff",
                fontSize: "clamp(24px, 5vw, 36px)",
                fontWeight: 900,
                fontFamily: "var(--font-playfair), serif",
                margin: "0 0 12px",
              }}>
                Subscribe & Stay Updated
              </h2>
              <p style={{
                color: "#888",
                fontSize: 15,
                lineHeight: 1.8,
                maxWidth: 500,
                margin: "0 auto 32px",
              }}>
                Get honest reviews, buying guides, and tech news — all in Tamil. New videos every week.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
                <Link href="https://www.youtube.com/@TechSuperStarOfficial" target="_blank" className="btn-primary">
                  <FaYoutube size={18} /> Subscribe on YouTube
                </Link>
                <Link href="/contact" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 32px",
                  border: "1px solid rgba(255,77,0,0.3)",
                  color: "#ff4d00",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  transition: "all 0.25s ease",
                }}>
                  Get in Touch →
                </Link>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                paddingTop: 32,
                borderTop: "1px solid rgba(255,77,0,0.15)",
              }}>
                <Link href="https://www.youtube.com/@TechSuperStarOfficial" target="_blank" className="social-icon-btn" title="YouTube">
                  <FaYoutube size={20} />
                </Link>
                <Link href="https://www.instagram.com/techsuperstarofficial/" target="_blank" className="social-icon-btn" title="Instagram">
                  <FaInstagram size={20} />
                </Link>
                <Link href="https://x.com/Tech_SuperStar" target="_blank" className="social-icon-btn" title="Twitter/X">
                  <FaXTwitter size={20} />
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
