import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Work_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Layout from "@/components/layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Walnut Leather - Premium Leather Jackets",
  description: "Premium full-grain leather jackets, hand-finished for character and built to age beautifully.",
  generator: "v0.app",
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
