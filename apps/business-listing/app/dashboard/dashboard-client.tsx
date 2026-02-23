'use client';

import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useUserBusinesses } from '@/lib/hooks/useBusinesses';

import { normalizeBusiness } from '@/lib/utils/mappers';
import { RootState } from '@/lib/redux/store';
import { useUserSync } from '@/lib/hooks/useUserSync';

interface DashboardClientProps {
  userId: string;
  children: React.ReactNode;
}

export function DashboardClient({ userId, children }: DashboardClientProps) {
  // Initialize Redux with user data and set up periodic sync
  useUserSync();
  
  // Get user from Redux
  const user = useSelector((state: RootState) => state.user);
  
  // Fetch businesses with TanStack Query caching
  const { data: businesses = [], isLoading, error } = useUserBusinesses(userId);

  if (error) {
    console.error('Failed to load businesses:', error);
  }
  
  console.log('DashboardClient - user:', user);
  console.log('DashboardClient - businesses:', businesses);

  const businessesList = (businesses.business || []).map((b: any) => {
    const normalized = normalizeBusiness(b);
    return {
      id: normalized.id,
      name: normalized.name,
      image: null,
    };
  });

  const userDisplayInfo = {
    name: user?.name || "User",
    email: user?.email || user?.dbUser?.email || "",
    image: user?.image || null,
  };

  return (
    <SidebarProvider>
      <Suspense fallback={<div className="w-64 h-screen bg-gray-100 animate-pulse" />}>
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
          <div className="font-semibold">Business Dashboard</div>
          {isLoading && <span className="text-xs text-gray-500 ml-2">Loading businesses...</span>}
        </header>
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
