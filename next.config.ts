import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apod.nasa.gov"
      },
      {
        protocol: "https",
        hostname: "images-assets.nasa.gov"
      },
      {
        protocol: "https",
        hostname: "www.nasa.gov"
      },
      {
        protocol: "https",
        hostname: "stsci-opo.org"
      },
      {
        protocol: "https",
        hostname: "webbtelescope.org"
      },
      {
        protocol: "https",
        hostname: "hubblesite.org"
      },
      {
        protocol: "https",
        hostname: "cdn.esa.int"
      },
      {
        protocol: "https",
        hostname: "cdn.esawebb.org"
      },
      {
        protocol: "https",
        hostname: "cdn.esahubble.org"
      },
      {
        protocol: "https",
        hostname: "cdn.eso.org"
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org"
      },
      {
        protocol: "https",
        hostname: "photojournal.jpl.nasa.gov"
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov"
      }
    ]
  }
};

export default nextConfig;
