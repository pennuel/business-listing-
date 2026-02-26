"use server"

import { userService } from "@think-id/database"

export async function fetchUserById(userId: string) {
  try {
    const user = await userService.getUserById(userId)
    return { success: true, user }
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return { success: false, error: "Failed to fetch user", user: null }
  }
}

export async function syncUserWithDatabase(userId: string) {
  try {
    const user = await userService.syncUserWithDB(userId)
    return { success: true, user }
  } catch (error) {
    console.error("Failed to sync user:", error)
    return { success: false, error: "Failed to sync user", user: null }
  }
}
