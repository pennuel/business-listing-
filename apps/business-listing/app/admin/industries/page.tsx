"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function IndustriesAdminPage() {
  return (
    <AdminResourcePage
      resource="industries"
      title="Industries"
      description="Mid-level industry groupings. Each industry belongs to a Sector and contains multiple Categories."
      columns={[
        {
          key: "industryId",
          label: "ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.industryId ?? r.id ?? "—"}
            </span>
          ),
        },
        {
          key: "industryName",
          label: "Industry Name",
          render: (r) => (
            <span className="font-semibold text-gray-900">
              {r.industryName ?? "—"}
            </span>
          ),
        },
      ]}
      createFields={[
        {
          key: "industryName",
          label: "Industry Name",
          placeholder: "e.g. Construction",
          required: true,
        },
      ]}
      canDelete
      canCreate
      mockRows={[
        { industryId: 1, industryName: "Media" },
        { industryId: 2, industryName: "Construction" },
        { industryId: 3, industryName: "Hospitality" },
        { industryId: 4, industryName: "Mechanics" },
        { industryId: 5, industryName: "Retail" },
      ]}
    />
  )
}
