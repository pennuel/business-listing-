"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function SectorsAdminPage() {
  return (
    <AdminResourcePage
      resource="sectors"
      title="Sectors"
      description="Top-level economic sectors. Industries belong to Sectors, which group Categories at the highest level."
      columns={[
        {
          key: "sectorId",
          label: "ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.sectorId ?? r.id ?? "—"}
            </span>
          ),
        },
        {
          key: "sectorName",
          label: "Sector Name",
          render: (r) => (
            <span className="font-semibold text-gray-900">
              {r.sectorName ?? "—"}
            </span>
          ),
        },
      ]}
      createFields={[
        {
          key: "sectorName",
          label: "Sector Name",
          placeholder: "e.g. Technology",
          required: true,
        },
      ]}
      canDelete
      canCreate
      mockRows={[
        { sectorId: 1, sectorName: "Creative Services" },
        { sectorId: 2, sectorName: "Trades" },
        { sectorId: 3, sectorName: "Food & Beverage" },
        { sectorId: 4, sectorName: "Automotive" },
        { sectorId: 5, sectorName: "Healthcare" },
        { sectorId: 6, sectorName: "Technology" },
      ]}
    />
  )
}
