"use client"

import { useEffect, useState } from "react"
import { getStats } from "@/actions/requests"
import AdminNav from "@/components/admin/AdminNav"
import { Inbox, Eye, TrendingUp, Loader2 } from "lucide-react"

interface Stats {
  total: number
  unread: number
  byService: Record<string, number>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Error al cargar estadísticas"))
  }, [])

  const topService = stats
    ? Object.entries(stats.byService).sort((a, b) => b[1] - a[1])[0]
    : null

  const maxCount = stats
    ? Math.max(...Object.values(stats.byService), 1)
    : 1

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-brand-navy">Dashboard</h1>

        {error && <p className="text-red-500">{error}</p>}

        {!stats && !error && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando estadísticas...
          </div>
        )}

        {stats && (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Inbox className="h-4 w-4" />
                  Total solicitudes
                </div>
                <p className="text-3xl font-bold text-brand-navy">{stats.total}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  Sin leer
                </div>
                <p className="text-3xl font-bold text-brand-green">{stats.unread}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4" />
                  Más solicitado
                </div>
                <p className="text-lg font-bold text-brand-navy">
                  {topService ? topService[0] : "—"}
                </p>
                {topService && (
                  <p className="text-sm text-gray-400">{topService[1]} solicitudes</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-brand-navy">
                Solicitudes por servicio
              </h2>
              {Object.keys(stats.byService).length === 0 ? (
                <p className="text-sm text-gray-400">Aún no hay solicitudes.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.byService)
                    .sort((a, b) => b[1] - a[1])
                    .map(([service, count]) => (
                      <div key={service}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-700">{service}</span>
                          <span className="font-medium text-brand-navy">{count}</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-100">
                          <div
                            className="h-3 rounded-full bg-brand-green transition-all"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <a
                href="/admin/requests"
                className="rounded-md bg-brand-green px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-dark transition-colors"
              >
                Ver solicitudes
              </a>
              <a
                href="/admin/services"
                className="rounded-md border border-brand-navy px-4 py-2 text-sm font-medium text-brand-navy hover:bg-brand-navy-lt transition-colors"
              >
                Gestionar servicios
              </a>
            </div>
          </>
        )}
      </main>
    </>
  )
}
