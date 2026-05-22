import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      '[Supabase Admin] Falta SUPABASE_SERVICE_ROLE_KEY en .env.local\n' +
      'Obtener en: https://app.supabase.com → Settings → API → service_role key\n' +
      'ADVERTENCIA: Esta clave nunca debe exponerse al navegador.'
    )
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}
