"use client"

import { useState } from "react"
import { Star, Send, Loader2, X, MessageSquarePlus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addReviewAction } from "@/app/actions/reviews"

interface ReviewModalProps {
  businessId: string
  businessName: string
  trigger?: React.ReactNode
}

export function ReviewModal({ businessId, businessName, trigger }: ReviewModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"form" | "done">("form")
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [authorName, setAuthorName] = useState("")
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"]
  const colors = ["", "text-red-500", "text-orange-500", "text-yellow-500", "text-lime-500", "text-green-500"]

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setStep("form")
      setRating(0)
      setHovered(0)
      setAuthorName("")
      setComment("")
      setError("")
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError("Please select a rating."); return }
    if (!authorName.trim()) { setError("Please enter your name."); return }
    if (!comment.trim()) { setError("Please write a review."); return }

    setIsLoading(true)
    setError("")
    try {
      const result = await addReviewAction({
        businessId,
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
      })
      if (result.success) {
        setStep("done")
      } else {
        setError("Failed to submit review. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const displayStar = hovered || rating

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl">
            <MessageSquarePlus className="h-4 w-4" />
            Write a Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-bold">
            {step === "done" ? "Review Submitted!" : `Review ${businessName}`}
          </DialogTitle>
        </DialogHeader>

        {step === "done" ? (
          <div className="flex flex-col items-center px-6 pb-8 pt-6 text-center gap-5">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-lg">Thank you for your feedback!</p>
              <p className="text-gray-500 text-sm mt-1">
                Your review helps others make better choices.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">
            {/* Star rating */}
            <div className="text-center">
              <div
                className="flex items-center justify-center gap-2 mb-2"
                onMouseLeave={() => setHovered(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHovered(n)}
                    onClick={() => setRating(n)}
                    className="transition-transform hover:scale-125 focus:outline-none"
                    aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`h-9 w-9 transition-colors ${
                        n <= displayStar ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-100"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {displayStar > 0 && (
                <p className={`text-sm font-bold transition-colors ${colors[displayStar]}`}>
                  {labels[displayStar]}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Wanjiku M."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={60}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Your Review</label>
              <textarea
                rows={4}
                placeholder="Tell others about your experience with this business..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all resize-none"
              />
              <div className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 border border-red-100">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 gap-2"
                disabled={isLoading || rating === 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isLoading ? "Submitting…" : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
