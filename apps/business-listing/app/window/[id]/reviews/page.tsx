import { fetchBusinessById } from "@/lib/backend"
import { fetchReviewsAction } from "@/app/actions/reviews"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ReviewModal } from "@/components/window/review-modal"
import { ArrowLeft, Star, MessageSquare, Building2 } from "lucide-react"
import Link from "next/link"

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "h-5 w-5" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${sz} ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  )
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-8 text-right text-gray-600 font-medium">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-gray-400 text-xs">{count}</span>
    </div>
  )
}

export default async function BusinessReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [business, reviews] = await Promise.all([
    fetchBusinessById(id).catch(() => null),
    fetchReviewsAction(id),
  ])

  if (!business) notFound()

  const displayName = business.name || business.businessName || "Business"
  const categoryName = business.category?.categoryName || business.category || "Service"

  // Aggregate stats
  const total = reviews.length
  const avg =
    total > 0 ? (reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / total).toFixed(1) : "—"
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r: any) => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating]++ })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link
            href={`/window/${id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {displayName}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Business summary */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
            {business.logo ? (
              <img src={business.logo} alt={displayName} className="h-full w-full object-cover rounded-xl" />
            ) : (
              <Building2 className="h-7 w-7 text-white opacity-70" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-sm text-gray-500">{categoryName} · {business.subCounty}, {business.county}</p>
          </div>
        </div>

        {/* Rating summary card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Big number */}
            <div className="text-center sm:text-left sm:w-36 shrink-0">
              <div className="text-6xl font-black text-gray-900 leading-none">{avg}</div>
              <StarRating rating={Math.round(Number(avg))} size="lg" />
              <div className="text-sm text-gray-400 mt-1">{total} review{total !== 1 ? "s" : ""}</div>
            </div>

            {/* Bars */}
            <div className="flex-1 space-y-2 w-full">
              {[5, 4, 3, 2, 1].map((n) => (
                <RatingBar key={n} label={`${n}★`} count={dist[n]} total={total} />
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t flex justify-end">
            <ReviewModal businessId={id} businessName={displayName} />
          </div>
        </div>

        {/* Review list */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          All Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No reviews yet.</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to share your experience.</p>
            <div className="mt-4">
              <ReviewModal businessId={id} businessName={displayName} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-2xl border shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                      {(review.authorName || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{review.authorName || "Anonymous"}</div>
                      <div className="text-xs text-gray-400">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString("en-KE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating || 0} />
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

                {review.reply && (
                  <div className="mt-4 ml-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-xs font-bold text-blue-700 mb-1">Response from owner</div>
                    <p className="text-sm text-gray-700">{review.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
