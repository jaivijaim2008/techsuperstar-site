import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for TechSuperStar - Learn how we collect and use your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
      <Navbar />

      <style>{`
        .policy-section { margin-bottom: 36px; }
        .policy-section h2 {
          color: #ff4d00;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,77,0,0.15);
          font-family: var(--font-dm-sans), sans-serif;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .policy-section p {
          color: #666;
          font-size: 15px;
          line-height: 1.9;
          margin-bottom: 12px;
        }
        .policy-section ul {
          color: #666;
          font-size: 15px;
          line-height: 1.9;
          padding-left: 20px;
          margin-bottom: 12px;
        }
        .policy-section ul li { margin-bottom: 8px; }
      `}</style>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #060606 0%, #0f0600 50%, #060606 100%)",
        padding: "60px 1.5rem 48px",
        borderBottom: "1px solid rgba(255,77,0,0.1)",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.28)",
          color: "#ff6622", fontSize: "10px", fontWeight: "700",
          padding: "6px 18px", borderRadius: "50px",
          letterSpacing: "2.5px", textTransform: "uppercase",
          marginBottom: "20px",
        }}>
          Legal
        </div>
        <h1 style={{
          color: "#fff",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: "900",
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          margin: "0 0 16px",
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#444", fontSize: "13px" }}>Last updated: May 6, 2026</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "52px 1.5rem 80px" }}>

        <div style={{
          background: "rgba(255,77,0,0.05)",
          border: "1px solid rgba(255,77,0,0.15)",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "40px",
        }}>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.8", margin: 0 }}>
            At <span style={{ color: "#ff4d00", fontWeight: 700 }}>TechSuperStar</span>, accessible from{" "}
            <a href="https://techsuperstar-site.vercel.app" style={{ color: "#ff4d00" }}>
              techsuperstar-site.vercel.app
            </a>
            , one of our main priorities is the privacy of our visitors. This Privacy Policy explains what information we collect and how we use it.
          </p>
        </div>

        <div className="policy-section">
          <h2>Information We Collect</h2>
          <p>When you leave a comment on our articles, we collect:</p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your comment message</li>
          </ul>
          <p>We do not sell, trade, or share this information with any third party.</p>
        </div>

        <div className="policy-section">
          <h2>Google AdSense & Cookies</h2>
          <p>
            TechSuperStar uses Google AdSense to display advertisements. Google AdSense may use cookies to serve ads based on your prior visits to our website or other websites on the internet.
          </p>
          <p>
            You can opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#ff4d00" }}>
              Google Ads Settings
            </a>.
          </p>
        </div>

        <div className="policy-section">
          <h2>Google Analytics</h2>
          <p>
            We use Google Analytics to understand how visitors use our site. Google Analytics collects anonymous data such as pages visited, time spent on site, and device type. This data helps us improve our content and user experience.
          </p>
        </div>

        <div className="policy-section">
          <h2>YouTube Embedded Videos</h2>
          <p>
            Our articles contain embedded YouTube videos. When you play a video, YouTube may set cookies on your browser. Please refer to{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#ff4d00" }}>
              Google's Privacy Policy
            </a>{" "}
            for more information.
          </p>
        </div>

        <div className="policy-section">
          <h2>Third Party Links</h2>
          <p>
            Our articles may contain links to external websites such as Amazon, Flipkart, or other tech sites. We are not responsible for the privacy practices of those websites. We encourage you to read their privacy policies before providing any personal information.
          </p>
        </div>

        <div className="policy-section">
          <h2>Children's Privacy</h2>
          <p>
            TechSuperStar does not knowingly collect any personal information from children under the age of 13. If you believe your child has provided us with personal information, please contact us immediately.
          </p>
        </div>

        <div className="policy-section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this page periodically.
          </p>
        </div>

        <div className="policy-section">
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through our contact page:</p>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,77,0,0.08)",
            border: "1px solid rgba(255,77,0,0.25)",
            color: "#ff4d00", padding: "10px 24px",
            borderRadius: "50px", textDecoration: "none",
            fontSize: "13px", fontWeight: "700",
          }}>
            Go to Contact Page →
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}