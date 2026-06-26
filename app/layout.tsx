import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SnapStream | Ultimate TikTok & Instagram Downloader",
  description: "Download TikTok videos without watermarks and high-quality Instagram reels, posts, and image carousels instantly. Safe, fast, and 100% free.",
  keywords: ["tiktok downloader", "instagram downloader", "no watermark tiktok", "download reels", "instagram carousel download", "free video downloader"],
  openGraph: {
    title: "SnapStream | Ultimate TikTok & Instagram Downloader",
    description: "Download TikTok videos without watermarks and high-quality Instagram reels, posts, and image carousels instantly.",
    type: "website",
    locale: "en_US",
    siteName: "SnapStream",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-red-500/30 selection:text-red-200">
        {children}
      </body>
    </html>
  );
}
