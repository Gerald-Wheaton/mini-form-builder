'use client'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Eye,
  Save,
  Sparkles,
  Plus,
  AlertCircle,
  Monitor,
  Smartphone,
  Loader2,
} from 'lucide-react'
import { SectionCard } from './section-card'
import { PreviewForm } from './preview-form'
import { createForm, updateForm } from '@/lib/api'
import { validateFormBuilderConstraints } from '@/lib/form-utils'
import type { FormData, Section } from './types'

interface FormBuilderProps {
  initialFormData?: FormData
  formId?: string
  onSave?: (formData: FormData, formId?: string) => void
}

export function FormBuilder({
  initialFormData,
  formId,
  onSave,
}: FormBuilderProps = {}) {
  const [activeTab, setActiveTab] = useState('edit')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
    'desktop',
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>(
    initialFormData || {
      title: 'Untitled Form',
      sections: [
        {
          id: '1',
          name: 'Section 1',
          fields: [
            { id: '1', label: 'Field 1', type: 'text', required: false },
          ],
        },
      ],
    },
  )

  const validateForm = useCallback((data: FormData): string[] => {
    return validateFormBuilderConstraints(data)
  }, [])

  const updateFormTitle = (title: string) => {
    setFormData((prev) => ({ ...prev, title }))
    const newErrors = validationErrors.filter(
      (error) => !error.includes('Form title'),
    )
    setValidationErrors(newErrors)
  }

  const updateSectionName = (sectionId: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, name } : section,
      ),
    }))
    const newErrors = validationErrors.filter(
      (error) => !error.includes('Section') || !error.includes('name'),
    )
    setValidationErrors(newErrors)
  }

  const addSection = () => {
    if (formData.sections.length >= 2) {
      setValidationErrors(['Maximum of 2 sections allowed'])
      return
    }

    const newSection: Section = {
      id: Date.now().toString(),
      name: `Section ${formData.sections.length + 1}`,
      fields: [
        {
          id: Date.now().toString(),
          label: 'Field 1',
          type: 'text',
          required: false,
        },
      ],
    }

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
    setValidationErrors([])
  }

  const removeSection = (sectionId: string) => {
    if (formData.sections.length <= 1) {
      setValidationErrors(['At least one section is required'])
      return
    }

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
    setValidationErrors([])
  }

  const handleManualSave = async () => {
    const errors = validateForm(formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSaving(true)
    setValidationErrors([])
    setSaveSuccess(false)

    try {
      let result
      if (formId) {
        // Update existing form
        result = await updateForm(formId, formData)
      } else {
        // Create new form
        result = await createForm(formData)
      }

      if (result.success) {
        setSaveSuccess(true)
        onSave?.(formData, result.data?.id || formId)

        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setValidationErrors([
          result.error || 'Failed to save form',
          ...(result.details || []),
        ])
      }
    } catch (error) {
      console.error('Save error:', error)
      setValidationErrors(['An unexpected error occurred while saving'])
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid w-48 grid-cols-2 order-2 md:order-1">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center justify-between md:justify-end gap-3 order-1 md:order-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Generate with AI</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>
                  <Button
                    onClick={handleManualSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>

                {activeTab === 'preview' && (
                  <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className="h-8 px-3"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className="h-8 px-3"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="edit" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormTitle(e.target.value)}
                  className={`text-2xl font-bold border-none px-0 focus-visible:ring-0 bg-transparent focus-visible:border-primary/50 ${
                    validationErrors.some((error) =>
                      error.includes('Form title'),
                    )
                      ? 'text-destructive'
                      : ''
                  }`}
                  placeholder="Untitled Form"
                />
                {formData.title.trim() === 'Untitled Form' && (
                  <p className="text-xs text-muted-foreground">
                    Give your form a descriptive title
                  </p>
                )}
              </div>

              {saveSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Form saved successfully!{' '}
                    {formId
                      ? 'Changes have been updated.'
                      : 'Your new form has been created.'}
                  </AlertDescription>
                </Alert>
              )}

              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {formData.sections.map((section, sectionIndex) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    sectionIndex={sectionIndex}
                    totalSections={formData.sections.length}
                    onUpdateName={(name) => updateSectionName(section.id, name)}
                    onRemove={() => removeSection(section.id)}
                    formData={formData}
                    setFormData={setFormData}
                    setValidationErrors={setValidationErrors}
                    validationErrors={validationErrors}
                  />
                ))}

                <Card
                  className={`border-2 border-dashed transition-colors ${
                    formData.sections.length >= 2
                      ? 'border-muted bg-muted/20 cursor-not-allowed'
                      : 'border-primary/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (formData.sections.length < 2) {
                      addSection()
                    }
                  }}
                >
                  <CardContent className="p-0">
                    <div
                      className={`w-full h-full py-8 flex flex-col items-center gap-2 ${
                        formData.sections.length >= 2
                          ? 'opacity-50'
                          : 'text-primary'
                      }`}
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        {formData.sections.length >= 2
                          ? 'Maximum sections reached (2/2)'
                          : `Add Section (${formData.sections.length}/2)`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-0">
            <PreviewForm formData={formData} previewMode={previewMode} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
