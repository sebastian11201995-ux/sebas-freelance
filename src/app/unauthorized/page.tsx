import { ShieldOff } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <ShieldOff className="mb-4 h-16 w-16 text-red-400" />
      <h1 className="mb-2 text-2xl font-bold text-brand-navy">Acceso denegado</h1>
      <p className="mb-6 text-center text-gray-500">
        No tienes permiso para acceder a este panel. Solo el propietario puede ingresar.
      </p>
      <a
        href="/"
        className="rounded-md bg-brand-green px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-green-dark transition-colors"
      >
        Volver al inicio
      </a>
    </div>
  )
}
