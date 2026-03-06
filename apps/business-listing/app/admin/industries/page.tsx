"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"
import { CheckCircle2 } from "lucide-react"

export default function IndustriesAdminPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Industries — live endpoint.</span>{" "}
          Backed by <code className="bg-green-100 px-1 rounded text-xs">POST /api/industry/addIndustry</code>{" "}
          and <code className="bg-green-100 px-1 rounded text-xs">GET /api/industry/getIndustries</code>.{" "}
          Industries sit between Sectors and Categories (e.g. Sector: "Trades" → Industry: "Construction").
        </div>
      </div>

      <AdminResourcePage
        resource="industries"
        title="Industries"
        description="Mid-level industry groupings. Each industry belongs to a Sector and contains multiple Categories."
        columns={[
          {
            key: "industryId",
            label: "ID",
            render: (r) => (
              <span className="font-mono text-xs text-gray-400">{r.industryId ?? r.id ?? "—"}</span>
            ),
          },
          {
            key: "industryName",
            label: "Industry Name",
            render: (r) => (
              <span className="font-semibold text-gray-900">{r.industryName ?? "—"}</span>
            ),
          },
        ]}
        canDelete={false}
        canCreate={false}
      />
    </div>
  )
}
