import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/session-provider"
import { cn } from "@/lib/utils";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("h-full", roboto.variable)}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
