import type { Metadata } from "next";

export const meta: Metadata = {
  title: "ChemStock - Chemical and Dyes Selling Agency",
  description: "Buy and sell chemicals and dyes with ease",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  },

  alternates: {
    canonical: "https://chemstock.vercel.app",
    languages: {
      "en-US": "https://chemstock.vercel.app",
    },
  },

  openGraph: {
    title: "ChemStock - Chemical and Dyes Selling Agency",
    description: "Buy and sell chemicals and dyes with ease",
    url: "https://chemstock.vercel.app",
    siteName: "ChemStock - Chemical and Dyes Selling Agency",
    images: [
      {
        url: "/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChemStock - Chemical and Dyes Selling Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "https://chemstock.vercel.app",
    creator: "@ChemStock",
    title: "ChemStock - Chemical and Dyes Selling Agency",
    description: "Buy and sell chemicals and dyes with ease",
    images: ["/assets/images/og-image.png"],
  },

  // SEO
  keywords: ["ChemStock", "Chemical and Dyes Selling Agency", "Buy and sell chemicals and dyes with ease"],
  authors: [{ name: "ChemStock", url: "https://chemstock.vercel.app" }],
  creator: "ChemStock",

  manifest: "/site.webmanifest",

  icons: {
    icon: "/logo/logo.ico",
    shortcut: "/logo/logo.ico",
    apple: "/logo/logo.ico",
    other: [{ rel: "icon", url: "/logo/logo.ico" }],
  }
};
