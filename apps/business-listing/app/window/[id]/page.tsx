import { getBusinessByIdAction } from "@/app/actions/business"
import { WindowContent } from "@/components/window/window-content"
import { notFound } from "next/navigation"

export default async function WindowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getBusinessByIdAction(id)

  if (!result.success || !result.business) {
    notFound()
  }

  return <WindowContent businessId={id} initialBusiness={result.business} />
}