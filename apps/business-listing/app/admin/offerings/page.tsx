"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function OfferingsAdminPage() {
  return (
    <AdminResourcePage
      resource="offerings"
      title="Offerings"
      description="Offering types define how a business delivers value — e.g. Service, Product, Subscription, Consultation."
      columns={[
        {
          key: "offeringId",
          label: "ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.offeringId ?? r.id ?? "—"}
            </span>
          ),
        },
        {
          key: "offeringName",
          label: "Offering Name",
          render: (r) => (
            <span className="font-semibold text-gray-900">
              {r.offeringName ?? "—"}
            </span>
          ),
        },
      ]}
      createFields={[
        {
          key: "offeringName",
          label: "Offering Name",
          placeholder: "e.g. Subscription",
          required: true,
        },
      ]}
      canDelete
      canCreate
      mockRows={[
        { offeringId: 1, offeringName: "Service" },
        { offeringId: 2, offeringName: "Product" },
        { offeringId: 3, offeringName: "Hybrid" },
        { offeringId: 4, offeringName: "Subscription" },
        { offeringId: 5, offeringName: "Consultation" },
      ]}
    />
  )
}
