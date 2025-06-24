"use client";

import ProfileDashboard from "../components/dashboard/profile-dashboard";
import { useEffect } from "react";
import { fetchUser } from "./actions/profile/fetchuser";
import { useUserStore } from "../stores/userStore";

export default function Page() {
  const { setUser, setLoading, setError } = useUserStore();

  useEffect(() => {
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
  }, [setUser, setLoading, setError]);

  return <ProfileDashboard />;
}
