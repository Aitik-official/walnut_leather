import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Work_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Suspense } from "react"
import Layout from "@/components/layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Walnut Leather - Premium Leather Jackets",
  description: "Premium full-grain leather jackets, hand-finished for character and built to age beautifully.",
  generator: "v0.app",
  icons: {
    icon: "/logo/walnut-leather-logoonly.png",
    shortcut: "/logo/walnut-leather-logoonly.png",
    apple: "/logo/walnut-leather-logoonly.png",
  },
}

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${workSans.variable} antialiased`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18526517640"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18526517640');
          `}
        </Script>
      </head>
      <body className="font-sans">
        <Suspense fallback={null}>
          <Layout>
            {children}
          </Layout>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
