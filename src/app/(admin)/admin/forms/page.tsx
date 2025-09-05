'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ExternalLink, Eye, Calendar } from 'lucide-react'
import { createBasicAuthHeader, clientAuth } from '@/lib/auth'

interface FormListItem {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  publicId: string
  submissionCount: number
  publicUrl: string
}

export default function FormsListPage() {
  const [forms, setForms] = useState<FormListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    if (!clientAuth.isLoggedIn()) {
      window.location.href = '/admin/login'
      return
    }

    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/forms', {
        headers: {
          Authorization: createBasicAuthHeader(),
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          clientAuth.logout()
          window.location.href = '/admin/login'
          return
        }
        throw new Error('Failed to fetch forms')
      }

      const data = await response.json()
      setForms(data.forms)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clientAuth.logout()
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button onClick={fetchForms}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Forms Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your forms and view submissions
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
          <Button asChild>
            <Link href="/admin/forms/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Link>
          </Button>
        </div>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No forms created yet
            </div>
            <Button asChild>
              <Link href="/admin/forms/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Form
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate" title={form.title}>
                    {form.title}
                  </CardTitle>
                  <Badge variant="secondary">
                    {form.submissionCount} submissions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timestamps */}
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    {form.updatedAt !== form.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Updated: {new Date(form.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/admin/forms/${form.id}`}>
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={form.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                  </div>

                  {/* Public URL */}
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium mb-1">Public URL:</div>
                    <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                      {window.location.origin}
                      {form.publicUrl}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
