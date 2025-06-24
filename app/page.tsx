"use client";
import { useUserReducer } from "@/hooks/userhooks/use-user";
import ProfileDashboard from "../components/dashboard/profile-dashboard";
import { useEffect } from "react";
import { fetchUser } from "./actions/profile/fetchuser";

export default function Page() {
  
  const { setUser } = useUserReducer();

  // Initialize user state if needed
  useEffect(() => {
    // Initialize user state
    const initializeUser = async () => {
      try {
        // Example: Fetch user data from API or localStorage
        // const response = await fetch("/api/user");
        // const userData = await response.json();
        const userData = await fetchUser();
        setUser(userData);

        console.log("User initialized:", userData);
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    };

    initializeUser();
  }, [setUser]);

  return <ProfileDashboard />;
}
