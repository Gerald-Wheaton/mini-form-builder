'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import { createBasicAuthHeader, clientAuth } from '@/lib/auth'
import { FORM_CONSTRAINTS, type FormSection, type FormField } from '@/lib/types'

export default function NewFormPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: uuidv4(),
      title: '',
      fields: []
    }
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    if (!clientAuth.isLoggedIn()) {
      window.location.href = '/admin/login'
      return
    }
  }, [])

  const addSection = () => {
    if (sections.length >= FORM_CONSTRAINTS.MAX_SECTIONS) return
    
    setSections([...sections, {
      id: uuidv4(),
      title: '',
      fields: []
    }])
  }

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId))
  }

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, title: newTitle } : s
    ))
  }

  const addField = (sectionId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId && s.fields.length < FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION) {
        return {
          ...s,
          fields: [...s.fields, {
            id: uuidv4(),
            label: '',
            type: 'text',
            required: false
          }]
        }
      }
      return s
    }))
  }

  const removeField = (sectionId: string, fieldId: string) => {
    setSections(sections.map(s => ({
      ...s,
      fields: s.fields.filter(f => f.id !== fieldId)
    })))
  }

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    setSections(sections.map(s => ({
      ...s,
      fields: s.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    })))
  }

  const validateForm = () => {
    if (!title.trim()) {
      setError('Form title is required')
      return false
    }

    if (sections.length === 0) {
      setError('Form must have at least one section')
      return false
    }

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (!section.title.trim()) {
        setError(`Section ${i + 1} title is required`)
        return false
      }
      
      if (section.fields.length === 0) {
        setError(`Section "${section.title}" must have at least one field`)
        return false
      }

      for (let j = 0; j < section.fields.length; j++) {
        const field = section.fields[j]
        if (!field.label.trim()) {
          setError(`Field ${j + 1} in section "${section.title}" must have a label`)
          return false
        }
      }
    }

    return true
  }

  const handleSave = async () => {
    setError(null)
    
    if (!validateForm()) return

    try {
      setSaving(true)
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Authorization': createBasicAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          sections
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          clientAuth.logout()
          window.location.href = '/admin/login'
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create form')
      }

      router.push('/admin/forms')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/forms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Form</h1>
          <p className="text-muted-foreground">
            Build a form with up to {FORM_CONSTRAINTS.MAX_SECTIONS} sections and {FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION} fields per section
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Form Title */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title..."
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Section {sectionIndex + 1}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({section.fields.length}/{FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION} fields)
                  </span>
                </CardTitle>
                {sections.length > 1 && (
                  <Button
                    onClick={() => removeSection(section.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Section Title */}
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={section.title}
                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                  placeholder="Enter section title..."
                />
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Fields</Label>
                  <Button
                    onClick={() => addField(section.id)}
                    disabled={section.fields.length >= FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>

                {section.fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No fields yet. Add a field to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">Field {fieldIndex + 1}</h4>
                          <Button
                            onClick={() => removeField(section.id, field.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                              placeholder="Field label..."
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <select
                              value={field.type}
                              onChange={(e) => updateField(section.id, field.id, { type: e.target.value as 'text' | 'number' })}
                              className="w-full px-3 py-2 border rounded-md"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Required</Label>
                            <div className="flex items-center space-x-2 pt-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                                className="rounded"
                              />
                              <span className="text-sm">Required field</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Section Button */}
        <div className="text-center">
          <Button
            onClick={addSection}
            disabled={sections.length >= FORM_CONSTRAINTS.MAX_SECTIONS}
            variant="outline"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Section ({sections.length}/{FORM_CONSTRAINTS.MAX_SECTIONS})
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Creating...' : 'Create Form'}
        </Button>
      </div>
    </div>
  )
}
