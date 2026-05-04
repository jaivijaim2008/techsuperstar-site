import type { Metadata } from "next";
import "./globals.css"; // ← This line must be here!

export const metadata: Metadata = {
  title: "TechSuperStar - Tech Reviews & News",
  description: "Your ultimate source for tech reviews, news, and buying guides",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
      </head>
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}