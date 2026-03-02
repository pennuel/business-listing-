"use client";

import ProfileDashboard from "../components/dashboard/profile-dashboard";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useUserQuery } from "@/hooks/useUserQuery";
import { useUserStore } from "../stores/userStore";
import { User } from "@/types/user";

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

  if (status === "loading" || status === "unauthenticated") {
    return <div>Loading authentication...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileDashboard />
    </Suspense>
  );
}
