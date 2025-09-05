// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'password123'

// Base64 encoded "admin:password123"
export const ADMIN_AUTH_TOKEN = 'YWRtaW46cGFzc3dvcmQxMjM='

/**
 * @param authHeader - The Authorization header value (e.g., "Basic YWRtaW46cGFzc3dvcmQxMjM=")
 * @returns true if valid admin credentials, false otherwise
 */
export function validateBasicAuth(authHeader: string | null): boolean {
  if (!authHeader) {
    return false
  }

  const basicPrefix = 'Basic '
  if (!authHeader.startsWith(basicPrefix)) {
    return false
  }

  const token = authHeader.slice(basicPrefix.length)

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [username, password] = decoded.split(':')

    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
  } catch {
    return false
  }
}

/**
 * @returns Authorization header value
 */
export function createBasicAuthHeader(): string {
  return `Basic ${ADMIN_AUTH_TOKEN}`
}

/**
 * @param request - Request object with headers
 * @returns true if valid admin auth, false otherwise
 */
export function validateRequestAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return validateBasicAuth(authHeader)
}

/**
 * Creates an unauthorized response
 * @param message - Optional error message
 * @returns Response with 401 status
 */
export function createUnauthorizedResponse(message = 'Unauthorized'): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Basic realm="Admin"',
    },
  })
}

/**
 * Set HTTP-only auth cookie (for middleware)
 */
function setAuthCookie(value: string) {
  if (typeof document !== 'undefined') {
    // Set cookie that middleware can read
    document.cookie = `admin-auth=${value}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Lax`
  }
}

/**
 * Clear HTTP-only auth cookie
 */
function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie =
      'admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

/**
 * Validates credentials on the client side
 * @param username - The entered username
 * @param password - The entered password
 * @returns true if credentials are valid, false otherwise
 */
export function validateCredentials(
  username: string,
  password: string,
): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export const clientAuth = {
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('isAdmin') === 'true'
  },

  login(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAdmin', 'true')
      setAuthCookie(ADMIN_AUTH_TOKEN)
    }
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdmin')
      clearAuthCookie()
    }
  },
}
