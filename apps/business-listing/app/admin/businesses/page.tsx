"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    suspended: "bg-red-100 text-red-600",
    inactive: "bg-gray-100 text-gray-500",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status?.toLowerCase()] || "bg-gray-100 text-gray-500"}`}>
      {status || "unknown"}
    </span>
  )
}

export default function BusinessesAdminPage() {
  return (
    <AdminResourcePage
      resource="businesses"
      title="Businesses"
      description="All registered business listings. You can search, view and remove listings."
      columns={[
        { key: "bizId", label: "ID", render: (r) => <span className="font-mono text-xs text-gray-400">{r.bizId ?? r.id ?? "—"}</span> },
        {
          key: "businessName",
          label: "Business Name",
          render: (r) => <span className="font-semibold text-gray-900">{r.businessName || r.name || "—"}</span>,
        },
        {
          key: "category",
          label: "Category",
          render: (r) => <span className="text-gray-600">{r.category?.categoryName || r.category || "—"}</span>,
        },
        {
          key: "county",
          label: "Location",
          render: (r) => (
            <span className="text-gray-500 text-xs">{[r.subCounty, r.county].filter(Boolean).join(", ") || "—"}</span>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (r) => <StatusBadge status={r.status || "active"} />,
        },
        {
          key: "isManuallyOpen",
          label: "Open",
          render: (r) => (
            <span className={`text-xs font-bold ${r.isManuallyOpen ? "text-green-600" : "text-gray-400"}`}>
              {r.isManuallyOpen ? "Open" : "Closed"}
            </span>
          ),
        },
      ]}
      canDelete
      canCreate={false}
    />
  )
}
