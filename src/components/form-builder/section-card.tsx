'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, AlertTriangle } from 'lucide-react'
import { FieldRow } from './field-row'
import type { Section, Field, FormData } from './types'

interface SectionCardProps {
  section: Section
  sectionIndex: number
  totalSections: number
  onUpdateName: (name: string) => void
  onRemove: () => void
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  setValidationErrors: (errors: string[]) => void
  validationErrors: string[]
}

export function SectionCard({
  section,
  sectionIndex,
  totalSections,
  onUpdateName,
  onRemove,
  formData,
  setFormData,
  setValidationErrors,
  validationErrors,
}: SectionCardProps) {
  const addField = () => {
    if (section.fields.length >= 3) {
      setValidationErrors([
        `Section "${section.name}" already has the maximum of 3 fields`,
      ])
      return
    }

    const newField: Field = {
      id: Date.now().toString(),
      label: `Field ${section.fields.length + 1}`,
      type: 'text',
      required: false,
    }

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === section.id ? { ...s, fields: [...s.fields, newField] } : s,
      ),
    }))
    setValidationErrors([])
  }

  const removeField = (fieldId: string) => {
    if (section.fields.length <= 1) {
      setValidationErrors([
        `Section "${section.name}" must have at least one field`,
      ])
      return
    }

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === section.id
          ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
          : s,
      ),
    }))
    setValidationErrors([])
  }

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === section.id
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.id === fieldId ? { ...f, ...updates } : f,
              ),
            }
          : s,
      ),
    }))
    const newErrors = validationErrors.filter(
      (error) => !error.includes('Field') || !error.includes(section.name),
    )
    setValidationErrors(newErrors)
  }

  const hasValidationError = validationErrors.some(
    (error) =>
      error.includes(`Section ${sectionIndex + 1}`) ||
      error.includes(`"${section.name}"`),
  )

  return (
    <Card
      className={`bg-card border-2 shadow-sm hover:shadow-md transition-shadow ${
        hasValidationError ? 'border-destructive/50' : ''
      }`}
    >
      <CardHeader className="pb-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Input
              value={section.name}
              onChange={(e) => onUpdateName(e.target.value)}
              className={`text-lg font-semibold border-none px-0 focus-visible:ring-0 bg-transparent focus-visible:border-primary/50 ${
                hasValidationError ? 'text-destructive' : ''
              }`}
              placeholder="Section name"
            />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Section {sectionIndex + 1} of {totalSections}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {section.fields.length} field
                {section.fields.length !== 1 ? 's' : ''}
              </Badge>
              {hasValidationError && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={onRemove}
            variant="ghost"
            size="sm"
            disabled={totalSections <= 1}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {section.fields.map((field, fieldIndex) => (
          <FieldRow
            key={field.id}
            field={field}
            fieldIndex={fieldIndex}
            totalFields={section.fields.length}
            onUpdate={(updates) => updateField(field.id, updates)}
            onRemove={() => removeField(field.id)}
            hasValidationError={validationErrors.some(
              (error) =>
                error.includes(`Field ${fieldIndex + 1}`) &&
                error.includes(section.name),
            )}
          />
        ))}

        <Button
          onClick={addField}
          disabled={section.fields.length >= 3}
          variant="outline"
          size="sm"
          className="w-full border-dashed hover:bg-primary/15 hover:border-primary/50 hover:text-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          {section.fields.length >= 3
            ? 'Maximum fields reached (3/3)'
            : `Add Field (${section.fields.length}/3)`}
        </Button>
      </CardContent>
    </Card>
  )
}
