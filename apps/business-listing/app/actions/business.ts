"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleStoreStatus(businessId: string, isOpen: boolean) {
  try {
    await prisma.business.update({
      where: { id: businessId },
      data: { isManuallyOpen: isOpen },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle store status:", error)
    return { success: false, error: "Failed to update status" }
  }
}
