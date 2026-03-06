"use client"

import { useEffect, useState } from "react"
import {
  Building2,
  Tag,
  Star,
  AlertTriangle,
  Layers,
  TrendingUp,
  Wifi,
  WifiOff,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface Stats {
  businesses: number | null
  categories: number | null
  reviews: number | null
  complaints: number | null
  backendOnline: boolean
}

const STAT_CARDS = [
  { key: "businesses", label: "Total Businesses", icon: Building2, href: "/admin/businesses", color: "blue" },
  { key: "categories", label: "Categories", icon: Tag, href: "/admin/categories", color: "indigo" },
  { key: "reviews", label: "Reviews", icon: Star, href: "/admin/reviews", color: "yellow" },
  { key: "complaints", label: "Complaints", icon: AlertTriangle, href: "/admin/complaints", color: "red" },
] as const

const COLOR_MAP = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100", num: "text-blue-700", title: "text-blue-900" },
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-100", num: "text-indigo-700", title: "text-indigo-900" },
  yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-100", num: "text-yellow-700", title: "text-yellow-900" },
  red: { bg: "bg-red-50", icon: "text-red-500", border: "border-red-100", num: "text-red-600", title: "text-red-900" },
}

function StatCard({
  label,
  icon: Icon,
  value,
  href,
  color,
}: {
  label: string
  icon: React.ElementType
  value: number | null
  href: string
  color: keyof typeof COLOR_MAP
}) {
  const c = COLOR_MAP[color]
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-4 p-5 rounded-2xl border ${c.border} ${c.bg} hover:shadow-md transition-all hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
        <ArrowRight className={`h-4 w-4 ${c.icon} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>
      <div>
        <div className={`text-3xl font-black ${c.num}`}>
          {value === null ? (
            <span className="text-gray-300 text-xl">—</span>
          ) : (
            value.toLocaleString()
          )}
        </div>
        <div className={`text-sm font-semibold mt-0.5 ${c.title}`}>{label}</div>
      </div>
    </Link>
  )
}

const QUICK_LINKS = [
  { href: "/admin/categories", label: "Manage Categories", icon: Tag, desc: "Add, remove and view all business categories" },
  { href: "/admin/business-types", label: "Business Types", icon: Layers, desc: "Control the taxonomy of business types" },
  { href: "/admin/businesses", label: "All Businesses", icon: Building2, desc: "View, search and moderate business listings" },
  { href: "/admin/reviews", label: "Moderate Reviews", icon: Star, desc: "Read and remove inappropriate reviews" },
  { href: "/admin/complaints", label: "Complaints Queue", icon: AlertTriangle, desc: "Handle flagged businesses and user reports" },
]

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchStats = () => {
    setLoading(true)
    fetch("/api/admin?resource=stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLastRefresh(new Date()) })
      .catch(() => setStats({ businesses: null, categories: null, reviews: null, complaints: null, backendOnline: false }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStats() }, [])

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Control Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all data flowing through the Think Business platform.</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Backend status banner */}
      {stats && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
            stats.backendOnline
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {stats.backendOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span>
            {stats.backendOnline
              ? `Kotlin backend is online and responding · Last synced ${lastRefresh.toLocaleTimeString()}`
              : "Kotlin backend is unreachable — showing cached or mock data"}
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon, href, color }) => (
          <StatCard
            key={key}
            label={label}
            icon={icon}
            value={loading ? null : stats?.[key as keyof Stats] as number | null}
            href={href}
            color={color}
          />
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 p-4 bg-white rounded-2xl border hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="h-9 w-9 rounded-xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                <Icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* API endpoint reference */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">API Endpoint Map</h2>
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Resource</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Kotlin Endpoint</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Methods</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { resource: "Businesses", endpoint: "/api/BusinessInfo", methods: "GET, PUT, DELETE", status: "connected" },
                { resource: "Categories", endpoint: "/api/Category", methods: "GET, POST, DELETE", status: "connected" },
                { resource: "Reviews", endpoint: "/api/Reviews", methods: "GET, POST, PUT, DELETE", status: "connected" },
                { resource: "Business Types", endpoint: "/api/businessType", methods: "GET, POST, DELETE", status: "connected" },
                { resource: "Complaints", endpoint: "/api/Complaints", methods: "GET, DELETE", status: "connected" },
                { resource: "Services", endpoint: "/api/services", methods: "GET, POST, PUT, DELETE", status: "connected" },
              ].map((row) => (
                <tr key={row.resource} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.resource}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{row.endpoint}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{row.methods}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
