"use client"

import { useEffect, useState } from "react"
import { getRequests, updateRequest, deleteRequest } from "@/actions/requests"
import AdminNav from "@/components/admin/AdminNav"
import { Loader2, Trash2, Eye, EyeOff, StickyNote } from "lucide-react"

interface Request {
  id: string
  name: string
  email: string
  company: string | null
  service_interest: string | null
  message: string
  status: string
  is_read: boolean
  admin_note: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  nueva: "bg-blue-100 text-blue-700",
  en_revision: "bg-yellow-100 text-yellow-700",
  respondida: "bg-green-100 text-green-700",
  cerrada: "bg-gray-100 text-gray-600",
}

const statusLabels: Record<string, string> = {
  nueva: "Nueva",
  en_revision: "En revisión",
  respondida: "Respondida",
  cerrada: "Cerrada",
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [noteModal, setNoteModal] = useState<{ id: string; note: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function loadRequests() {
    try {
      const data = await getRequests()
      setRequests(data as Request[])
    } catch {
      // error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRequests() }, [])

  async function handleStatusChange(id: string, status: 'nueva' | 'en_revision' | 'respondida' | 'cerrada') {
    await updateRequest(id, { status })
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    )
  }

  async function handleToggleRead(id: string, current: boolean) {
    await updateRequest(id, { is_read: !current })
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, is_read: !current } : r))
    )
  }

  async function handleSaveNote(id: string, note: string) {
    await updateRequest(id, { admin_note: note })
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, admin_note: note } : r))
    )
    setNoteModal(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta solicitud? Esta acción no se puede deshacer.")) return
    await deleteRequest(id)
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-brand-navy">Solicitudes de contacto</h1>

        {loading && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando...
          </div>
        )}

        {!loading && requests.length === 0 && (
          <p className="text-gray-400">No hay solicitudes todavía.</p>
        )}

        {!loading && requests.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Fecha</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Nombre</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Correo</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Empresa</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Servicio</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map(req => (
                  <>
                    <tr
                      key={req.id}
                      className={`cursor-pointer hover:bg-gray-50 ${!req.is_read ? "bg-blue-50/30" : ""}`}
                      onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        {new Date(req.created_at).toLocaleDateString("es-CO")}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {!req.is_read && (
                          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-brand-green" />
                        )}
                        {req.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{req.email}</td>
                      <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                        {req.company || "—"}
                      </td>
                      <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                        {req.service_interest || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={req.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleStatusChange(req.id, e.target.value as 'nueva' | 'en_revision' | 'respondida' | 'cerrada')}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[req.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleRead(req.id, req.is_read)}
                            title={req.is_read ? "Marcar como no leída" : "Marcar como leída"}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          >
                            {req.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => setNoteModal({ id: req.id, note: req.admin_note ?? "" })}
                            title="Nota del admin"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          >
                            <StickyNote className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(req.id)}
                            title="Eliminar"
                            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === req.id && (
                      <tr key={`${req.id}-detail`}>
                        <td colSpan={7} className="bg-gray-50 px-6 py-4">
                          <p className="mb-2 text-sm font-medium text-gray-700">Mensaje:</p>
                          <p className="whitespace-pre-wrap text-sm text-gray-600">{req.message}</p>
                          {req.admin_note && (
                            <>
                              <p className="mb-1 mt-3 text-sm font-medium text-gray-700">
                                Nota del admin:
                              </p>
                              <p className="text-sm text-gray-500">{req.admin_note}</p>
                            </>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de nota */}
        {noteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-brand-navy">Nota del admin</h3>
              <textarea
                rows={4}
                value={noteModal.note}
                onChange={e => setNoteModal({ ...noteModal, note: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
                placeholder="Escribe una nota interna..."
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setNoteModal(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveNote(noteModal.id, noteModal.note)}
                  className="rounded-md bg-brand-green px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-dark"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
