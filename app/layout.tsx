import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { SkyGridBackground } from "@/components/visuals/SkyGridBackground";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astroboat.in";
const siteDescription =
  "Track astronomy briefs, global space events, Moon phase data, and near-Earth object close approaches with Astroboat.";

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
    url: "/",
    siteName: "Astroboat",
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Astroboat astronomy intelligence and sky tools"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description: siteDescription,
    images: ["/og-image.png"]
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
      <body>
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
