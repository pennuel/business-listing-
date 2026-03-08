"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function SubCountiesAdminPage() {
  return (
    <AdminResourcePage
      resource="subCounties"
      title="Sub-Counties"
      description="Sub-county / constituency level of the location hierarchy. Used on business listing addresses."
      columns={[
        {
          key: "subCountyId",
          label: "ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.subCountyId ?? r.id ?? "—"}
            </span>
          ),
        },
        {
          key: "subCountyName",
          label: "Sub-County Name",
          render: (r) => (
            <span className="font-semibold text-gray-900">
              {r.subCountyName ?? "—"}
            </span>
          ),
        },
        {
          key: "countyId",
          label: "County ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.countyId ?? "—"}
            </span>
          ),
        },
      ]}
      createFields={[
        {
          key: "subCountyName",
          label: "Sub-County Name",
          placeholder: "e.g. Westlands",
          required: true,
        },
        {
          key: "countyId",
          label: "County ID",
          placeholder: "e.g. 1",
          required: false,
        },
        {
          key: "countryId",
          label: "Country ID",
          placeholder: "e.g. 1",
          required: false,
        },
      ]}
      canDelete
      canCreate
      mockRows={[
        { subCountyId: 1, subCountyName: "Westlands", countyId: 1 },
        { subCountyId: 2, subCountyName: "Embakasi", countyId: 1 },
        { subCountyId: 3, subCountyName: "Starehe", countyId: 1 },
        { subCountyId: 4, subCountyName: "Mvita", countyId: 2 },
        { subCountyId: 5, subCountyName: "Kisumu Central", countyId: 3 },
      ]}
    />
  )
}
