"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"
import { CheckCircle2 } from "lucide-react"

export default function OfferingsAdminPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Offerings — live endpoint.</span>{" "}
          Backed by <code className="bg-green-100 px-1 rounded text-xs">POST /api/offering/addOffering</code>{" "}
          and <code className="bg-green-100 px-1 rounded text-xs">GET /api/offering/getOfferings</code>.{" "}
          Offerings describe <em>how</em> value is delivered (e.g. "Service", "Product", "Subscription") and
          link to both Business Types and Categories.
        </div>
      </div>

      <AdminResourcePage
        resource="offerings"
        title="Offerings"
        description="Offering types define how a business delivers value. Linked to Business Types and Categories."
        columns={[
          {
            key: "offeringId",
            label: "ID",
            render: (r) => (
              <span className="font-mono text-xs text-gray-400">{r.offeringId ?? r.id ?? "—"}</span>
            ),
          },
          {
            key: "offeringName",
            label: "Offering Name",
            render: (r) => (
              <span className="font-semibold text-gray-900">{r.offeringName ?? "—"}</span>
            ),
          },
        ]}
        canDelete={false}
        canCreate={false}
      />
    </div>
  )
}
