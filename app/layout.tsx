import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { SkyGridBackground } from "@/components/visuals/SkyGridBackground";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroboat.in";
const siteDescription =
  "Astroboat helps you explore astronomy briefs, global space events, Moon phase data, and near-Earth object tracking through a clean observatory-style platform.";

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Astroboat — Astronomy Intelligence & Sky Tools",
    template: "%s — Astroboat"
  },
  description: siteDescription,
  keywords: [
    "Astroboat",
    "astronomy",
    "space events",
    "astronomy briefs",
    "Moon phase",
    "near-Earth objects",
    "asteroid watch",
    "sky tools",
    "space science"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Astroboat",
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description: siteDescription,
    images: ["/opengraph-image"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description: siteDescription,
    images: ["/twitter-image"]
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
        <SkyGridBackground />
        <Sidebar />
        <div className="min-h-screen lg:pl-72">
          <MobileNav />
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
          <Footer />
        </div>
        <GlobalSearch />
      </body>
    </html>
  );
}
