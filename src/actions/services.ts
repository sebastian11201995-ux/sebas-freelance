'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serviceSchema }     from '@/lib/validations/service'

const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL

async function verifyOwner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== OWNER_EMAIL) {
    console.warn('[Admin] Acceso no autorizado a services. Email:', user?.email ?? 'none')
    throw new Error('403: Acceso no autorizado')
  }
  return user
}

export async function getServices(includeInactive = false) {
  const supabase = includeInactive ? createAdminClient() : await createClient()
  const query = supabase.from('services').select('*').order('created_at')
  if (!includeInactive) query.eq('active', true)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function createService(input: unknown) {
  await verifyOwner()
  const parsed = serviceSchema.safeParse(input)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const supabase = createAdminClient()
  const { error } = await supabase.from('services').insert(parsed.data)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function updateService(id: string, input: unknown) {
  await verifyOwner()
  const parsed = serviceSchema.partial().safeParse(input)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const supabase = createAdminClient()
  const { error } = await supabase.from('services').update(parsed.data).eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function deleteService(id: string) {
  await verifyOwner()
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}
