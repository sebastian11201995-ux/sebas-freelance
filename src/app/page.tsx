import { createClient } from "@/lib/supabase/server"
import LuxuryLanding from "@/components/public/LuxuryLanding"

export default async function HomePage() {
  let services: {
    id: string
    name: string
    description: string
    price_from: number
    icon: string
  }[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("services")
      .select("id, name, description, price_from, icon")
      .eq("active", true)
      .order("created_at")
    if (data) services = data
  } catch {
    // Supabase no disponible — landing sin servicios dinámicos
  }

  return <LuxuryLanding services={services} />
}
