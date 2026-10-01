import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./discovery.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { SkyGridBackground } from "@/components/visuals/SkyGridBackground";
import { Analytics } from "@vercel/analytics/next";
import { DEFAULT_OG_IMAGE, SITE_URL, safeJsonLd } from "@/lib/seo";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const siteDescription =
  "Astroboat helps you explore astronomy briefs, global space events, Moon phase data, and near-Earth object tracking through a clean observatory-style platform.";
const siteTitle = "Astroboat — Astronomy Intelligence & Sky Tools";
const previewImage = DEFAULT_OG_IMAGE;
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
  metadataBase: new URL(SITE_URL),
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
  alternates: { types: { "application/rss+xml": `${SITE_URL}/feed.xml` } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
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
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {})
  }
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Astroboat",
    url: SITE_URL,
    description: siteDescription,
    image: DEFAULT_OG_IMAGE
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Astroboat",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: DEFAULT_OG_IMAGE
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
          dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
        />
        <SkyGridBackground />
        <div className="relative flex min-h-screen flex-col">
          <a href="#main-content" className="skip-link">Skip to content</a>
          <MobileNav />
          <Header />
          <main id="main-content" className="site-container page-main flex-1" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
        <GlobalSearch />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID ? <GoogleAnalytics id={process.env.NEXT_PUBLIC_GA_ID} /> : null}
      </body>
    </html>
  );
}
