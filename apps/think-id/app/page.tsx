"use client";

import ProfileDashboard from "../components/dashboard/profile-dashboard";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useUserQuery } from "@/hooks/useUserQuery";
import { useUserStore } from "../stores/userStore";
import { User } from "@/types/user";
import Image from "next/image";

export default function Page() {
  const { data: session, status } = useSession();
  const { setUser, setLoading } = useUserStore();

  const userId = (session?.user as any)?.id as string | undefined;

  // Fetch the real user profile from FusionAuth via TanStack Query
  const { data: apiUser, isLoading } = useUserQuery(userId);

  // Keep Zustand store in sync with TanStack Query data
  // (ProfilePage and other components still read from Zustand)
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("fusionauth");
      return;
    }
    if (status === "loading" || isLoading) {
      setLoading(true);
      return;
    }
    if (apiUser) {
      setUser(apiUser as unknown as User);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [apiUser, isLoading, status, setUser, setLoading]);

  if (status === "loading" || status === "unauthenticated" || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center space-y-8 animate-pulse">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-lg border-4 border-white">
            <Image
              src="/logos/THiNK_Logo_Updated-02(icon).jpg"
              alt="THiNK Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Accessing THiNK ID</h1>
            <p className="text-sm text-gray-500">Personalizing your experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    }>
      <ProfileDashboard />
    </Suspense>
  );
}
