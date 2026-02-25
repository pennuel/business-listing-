'use client';

import React, { Suspense } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useUserBusinesses } from '@/lib/hooks/useBusinesses';
import { useSession } from "next-auth/react"


import { normalizeBusiness } from '@/lib/utils/mappers';

import { useUserSync } from '@/lib/hooks/useUserSync';

interface DashboardClientProps {
  userId: string;
  children: React.ReactNode;
}

export function DashboardClient({ userId, children }: DashboardClientProps) {

  const {data: session} = useSession();

  // Initialize Redux with user data from server using userId
  useUserSync({ userId });
  console.log('DashboardClient mounted, userId:', userId);
  
  
  // Fetch businesses with TanStack Query caching
  const { data: businesses = [], isLoading, error } = useUserBusinesses(userId);

  if (error) {
    console.error('Failed to load businesses:', error);
  }
                                                 

  console.log('DashboardClient - businesses:', businesses);

  const businessesList = ((businesses as any) || []).map((b: any) => {
    const normalized = normalizeBusiness(b);
    return {
      id: normalized.id,
      name: normalized.name,
      image: null,
    };
  });

  const userDisplayInfo = {
    name: (session?.user as any)?.name || "User",
    email: (session?.user as any)?.email || "",
    image: (session?.user as any)?.image || null,
  };

  return (
    <SidebarProvider>
      <Suspense fallback={<div className="w-64 h-screen bg-sidebar animate-pulse" />}>
        <AppSidebar
          businesses={businessesList}
          currentBusinessId=""
          user={userDisplayInfo}
        />
      </Suspense>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border mx-2" />
          <span className="font-semibold">Business Dashboard</span>
          {isLoading && <span className="text-xs text-muted-foreground ml-2">Loading...</span>}
        </header>

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
