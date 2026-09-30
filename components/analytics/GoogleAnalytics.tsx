"use client";

import Script from "next/script";

export function GoogleAnalytics({ id }: { id: string }) {
  if (!/^G-[A-Z0-9]+$/.test(id)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="astroboat-ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(id)},{anonymize_ip:true});`}
      </Script>
    </>
  );
}
