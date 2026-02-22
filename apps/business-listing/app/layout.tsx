import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/session-provider"
import { ReduxProvider } from "@/lib/redux/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "THINK Business Listing",
  description: "The digital directory for verified local business .",
    generator: 'v0.app'
}

metadata.icons = {
  icon: "/favicon.ico",
  shortcut: "/favicon.ico",
  apple: "/apple-touch-icon.png",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Providers>{children}</Providers>
        </ReduxProvider>
      </body>
    </html>
  )
}
