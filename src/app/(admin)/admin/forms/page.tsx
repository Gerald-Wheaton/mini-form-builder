'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  ExternalLink,
  Eye,
  Calendar,
  Globe,
  Copy,
  Check,
} from 'lucide-react'
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
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null)

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

  const copyToClipboard = async (form: FormListItem) => {
    try {
      const fullUrl = `${window.location.origin}${form.publicUrl}`
      await navigator.clipboard.writeText(fullUrl)
      setCopiedFormId(form.id)

      setTimeout(() => {
        setCopiedFormId(null)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
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
    <div className="container mx-auto py-8 px-4">
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
                <div className="flex justify-between items-start gap-2 flex-wrap">
                  <CardTitle
                    className="text-lg flex-1 min-w-0"
                    title={form.title}
                  >
                    {form.title}
                  </CardTitle>
                  <Badge variant="secondary" className="flex-shrink-0">
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
                      <Link href={`${form.publicUrl}`}>
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                  </div>

                  {/* Public URL */}
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 font-medium mb-1">
                      <Globe className="h-3 w-3" />
                      Public URL:
                    </div>
                    <div
                      className="bg-muted p-2 rounded text-xs font-mono break-all cursor-pointer hover:bg-muted/80 transition-colors flex items-center justify-between group"
                      onClick={() => copyToClipboard(form)}
                      title="Click to copy URL"
                    >
                      <span className="flex-1">
                        {window.location.origin}
                        {form.publicUrl}
                      </span>
                      <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedFormId === form.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </div>
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
