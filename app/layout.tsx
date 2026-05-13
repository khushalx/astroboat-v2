import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { SkyGridBackground } from "@/components/visuals/SkyGridBackground";

export const metadata: Metadata = {
  title: "Astroboat | Astronomy Intelligence",
  description:
    "Astronomy briefs, global space events, Moon data, asteroid tracking, and beginner-friendly explainers."
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
