"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Plus,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ColumnDef {
  key: string
  label: string
  render?: (row: any) => React.ReactNode
}

export interface AdminResourcePageProps {
  resource: string
  title: string
  description?: string
  columns: ColumnDef[]
  /** Fields to show in the "Add new" form */
  createFields?: { key: string; label: string; placeholder?: string; required?: boolean }[]
  canDelete?: boolean
  canCreate?: boolean
  /** Static fallback rows (shown when backend is offline) */
  mockRows?: any[]
  pageSize?: number
}

interface Toast { id: number; type: "success" | "error"; message: string }

const PAGE_SIZE = 20

export function AdminResourcePage({
  resource,
  title,
  description,
  columns,
  createFields = [],
  canDelete = true,
  canCreate = true,
  mockRows = [],
  pageSize = PAGE_SIZE,
}: AdminResourcePageProps) {
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [q, setQ] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (type: "success" | "error", message: string) => {
    const id = Date.now()
    setToasts((p) => [...p, { id, type, message }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin?resource=${resource}&page=${page}&size=${pageSize}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setRows(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (err: any) {
      setError(err.message)
      if (mockRows.length > 0) { setRows(mockRows); setTotal(mockRows.length) }
    } finally {
      setLoading(false)
    }
  }, [resource, page, pageSize])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin?resource=${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create")
      toast("success", `${title.replace(/ies$/, "y").replace(/s$/, "")} created successfully.`)
      setShowForm(false)
      setFormData({})
      load()
    } catch (err: any) {
      toast("error", err.message || "Failed to create")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) { setConfirmDelete(id); return }
    setDeleting(id)
    setConfirmDelete(null)
    try {
      const res = await fetch(`/api/admin?resource=${resource}&id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete")
      toast("success", "Deleted successfully.")
      setRows((prev) => prev.filter((r) => String(r.id ?? r.bizId ?? r.ID) !== String(id)))
      setTotal((t) => t - 1)
    } catch (err: any) {
      toast("error", err.message)
    } finally {
      setDeleting(null)
    }
  }

  // Client-side search filter
  const filtered = q
    ? rows.filter((r) =>
        columns.some((col) => String(r[col.key] ?? "").toLowerCase().includes(q.toLowerCase()))
      )
    : rows

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto animate-in slide-in-from-right-5 ${
              t.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {t.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{title}</h1>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
          <p className="text-xs text-gray-400 mt-0.5">{total.toLocaleString()} total record{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {canCreate && createFields.length > 0 && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              Add {title.replace(/ies$/, "y").replace(/s$/, "")}
            </Button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
          <AlertCircle className="h-4 w-4 text-orange-500 shrink-0" />
          <span>Backend unavailable — showing {mockRows.length > 0 ? "mock" : "no"} data. ({error})</span>
        </div>
      )}

      {/* Create form */}
      {showForm && createFields.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Add New {title.replace(/ies$/, "y").replace(/s$/, "")}</h3>
            <button onClick={() => { setShowForm(false); setFormData({}) }} className="p-1 rounded-lg hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            {createFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5 flex-1 min-w-40">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder || field.label}
                  required={field.required !== false}
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
            ))}
            <Button type="submit" disabled={submitting} className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 self-end">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {submitting ? "Saving…" : "Create"}
            </Button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}…`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 shadow-sm"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400 hover:text-gray-700" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 font-medium">No records found{q ? ` matching "${q}"` : ""}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {columns.map((col) => (
                    <th key={col.key} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      {col.label}
                    </th>
                  ))}
                  {canDelete && (
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((row, i) => {
                  const rowId = String(
                    row.id ??
                    row.bizId ??
                    row.ID ??
                    row.categoryId ??
                    row.sectorId ??
                    row.industryId ??
                    row.offeringId ??
                    row.countryId ??
                    row.countyId ??
                    row.subCountyId ??
                    row.businessTypeId ??
                    i
                  )
                  const isDeleting = deleting === rowId
                  const pendingConfirm = confirmDelete === rowId
                  return (
                    <tr key={rowId} className={`hover:bg-gray-50 transition-colors ${isDeleting ? "opacity-40" : ""}`}>
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-gray-700">
                          {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                        </td>
                      ))}
                      {canDelete && (
                        <td className="px-4 py-3 text-right">
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin ml-auto text-red-400" />
                          ) : pendingConfirm ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDelete(rowId)}
                                className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg"
                              >
                                Confirm
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDelete(rowId)}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !q && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages} · {total.toLocaleString()} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || loading}
              className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
