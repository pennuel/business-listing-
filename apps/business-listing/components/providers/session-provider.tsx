"use client"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

interface ProvidersProps {
  children: ReactNode
  session?: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <TooltipProvider delayDuration={0}>
          {children}
          <Toaster richColors closeButton position="bottom-right" />
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
