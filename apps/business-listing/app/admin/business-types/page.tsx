"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function BusinessTypesAdminPage() {
  return (
    <AdminResourcePage
      resource="businessTypes"
      title="Business Types"
      description="High-level classification types that businesses can belong to (e.g., Product, Service, Hybrid)."
      columns={[
        { key: "id", label: "ID", render: (r) => <span className="font-mono text-xs text-gray-400">{r.id ?? r.businessTypeId ?? "—"}</span> },
        {
          key: "name",
          label: "Type Name",
          render: (r) => <span className="font-semibold text-gray-900">{r.name || r.typeName || r.businessType || "—"}</span>,
        },
      ]}
      createFields={[
        { key: "name", label: "Type Name", placeholder: "e.g. Service Business", required: true },
      ]}
      canDelete
      canCreate
      mockRows={[
        { id: 1, name: "Service Business" },
        { id: 2, name: "Product Business" },
        { id: 3, name: "Hybrid" },
      ]}
    />
  )
}
