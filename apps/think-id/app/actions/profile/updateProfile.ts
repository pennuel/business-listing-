"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { userService } from "@think-id/database";
import type { UpdateUserRequest } from "@think-id/types";

/**
 * Updates the FusionAuth user profile via the Spring Boot API.
 * Reads the user's ID from the active session so no ID needs to be passed in.
 */
export async function updateProfile(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const getValue = (key: string) => {
      const value = formData.get(key);
      return value ? String(value).trim() : undefined;
    };

    const data: UpdateUserRequest = {
      firstName: getValue("firstName"),
      lastName: getValue("lastName"),
      username: getValue("username"),
      mobilePhone: getValue("mobilePhone"),
      birthDate: getValue("birthDate"),
    };

    const updated = await userService.updateUser(userId, data);

    if (!updated) {
      return {
        success: false,
        error: "Failed to update profile — API returned no user",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[updateProfile] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
