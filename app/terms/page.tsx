import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for TechSuperStar - Rules and guidelines for using our website.",
};

export default function TermsPage() {
  return (
    <div style={{ background: "#060606", minHeight: "100vh", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
      <Navbar />

      <style suppressHydrationWarning>{`
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
          Terms of Use
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
            By accessing and using{" "}
            <span style={{ color: "#ff4d00", fontWeight: 700 }}>TechSuperStar</span>{" "}
            at{" "}
            <a href="https://techsuperstar-site.vercel.app" style={{ color: "#ff4d00" }}>
              techsuperstar-site.vercel.app
            </a>
            , you agree to be bound by these Terms of Use. Please read them carefully before using our website.
          </p>
        </div>

        <div className="policy-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using TechSuperStar, you agree to these Terms of Use and our Privacy Policy. If you do not agree, please do not use our website.
          </p>
        </div>

        <div className="policy-section">
          <h2>2. Use of Content</h2>
          <p>All content on TechSuperStar including articles, reviews, images, and videos is owned by TechSuperStar. You may:</p>
          <ul>
            <li>Read and share our articles with proper credit</li>
            <li>Share links to our articles on social media</li>
          </ul>
          <p>You may NOT:</p>
          <ul>
            <li>Copy or reproduce our content without permission</li>
            <li>Use our content for commercial purposes without written consent</li>
            <li>Claim our content as your own</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>3. Product Reviews & Opinions</h2>
          <p>
            All reviews and opinions on TechSuperStar are based on our own testing and experience. We do not guarantee the accuracy of any product information. Prices, specifications, and availability may change at any time.
          </p>
          <p>
            We are not responsible for any purchase decisions you make based on our reviews. Always do your own research before buying any product.
          </p>
        </div>

        <div className="policy-section">
          <h2>4. Affiliate Links</h2>
          <p>
            Some articles may contain affiliate links to products on Amazon, Flipkart, or other shopping sites. If you click these links and make a purchase, we may earn a small commission at no extra cost to you. This helps us keep the site running and content free.
          </p>
        </div>

        <div className="policy-section">
          <h2>5. Comments</h2>
          <p>
            When you leave a comment on our site, you agree that:
          </p>
          <ul>
            <li>Your comment is respectful and not offensive</li>
            <li>You will not spam or post irrelevant content</li>
            <li>We reserve the right to remove any comment at our discretion</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>6. Disclaimer</h2>
          <p>
            TechSuperStar is provided "as is" without any warranties. We are not responsible for any losses, damages, or issues resulting from using the information or products mentioned on our site. Use all information at your own risk.
          </p>
        </div>

        <div className="policy-section">
          <h2>7. Third Party Links</h2>
          <p>
            Our site may contain links to external websites. We are not responsible for the content or privacy practices of those websites. We encourage you to read their terms and policies before using them.
          </p>
        </div>

        <div className="policy-section">
          <h2>8. Changes to Terms</h2>
          <p>
            We may update these Terms of Use at any time. Changes will be posted on this page with an updated date. Continued use of our website after changes means you accept the new terms.
          </p>
        </div>

        <div className="policy-section">
          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms of Use, contact us through our contact page:</p>
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