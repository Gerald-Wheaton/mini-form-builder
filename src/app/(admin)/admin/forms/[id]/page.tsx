'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createBasicAuthHeader, clientAuth } from '@/lib/auth'
import { type FormSection, type ParsedForm } from '@/lib/types'

interface ViewFormPageProps {
  params: {
    id: string
  }
}

export default function ViewFormPage({ params }: ViewFormPageProps) {
  const router = useRouter()
  const [form, setForm] = useState<ParsedForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    if (!clientAuth.isLoggedIn()) {
      window.location.href = '/admin/login'
      return
    }

    fetchForm()
  }, [params.id])

  const fetchForm = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/forms/${params.id}`, {
        headers: {
          'Authorization': createBasicAuthHeader(),
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          clientAuth.logout()
          window.location.href = '/admin/login'
          return
        }
        if (response.status === 404) {
          setError('Form not found')
          return
        }
        throw new Error('Failed to fetch form')
      }

      const formData = await response.json()
      setForm(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch form')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading form...</div>
      </div>
    )
  }

  if (error && !form) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button asChild>
            <Link href="/admin/forms">Back to Forms</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forms
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">View Form</h1>
            <p className="text-muted-foreground">
              {form && (
                <>
                  Created {new Date(form.createdAt).toLocaleDateString()} • 
                  <Badge variant="secondary" className="ml-2">
                    {(form as any).submissionCount || 0} submissions
                  </Badge>
                </>
              )}
            </p>
          </div>
        </div>
        
        {form && (
          <Button asChild variant="outline">
            <Link 
              href={`/form/${form.publicId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Form
            </Link>
          </Button>
        )}
      </div>

      {form && (
        <>
          {/* Form Title */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{form.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Public URL: <code className="bg-muted px-2 py-1 rounded text-xs">/form/{form.publicId}</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-6">
            {form.sections.map((section: FormSection, sectionIndex: number) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Section {sectionIndex + 1}: {section.title}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({section.fields.length} fields)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {section.fields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No fields in this section.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={field.id} className="border rounded-lg p-4 bg-muted/20">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">Field {fieldIndex + 1}</h4>
                              <p className="text-base">{field.label}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">Type</h4>
                              <p className="text-base capitalize">{field.type}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">Required</h4>
                              <p className="text-base">{field.required ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">Field ID</h4>
                              <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{field.id}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form Metadata */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Form Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-muted-foreground">Form ID</h4>
                  <p className="font-mono bg-muted px-2 py-1 rounded">{form.id}</p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground">Public ID</h4>
                  <p className="font-mono bg-muted px-2 py-1 rounded">{form.publicId}</p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground">Created</h4>
                  <p>{new Date(form.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground">Last Updated</h4>
                  <p>{new Date(form.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}