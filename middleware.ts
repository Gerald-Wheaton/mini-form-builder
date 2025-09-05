import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateBasicAuth, ADMIN_AUTH_TOKEN } from '@/lib/auth'

// Define protected admin routes that require authentication
const protectedAdminRoutes = ['/admin/forms']

// Define API routes that require authentication
const protectedApiRoutes = ['/api/forms']

// Define routes that should bypass auth check (public routes)
const publicRoutes = ['/admin/login', '/public', '/', '/test-public-forms']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for Next.js internal paths and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') ||
    pathname.startsWith('/public/')
  ) {
    return NextResponse.next()
  }

  console.log('🔒 Middleware checking path:', pathname)

  // Check if the current path is explicitly public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })

  if (isPublicRoute) {
    console.log('✅ Public route, allowing access')
    return NextResponse.next()
  }

  // Check if the current path is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route),
  )

  if (isProtectedApiRoute) {
    console.log('🔐 Checking API authentication')
    const authHeader = request.headers.get('Authorization')

    if (!validateBasicAuth(authHeader)) {
      console.log('❌ API authentication failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ API authentication successful')
    return NextResponse.next()
  }

  // Check if the current path is a protected admin route
  const isProtectedAdminRoute = protectedAdminRoutes.some((route) =>
    pathname.startsWith(route),
  )

  if (isProtectedAdminRoute) {
    console.log('🔐 Checking admin authentication')

    // Check for auth cookie that our client-side auth sets
    const authCookie = request.cookies.get('admin-auth')
    const authToken = authCookie?.value

    // Validate the auth token
    if (!authToken || authToken !== ADMIN_AUTH_TOKEN) {
      console.log('❌ Admin authentication failed, redirecting to login')
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    console.log('✅ Admin authentication successful')
    return NextResponse.next()
  }

  // For all other routes, allow access
  console.log('✅ Unprotected route, allowing access')
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
