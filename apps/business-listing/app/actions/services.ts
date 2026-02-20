"use server"

import { database } from "@think-id/database"
import { revalidatePath } from "next/cache"

export async function addService(data: {
  businessId: string
  name: string
  price: number
  currency: string
  duration: number
  description?: string
}) {
  try {
    const service = await database.offerings.addService(data)
    revalidatePath(`/dashboard/services?businessId=${data.businessId}`)
    revalidatePath(`/dashboard?businessId=${data.businessId}`)
    revalidatePath(`/window/${data.businessId}`)
    return { success: true, service }
  } catch (error) {
    console.error("Error adding service:", error)
    return { success: false, error: "Failed to add service" }
  }
}

export async function deleteService(id: string) {
  try {
    // We need the businessId to revalidate paths
    const serviceDetails = await database.offerings.getServiceById(id)
    if (!serviceDetails) return { success: false, error: "Service not found" }
    
    await database.offerings.deleteService(id)
    
    revalidatePath(`/dashboard/services?businessId=${serviceDetails.businessId}`)
    revalidatePath(`/dashboard?businessId=${serviceDetails.businessId}`)
    revalidatePath(`/window/${serviceDetails.businessId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { success: false, error: "Failed to delete service" }
  }
}

export async function updateService(id: string, data: any) {
  try {
    const service = await database.offerings.updateService(id, data)
    revalidatePath(`/dashboard/services?businessId=${service.businessId}`)
    revalidatePath(`/dashboard?businessId=${service.businessId}`)
    revalidatePath(`/window/${service.businessId}`)
    return { success: true, service }
  } catch (error) {
    console.error("Error updating service:", error)
    return { success: false, error: "Failed to update service" }
  }
}
