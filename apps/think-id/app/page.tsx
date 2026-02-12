"use client";

import ProfileDashboard from "../components/dashboard/profile-dashboard";
import { Suspense, useEffect } from "react";
import { fetchUser } from "./actions/profile/fetchuser";
import { useUserStore } from "../stores/userStore";
import { useSession, signIn } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  const { setUser, setLoading, setError } = useUserStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("fusionauth");
      return;
    }

    if (status === "loading") return;

    const initializeUser = async () => {
      setLoading(true);
      try {
        const userData = await fetchUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to initialize user:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load user"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [setUser, setLoading, setError, status]);

  if (status === "loading" || status === "unauthenticated") {
    return <div>Loading authentication...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileDashboard />
    </Suspense>
  );
}
