'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z }                 from 'zod'

const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL

async function verifyOwner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== OWNER_EMAIL) {
    console.warn('[Admin] Intento de acceso no autorizado. Email:', user?.email ?? 'none')
    throw new Error('403: Acceso no autorizado')
  }

  return user
}

export async function getRequests() {
  await verifyOwner()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function updateRequest(id: string, updates: {
  status?: 'nueva' | 'en_revision' | 'respondida' | 'cerrada'
  is_read?: boolean
  admin_note?: string
}) {
  await verifyOwner()

  const schema = z.object({
    status:     z.enum(['nueva','en_revision','respondida','cerrada']).optional(),
    is_read:    z.boolean().optional(),
    admin_note: z.string().max(2000).optional(),
  })

  const parsed = schema.safeParse(updates)
  if (!parsed.success) throw new Error('Datos inválidos')

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('contact_requests')
    .update(parsed.data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function deleteRequest(id: string) {
  await verifyOwner()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('contact_requests')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function getStats() {
  await verifyOwner()
  const supabase = createAdminClient()

  const { data, count: total } = await supabase
    .from('contact_requests')
    .select('*', { count: 'exact' })

  const unread = data?.filter(r => !r.is_read).length ?? 0
  const byService: Record<string, number> = {}
  data?.forEach(r => {
    const s = r.service_interest || 'Sin especificar'
    byService[s] = (byService[s] ?? 0) + 1
  })

  return { total: total ?? 0, unread, byService }
}
