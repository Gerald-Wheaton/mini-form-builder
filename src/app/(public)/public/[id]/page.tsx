'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import type { FormStructure } from '@/lib/types'
import { UserFormDisplay } from '@/components/user-form-display/user-form-display'
import { getFormByPublicId, submitFormData } from './action'

interface PublicFormPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PublicFormPage({ params }: PublicFormPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [formStructure, setFormStructure] = useState<FormStructure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    fetchForm()
  }, [resolvedParams.id])

  const fetchForm = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch form structure via server action using public ID
      const structure = await getFormByPublicId(resolvedParams.id)

      if (!structure) {
        setError('Form not found or no longer available')
        return
      }

      setFormStructure(structure)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (
    submissionData: Record<string, string | number>,
  ) => {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitFormData(resolvedParams.id, submissionData)

      if (result.success) {
        setSubmitted(true)
      } else {
        setSubmitError(result.error || 'Failed to submit form')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError('An unexpected error occurred while submitting the form')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error && !formStructure) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Form Not Found</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-green-600">
              Form Submitted Successfully!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your submission. We'll get back to you soon.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Error Alert */}
        {submitError && (
          <div className="max-w-2xl mx-auto mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Form Display */}
        {formStructure && (
          <UserFormDisplay
            formData={formStructure}
            onSubmit={handleFormSubmit}
            isSubmitting={submitting}
          />
        )}
      </div>
    </div>
  )
}
