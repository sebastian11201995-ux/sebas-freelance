"use client"

import { useEffect, useState } from "react"
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/actions/services"
import AdminNav from "@/components/admin/AdminNav"
import { formatCOP } from "@/lib/utils"
import { Loader2, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price_from: number
  icon: string
  active: boolean
}

const emptyForm = { name: "", description: "", price_from: 0, icon: "briefcase", active: true }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function loadServices() {
    try {
      const data = await getServices(true)
      setServices(data as Service[])
    } catch {
      // error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadServices() }, [])

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError("")
  }

  function openEdit(service: Service) {
    setForm({
      name: service.name,
      description: service.description,
      price_from: service.price_from,
      icon: service.icon,
      active: service.active,
    })
    setEditingId(service.id)
    setShowForm(true)
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      if (editingId) {
        await updateService(editingId, form)
      } else {
        await createService(form)
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      await loadServices()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(id: string, current: boolean) {
    await updateService(id, { active: !current })
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !current } : s))
    )
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio? Esta acción no se puede deshacer.")) return
    await deleteService(id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-navy">Servicios</h1>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-green px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo servicio
          </button>
        </div>

        {/* Formulario modal */}
        {showForm && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-brand-navy">
              {editingId ? "Editar servicio" : "Nuevo servicio"}
            </h2>

            {error && (
              <p className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Precio desde (COP)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price_from}
                    onChange={e => setForm(f => ({ ...f, price_from: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ícono (lucide-react)
                  </label>
                  <input
                    value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
                    placeholder="briefcase"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                    />
                    Servicio activo
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-green px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-dark disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Guardar cambios" : "Crear servicio"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null) }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando servicios...
          </div>
        )}

        {!loading && services.length === 0 && (
          <p className="text-gray-400">No hay servicios registrados.</p>
        )}

        {!loading && services.length > 0 && (
          <div className="space-y-3">
            {services.map(service => (
              <div
                key={service.id}
                className={`flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                  service.active ? "border-gray-200" : "border-dashed border-gray-300 opacity-60"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-brand-navy">{service.name}</h3>
                    {!service.active && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                  <p className="mt-1 text-sm font-medium text-brand-green">
                    Desde {formatCOP(service.price_from)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(service.id, service.active)}
                    title={service.active ? "Desactivar" : "Activar"}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    {service.active ? (
                      <ToggleRight className="h-5 w-5 text-brand-green" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(service)}
                    title="Editar"
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    title="Eliminar"
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
