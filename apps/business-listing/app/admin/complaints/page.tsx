"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function ComplaintsAdminPage() {
  return (
    <AdminResourcePage
      resource="complaints"
      title="Complaints"
      description="User-submitted complaints and reports about business listings. Review and resolve here."
      columns={[
        { key: "id", label: "ID", render: (r) => <span className="font-mono text-xs text-gray-400">{r.id ?? r.complaintId ?? "—"}</span> },
        {
          key: "businessId",
          label: "Business",
          render: (r) => <span className="font-mono text-xs text-blue-600">{r.businessId || "—"}</span>,
        },
        {
          key: "reason",
          label: "Reason",
          render: (r) => <span className="font-semibold text-gray-900 capitalize">{r.reason || r.complaintType || "—"}</span>,
        },
        {
          key: "description",
          label: "Details",
          render: (r) => (
            <span className="text-gray-600 text-xs line-clamp-2 max-w-xs">{r.description || r.comment || "No details provided."}</span>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (r) => {
            const s = (r.status || "open").toLowerCase()
            const c = s === "resolved" ? "text-green-700 bg-green-100" : s === "pending" ? "text-yellow-700 bg-yellow-100" : "text-red-700 bg-red-100"
            return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${c}`}>{s}</span>
          },
        },
        {
          key: "createdAt",
          label: "Filed",
          render: (r) => (
            <span className="text-xs text-gray-400">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" }) : "—"}
            </span>
          ),
        },
      ]}
      canDelete
      canCreate={false}
    />
  )
}
