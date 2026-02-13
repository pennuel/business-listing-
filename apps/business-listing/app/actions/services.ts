"use server"

import { prisma } from "@/lib/prisma"
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
    const service = await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        currency: data.currency,
        duration: data.duration,
        description: data.description,
        businessId: data.businessId,
      },
    })
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
    const service = await prisma.service.delete({
      where: { id },
    })
    revalidatePath(`/dashboard/services?businessId=${service.businessId}`)
    revalidatePath(`/dashboard?businessId=${service.businessId}`)
    revalidatePath(`/window/${service.businessId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { success: false, error: "Failed to delete service" }
  }
}

export async function updateService(id: string, data: {
  name?: string
  price?: number
  currency?: string
  duration?: number
  description?: string
}) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data,
    })
    revalidatePath(`/dashboard/services?businessId=${service.businessId}`)
    revalidatePath(`/dashboard?businessId=${service.businessId}`)
    revalidatePath(`/window/${service.businessId}`)
    return { success: true, service }
  } catch (error) {
    console.error("Error updating service:", error)
    return { success: false, error: "Failed to update service" }
  }
}
