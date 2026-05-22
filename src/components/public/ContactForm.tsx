"use client"

import { useState } from "react"
import { contactSchema, type ContactFormData } from "@/lib/validations/contact"
import { submitContact } from "@/actions/contact"
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface ContactFormProps {
  services: { id: string; name: string }[]
  preselectedService?: string
}

export default function ContactForm({ services, preselectedService }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    service_interest: preselectedService ?? "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [serverError, setServerError] = useState("")

  function validateField(field: keyof ContactFormData) {
    const result = contactSchema.shape[field].safeParse(form[field])
    if (!result.success) {
      setErrors(prev => ({ ...prev, [field]: result.error.issues[0].message }))
    } else {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleChange(field: keyof ContactFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      const result = contactSchema.shape[field].safeParse(value)
      if (result.success) {
        setErrors(prev => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError("")

    const parsed = contactSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      parsed.error.issues.forEach(err => {
        const field = err.path[0] as keyof ContactFormData
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setStatus("loading")
    const result = await submitContact(parsed.data)

    if (result.success) {
      setStatus("success")
      setForm({ name: "", email: "", company: "", service_interest: "", message: "" })
      setErrors({})
    } else {
      setStatus("error")
      setServerError(result.error ?? "Error desconocido")
    }
  }

  if (status === "success") {
    return (
      <div style={{
        padding: "2.5rem",
        textAlign: "center",
        border: "1px solid rgba(216,170,93,.3)",
        borderRadius: 20,
        background: "rgba(216,170,93,.08)",
      }}>
        <CheckCircle style={{ margin: "0 auto 16px", color: "var(--lux-gold-strong)" }} size={48} />
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", margin: "0 0 8px" }}>
          ¡Mensaje enviado!
        </h3>
        <p style={{ color: "var(--lux-muted)", lineHeight: 1.6 }}>
          Gracias por contactarme. Te responderé en menos de 24 horas.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="lux-submit-btn"
          style={{ marginTop: 20 }}
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="lux-form" style={{ display: "grid", gap: 20 }}>
      {status === "error" && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 14,
          border: "1px solid rgba(239,68,68,.4)",
          borderRadius: 14,
          background: "rgba(239,68,68,.1)",
          color: "#fca5a5",
          fontSize: ".88rem",
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          {serverError}
        </div>
      )}

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label htmlFor="name">Nombre *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            onBlur={() => validateField("name")}
            className={errors.name ? "field-error" : ""}
            placeholder="Tu nombre completo"
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email">Correo electrónico *</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={e => handleChange("email", e.target.value)}
            onBlur={() => validateField("email")}
            className={errors.email ? "field-error" : ""}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label htmlFor="company">Empresa</label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={e => handleChange("company", e.target.value)}
            onBlur={() => validateField("company")}
            placeholder="Nombre de tu empresa (opcional)"
          />
        </div>

        <div>
          <label htmlFor="service">Servicio de interés</label>
          <select
            id="service"
            value={form.service_interest}
            onChange={e => handleChange("service_interest", e.target.value)}
          >
            <option value="">Selecciona un servicio</option>
            {services.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message">Mensaje *</label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={e => handleChange("message", e.target.value)}
          onBlur={() => validateField("message")}
          className={errors.message ? "field-error" : ""}
          placeholder="Cuéntame sobre tu proyecto o necesidad (mínimo 20 caracteres)"
          style={{ resize: "vertical" }}
        />
        {errors.message && <p className="error-msg">{errors.message}</p>}
      </div>

      <button type="submit" disabled={status === "loading"} className="lux-submit-btn">
        {status === "loading" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={18} />
            Enviar mensaje
          </>
        )}
      </button>
    </form>
  )
}
