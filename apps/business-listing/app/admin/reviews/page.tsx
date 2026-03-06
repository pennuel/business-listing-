"use client"

import { AdminResourcePage } from "@/components/admin/admin-resource-page"

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "text-yellow-400" : "text-gray-200"}>★</span>
      ))}
    </span>
  )
}

export default function ReviewsAdminPage() {
  return (
    <AdminResourcePage
      resource="reviews"
      title="Reviews"
      description="All customer reviews across all businesses. Moderate or remove inappropriate content."
      columns={[
        { key: "id", label: "ID", render: (r) => <span className="font-mono text-xs text-gray-400">{r.id ?? "—"}</span> },
        {
          key: "authorName",
          label: "Author",
          render: (r) => <span className="font-semibold text-gray-900">{r.authorName || "Anonymous"}</span>,
        },
        {
          key: "rating",
          label: "Rating",
          render: (r) => <Stars rating={r.rating || 0} />,
        },
        {
          key: "comment",
          label: "Comment",
          render: (r) => (
            <span className="text-gray-600 text-xs line-clamp-2 max-w-xs">{r.comment || "—"}</span>
          ),
        },
        {
          key: "createdAt",
          label: "Date",
          render: (r) => (
            <span className="text-xs text-gray-400">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" }) : "—"}
            </span>
          ),
        },
      ]}
      canDelete
      canCreate={false}
      mockRows={[
        { id: "r1", authorName: "Wanjiku M.", rating: 5, comment: "Absolutely incredible service!", createdAt: "2026-02-10T08:30:00Z" },
        { id: "r2", authorName: "Kamau J.", rating: 4, comment: "Good experience overall.", createdAt: "2026-02-05T14:00:00Z" },
        { id: "r3", authorName: "Odhiambo P.", rating: 5, comment: "Best in the area by far!", createdAt: "2026-01-28T11:00:00Z" },
      ]}
    />
  )
}
