'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { contactSchema } from '@/lib/validations/contact'
import { headers } from 'next/headers'
import crypto from 'crypto'

const RATE_LIMIT_MAX    = 3
const RATE_LIMIT_WINDOW = 10

function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim()
}

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'sebas-salt-2025').digest('hex').slice(0, 16)
}

export async function submitContact(formData: unknown) {
  const parsed = contactSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? '0.0.0.0'
  const ipHash = hashIp(ip)

  const supabaseAdmin = createAdminClient()
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW * 60 * 1000).toISOString()

  const { count } = await supabaseAdmin
    .from('rate_limit_log')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart)

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return {
      success: false,
      error: `Has enviado demasiadas solicitudes. Espera ${RATE_LIMIT_WINDOW} minutos e intenta de nuevo.`
    }
  }

  await supabaseAdmin.from('rate_limit_log').insert({ ip_hash: ipHash })

  const clean = {
    name:             sanitize(data.name),
    email:            sanitize(data.email),
    company:          data.company ? sanitize(data.company) : null,
    service_interest: data.service_interest || null,
    message:          sanitize(data.message),
    ip_hash:          ipHash,
  }

  const { error } = await supabaseAdmin
    .from('contact_requests')
    .insert(clean)

  if (error) {
    console.error('[submitContact] Error Supabase:', error)
    return { success: false, error: 'Error al enviar. Intenta de nuevo.' }
  }

  return { success: true }
}
