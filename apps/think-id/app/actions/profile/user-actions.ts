"use server";

import { userService } from "@think-id/database";
import { UpdateUserRequest } from "@think-id/types";

/**
 * Fetch the full FusionAuth user profile by their UUID.
 * Used by the TanStack Query hook.
 */
export async function fetchUserById(userId: string) {
  try {
    const user = await userService.getUserById(userId);
    return { success: true, user };
  } catch (error) {
    console.error("[fetchUserById] Failed:", error);
    return { success: false, error: "Failed to fetch user", user: null };
  }
}

/**
 * Update the FusionAuth user profile.
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserRequest,
) {
  try {
    const user = await userService.updateUser(userId, data);
    return { success: true, user };
  } catch (error) {
    console.error("[updateUserProfile] Failed:", error);
    return { success: false, error: "Failed to update profile", user: null };
  }
}
