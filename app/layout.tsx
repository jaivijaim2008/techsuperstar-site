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
    template: "%s | TechSuperStar",
  },
  description: "Your ultimate source for honest tech reviews, buying guides, and the latest news in Tamil. Phones, laptops, tablets, gaming and more.",
  keywords: ["tech reviews tamil", "phone review tamil", "laptop review", "TechSuperStar", "tech news india"],
  metadataBase: new URL("https://techsuperstar-site.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "TechSuperStar",
    title: "TechSuperStar - Tech Reviews & News in Tamil",
    description: "Honest tech reviews, buying guides, and latest news in Tamil.",
    images: [{ url: "/favicon.jpg", width: 1200, height: 630, alt: "TechSuperStar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSuperStar - Tech Reviews & News in Tamil",
    description: "Honest tech reviews, buying guides, and latest news in Tamil.",
    images: ["/favicon.jpg"],
    creator: "@Tech_SuperStar",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
      </head>
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}