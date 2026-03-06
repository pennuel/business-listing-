"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"
import { Info } from "lucide-react"

export default function CategoriesAdminPage() {
  return (
    <div className="space-y-4">
      {/* Context banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Category hierarchy:</span> Each category links to a{" "}
          <strong>Sector → Industry → Business Type → Offering</strong> chain. When creating a category,
          enter the numeric IDs from the Taxonomy pages below — all fields are optional.{" "}
          Browse parent entities:{" "}
          <a href="/admin/sectors" className="underline font-semibold">Sectors</a> ·{" "}
          <a href="/admin/industries" className="underline font-semibold">Industries</a> ·{" "}
          <a href="/admin/offerings" className="underline font-semibold">Offerings</a> ·{" "}
          <a href="/admin/business-types" className="underline font-semibold">Business Types</a>
        </div>
      </div>


      <AdminResourcePage
        resource="categories"
        title="Categories"
        description="Manage business categories. Each category should be linked to a Sector, Industry, Offering and Business Type."
        columns={[
          {
            key: "categoryId",
            label: "ID",
            render: (r) => (
              <span className="font-mono text-xs text-gray-400">{r.categoryId ?? r.id ?? "—"}</span>
            ),
          },
          {
            key: "categoryName",
            label: "Category Name",
            render: (r) => (
              <span className="font-semibold text-gray-900">{r.categoryName ?? "—"}</span>
            ),
          },
          {
            key: "sector",
            label: "Sector",
            render: (r) => (
              <span className="text-gray-600 text-xs">
                {r.sector?.sectorName ?? <span className="text-gray-300 italic">not linked</span>}
              </span>
            ),
          },
          {
            key: "industry",
            label: "Industry",
            render: (r) => (
              <span className="text-gray-600 text-xs">
                {r.industry?.industryName ?? <span className="text-gray-300 italic">not linked</span>}
              </span>
            ),
          },
          {
            key: "offeringEntity",
            label: "Offering",
            render: (r) => (
              <span className="text-gray-600 text-xs">
                {r.offeringEntity?.offeringName ?? <span className="text-gray-300 italic">not linked</span>}
              </span>
            ),
          },
          {
            key: "businessType",
            label: "Business Type",
            render: (r) => (
              <span className="text-gray-600 text-xs">
                {r.businessType?.businessTypeName ?? <span className="text-gray-300 italic">not linked</span>}
              </span>
            ),
          },
        ]}
        createFields={[
          {
            key: "categoryName",
            label: "Category Name",
            placeholder: "e.g. Photography",
            required: true,
          },
          {
            key: "sectorId",
            label: "Sector ID",
            placeholder: "Sector ID (number)",
            required: false,
          },
          {
            key: "industryId",
            label: "Industry ID",
            placeholder: "Industry ID (number)",
            required: false,
          },
          {
            key: "offeringId",
            label: "Offering ID",
            placeholder: "Offering ID (number)",
            required: false,
          },
          {
            key: "businessTypeId",
            label: "Business Type ID",
            placeholder: "Business Type ID (number)",
            required: false,
          },
        ]}

        canDelete
        canCreate
        mockRows={[
          { categoryId: 1, categoryName: "Photography", sector: { sectorName: "Creative Services" }, industry: { industryName: "Media" }, offeringEntity: { offeringName: "Service" }, businessType: { businessTypeName: "Service Business" } },
          { categoryId: 2, categoryName: "Plumbers", sector: { sectorName: "Trades" }, industry: { industryName: "Construction" }, offeringEntity: null, businessType: null },
          { categoryId: 3, categoryName: "Electricians", sector: { sectorName: "Trades" }, industry: { industryName: "Construction" }, offeringEntity: null, businessType: null },
          { categoryId: 4, categoryName: "Cleaning Services", sector: null, industry: null, offeringEntity: null, businessType: null },
          { categoryId: 5, categoryName: "Auto Repair", sector: { sectorName: "Automotive" }, industry: { industryName: "Mechanics" }, offeringEntity: null, businessType: null },
          { categoryId: 6, categoryName: "Catering", sector: { sectorName: "Food & Beverage" }, industry: { industryName: "Hospitality" }, offeringEntity: { offeringName: "Service" }, businessType: { businessTypeName: "Service Business" } },
        ]}
      />
    </div>
  )
}
