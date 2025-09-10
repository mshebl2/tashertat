import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FloatingWhatsApp from "@/components/floating-whatsapp"
import "./globals.css"
import { Tajawal as Tejwal } from "next/font/google"

const tejwal = Tejwal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-tejwal",
})

export const metadata: Metadata = {
  title: "تيشيرتاتي - متجر التيشيرتات المخصصة",
  description: "متجر إلكتروني لبيع التيشيرتات المخصصة مع إمكانية رفع التصاميم الشخصية",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tejwal.variable} ${GeistSans.variable} ${GeistMono.variable} font-tejwal arabic-text`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
