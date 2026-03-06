"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"
import { CheckCircle2 } from "lucide-react"

export default function SectorsAdminPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Sectors — live endpoint.</span>{" "}
          Backed by <code className="bg-green-100 px-1 rounded text-xs">POST /api/sector/addSector</code>{" "}
          and <code className="bg-green-100 px-1 rounded text-xs">GET /api/sector/getSectors</code>.{" "}
          Sectors are the top-level grouping — Industries and Business Types belong to Sectors.
          Use their IDs when creating Categories.
        </div>
      </div>

      <AdminResourcePage
        resource="sectors"
        title="Sectors"
        description="Top-level economic sectors. Categories → Business Types → Sectors form the classification hierarchy."
        columns={[
          {
            key: "sectorId",
            label: "ID",
            render: (r) => (
              <span className="font-mono text-xs text-gray-400">{r.sectorId ?? r.id ?? "—"}</span>
            ),
          },
          {
            key: "sectorName",
            label: "Sector Name",
            render: (r) => (
              <span className="font-semibold text-gray-900">{r.sectorName ?? "—"}</span>
            ),
          },
        ]}
        canDelete={false}
        canCreate={false}
      />
    </div>
  )
}
