import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";


const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TechSuperStar - Tech Reviews & News in Tamil",
    template: "%s",
  },
  description: "TechSuperStar — Tamil Nadu's #1 tech review channel. Get honest smartphone reviews, laptop buying guides, gaming gear comparisons and the latest tech news in Tamil. 2M+ YouTube subscribers trust us.",
  keywords: [
    "tech reviews tamil",
    "phone review tamil",
    "laptop review tamil",
    "TechSuperStar",
    "tech news india",
    "smartphone review tamil",
    "gaming tamil",
    "tablet review tamil",
    "best phone tamil",
    "tech channel tamil",
  ],
  metadataBase: new URL("https://techsuperstar-site.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "TechSuperStar",
    title: "TechSuperStar - Tech Reviews & News in Tamil",
    description: "Tamil Nadu's #1 tech review channel. Honest smartphone reviews, laptop guides and tech news in Tamil. Trusted by 2M+ subscribers.",
    images: [{ url: "/favicon.jpg", width: 1200, height: 630, alt: "TechSuperStar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSuperStar - Tech Reviews & News in Tamil",
    description: "Tamil Nadu's #1 tech review channel. Honest smartphone reviews, laptop guides and tech news in Tamil. Trusted by 2M+ subscribers.",
    images: ["/favicon.jpg"],
    creator: "@Tech_SuperStar",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://techsuperstar-site.vercel.app",
  },
};

import ParticleBackgroundWrapper from "../components/ParticleBackgroundWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta-IN" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <meta name="monetag" content="78145c028e6f326949b70470d2774ea0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-gray-900 text-white">
        <ParticleBackgroundWrapper />
        {children}
      </body>
    </html>
  );
}