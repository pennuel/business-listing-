import { fetchBusinessById } from "@/lib/backend"
import { WindowContent } from "@/components/window/window-content"
import { notFound } from "next/navigation"

export default async function WindowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const business = await fetchBusinessById(id)
    if (!business) notFound()
    return <WindowContent businessId={id} initialBusiness={business} />
  } catch (err) {
    console.error(`[WindowPage] Failed to load business ${id}:`, err)
    notFound()
  }
}