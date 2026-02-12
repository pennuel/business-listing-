import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/components/providers/app-providers"

const inter = Inter({ subsets: ["latin"] })


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Profile Dashboard",
  description: "User profile and application management dashboard",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/favicon-16x16.png" },
      { rel: "icon", url: "/favicon-32x32.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Profile Dashboard",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
        <body className={inter.className}>
          <AppProviders>{children}</AppProviders>
        </body>
    </html>
  )
}
