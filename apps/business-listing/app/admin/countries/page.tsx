"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

export default function CountriesAdminPage() {
  return (
    <AdminResourcePage
      resource="countries"
      title="Countries"
      description="Supported countries in the location hierarchy. Counties belong to Countries."
      columns={[
        {
          key: "countryId",
          label: "ID",
          render: (r) => (
            <span className="font-mono text-xs text-gray-400">
              {r.countryId ?? r.id ?? "—"}
            </span>
          ),
        },
        {
          key: "flagLogo",
          label: "Flag",
          render: (r) => (
            <span className="text-xl">{r.flagLogo ?? ""}</span>
          ),
        },
        {
          key: "countryName",
          label: "Country Name",
          render: (r) => (
            <span className="font-semibold text-gray-900">
              {r.countryName ?? "—"}
            </span>
          ),
        },
        {
          key: "countryCode",
          label: "Code",
          render: (r) => (
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">
              {r.countryCode ?? "—"}
            </span>
          ),
        },
      ]}
      createFields={[
        {
          key: "countryName",
          label: "Country Name",
          placeholder: "e.g. Kenya",
          required: true,
        },
        {
          key: "countryCode",
          label: "ISO Code",
          placeholder: "e.g. KE",
          required: false,
        },
        {
          key: "flagLogo",
          label: "Flag Emoji",
          placeholder: "e.g. 🇰🇪",
          required: false,
        },
      ]}
      canDelete
      canCreate
      mockRows={[
        { countryId: 1, countryName: "Kenya", countryCode: "KE", flagLogo: "🇰🇪" },
        { countryId: 2, countryName: "Uganda", countryCode: "UG", flagLogo: "🇺🇬" },
        { countryId: 3, countryName: "Tanzania", countryCode: "TZ", flagLogo: "🇹🇿" },
      ]}
    />
  )
}
