'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clientAuth } from '@/lib/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    if (clientAuth.isLoggedIn()) {
      // Redirect to admin forms if already authenticated
      router.push('/admin/forms')
    } else {
      // Redirect to login page
      router.push('/admin/login')
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Mini Form Builder
        </h1>
        <div className="text-gray-600">Redirecting...</div>
      </div>
    </div>
  )
}
