'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Monitor, Smartphone, ExternalLink } from 'lucide-react'
import type { FormData } from './types'

interface PreviewFormProps {
  formData: FormData
  previewMode: 'desktop' | 'mobile'
}

export function PreviewForm({ formData, previewMode }: PreviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {previewMode === 'desktop' ? (
                <Monitor className="w-4 h-4 text-primary" />
              ) : (
                <Smartphone className="w-4 h-4 text-primary" />
              )}
              <p className="text-sm text-primary font-medium">
                Preview Mode — Interactive demo
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-transparent"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in new tab
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`mx-auto transition-all duration-300 ${
          previewMode === 'mobile'
            ? 'max-w-sm border-2 border-border rounded-2xl p-4 bg-background shadow-xl'
            : 'max-w-2xl'
        }`}
      >
        {isSubmitted ? (
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
            <h2 className="text-2xl font-bold text-green-600">
              Form Submitted!
            </h2>
            <p className="text-muted-foreground">
              Thank you for your submission. We'll get back to you soon.
            </p>
          </div>
        ) : (
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
              <Card
                key={section.id}
                className="bg-card shadow-sm border-border/50"
              >
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
                      <label className="text-sm font-medium text-foreground flex items-center gap-1">
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
                      {field.type === 'textarea' ? (
                        <textarea
                          placeholder={
                            field.placeholder ||
                            `Enter ${field.label.toLowerCase()}`
                          }
                          className="w-full px-3 py-3 border border-primary/30 bg-background rounded-md resize-none h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          required={field.required}
                        />
                      ) : (
                        <Input
                          type={field.type === 'phone' ? 'tel' : field.type}
                          placeholder={
                            field.placeholder ||
                            `Enter ${field.label.toLowerCase()}`
                          }
                          className="h-11 border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          required={field.required}
                        />
                      )}
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
        )}
      </div>
    </div>
  )
}
