"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function CountiesAdminPage() {
  return (
    <AdminResourcePage
      resource="counties"
      title="Counties"
      description="Counties / regions under each country. Sub-Counties belong to Counties."
      columns={[
        {
          key: "countyId",
          label: "ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.countyId ?? r.id ?? "—"}
            </span>
          ),
        },
        {
          key: "countyName",
          label: "County Name",
          render: (r) => (
            <span className="font-semibold text-gray-900">
              {r.countyName ?? "—"}
            </span>
          ),
        },
        {
          key: "countryId",
          label: "Country ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.countryId ?? "—"}
            </span>
          ),
        },
      ]}
      createFields={[
        {
          key: "countyName",
          label: "County Name",
          placeholder: "e.g. Nairobi",
          required: true,
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
        { countyId: 1, countyName: "Nairobi", countryId: 1 },
        { countyId: 2, countyName: "Mombasa", countryId: 1 },
        { countyId: 3, countyName: "Kisumu", countryId: 1 },
        { countyId: 4, countyName: "Nakuru", countryId: 1 },
        { countyId: 5, countyName: "Eldoret", countryId: 1 },
      ]}
    />
  )
}
