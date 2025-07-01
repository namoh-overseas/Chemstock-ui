import type React from "react"
import { Toaster } from "react-hot-toast"
import "@/styles/globals.css"
import Navbar from "@/components/navbar"
import WhatsAppButton from "@/components/whatsapp-button"
import Footer from "@/components/footer"
import { meta } from "@/metadata/metadata"
import Script from "next/script"

export const metadata = meta

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ChemStock",
              "url": "https://chemstock.vercel.app/",
              "image": "https://chemstock.vercel.app/logo/logo.ico",
              "jobTitle": "Chemical and Dyes Selling Agency",
              "worksFor": {
                "@type": "Corporation",
                "name": "ChemStock"
              },
              "sameAs": [
                "https://www.linkedin.com/in/chem-stock-b53161186",
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <WhatsAppButton />
        <Toaster gutter={5} reverseOrder toastOptions={
          {
            duration: 5000,
            position: "bottom-right",
            
          }
        } />
        <Footer />
      </body>
    </html>
  )
}
