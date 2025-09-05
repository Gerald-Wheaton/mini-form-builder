'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { FormStructure, FormField } from '@/lib/types'

export interface UserFormDisplayProps {
  formData: FormStructure
  onSubmit?: (submissionData: Record<string, string | number>) => void
  isSubmitting?: boolean
}

export function UserFormDisplay({
  formData,
  onSubmit,
  isSubmitting = false,
}: UserFormDisplayProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string | number>>(
    {},
  )

  const handleInputChange = (fieldId: string, value: string | number) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (onSubmit) {
      await onSubmit(formValues)
    } else {
      // Default behavior for demo/preview
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  const renderField = (field: FormField) => {
    const fieldValue = formValues[field.id] || ''

    if (field.type === 'textarea') {
      return (
        <Textarea
          id={field.id}
          name={field.id}
          value={fieldValue}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          placeholder={
            field.placeholder || `Enter ${field.label.toLowerCase()}`
          }
          className="resize-none h-24 border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          required={field.required}
        />
      )
    }

    return (
      <Input
        id={field.id}
        name={field.id}
        type={field.type === 'phone' ? 'tel' : field.type}
        value={fieldValue}
        onChange={(e) => {
          const value =
            field.type === 'number' ? Number(e.target.value) : e.target.value
          handleInputChange(field.id, value)
        }}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
        className="h-11 border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        required={field.required}
      />
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12 space-y-4">
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
          <h2 className="text-2xl font-bold text-green-600">Form Submitted!</h2>
          <p className="text-muted-foreground">
            Thank you for your submission. We'll get back to you soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-balance leading-tight">
            {formData.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Please fill out all required fields marked with *
          </p>
        </div>

        {formData.sections.map((section, index) => (
          <Card key={section.id} className="bg-card shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold">{section.name}</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium text-foreground flex items-center gap-1"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-destructive text-base">*</span>
                    )}
                  </label>
                  {field.description && (
                    <p className="text-xs text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                  {renderField(field)}
                  {field.type === 'email' && (
                    <p className="text-xs text-muted-foreground">
                      We'll never share your email address
                    </p>
                  )}
                  {field.type === 'phone' && (
                    <p className="text-xs text-muted-foreground">
                      Include country code if international
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full py-6 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              'Submit Form'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting this form, you agree to our terms of service and
            privacy policy.
          </p>
        </div>
      </form>
    </div>
  )
}
