import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL
  const { pathname } = request.nextUrl

  const isProtectedAdmin = pathname.startsWith('/admin/dashboard') ||
                           pathname.startsWith('/admin/requests') ||
                           pathname.startsWith('/admin/services')

  if (isProtectedAdmin) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (user.email !== ownerEmail) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
