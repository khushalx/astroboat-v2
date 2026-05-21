import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { SkyGridBackground } from "@/components/visuals/SkyGridBackground";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://astroboat.in";
const siteDescription =
  "Astroboat helps you explore astronomy briefs, global space events, Moon phase data, and near-Earth object tracking through a clean observatory-style platform.";
const siteTitle = "Astroboat — Astronomy Intelligence & Sky Tools";
const previewImage = "/astroboat-search-banner.png";
const previewImageAlt = "Astroboat astronomy intelligence and sky tools";

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
    default: siteTitle,
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
    url: "https://astroboat.in",
    siteName: "Astroboat",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: previewImageAlt
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [previewImage]
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

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Astroboat",
    url: "https://astroboat.in",
    description: siteDescription,
    image: "https://astroboat.in/astroboat-search-banner.png"
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Astroboat",
    url: "https://astroboat.in",
    logo: "https://astroboat.in/icon.svg",
    image: "https://astroboat.in/astroboat-search-banner.png"
  }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
