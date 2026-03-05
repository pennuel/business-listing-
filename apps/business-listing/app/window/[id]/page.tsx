import { getBusinessByIdAction } from "@/app/actions/business"
import { WindowContent } from "@/components/window/window-content"
import { notFound } from "next/navigation"
import { GET as getDummySearch } from "../../api/search/route"

export default async function WindowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  if (id.startsWith('dummy-business-')) {
    try {
      const dRes = await getDummySearch(new Request("http://localhost/api/search"))
      const dData = await dRes.json()
      const business = dData.businesses.find((b: any) => b.id === id)
      if (business) {
        return <WindowContent businessId={id} initialBusiness={business} />
      }
    } catch(err) {}
  }

  const result = await getBusinessByIdAction(id)

  if (!result.success || !result.business) {
    notFound()
  }

  return <WindowContent businessId={id} initialBusiness={result.business} />
}