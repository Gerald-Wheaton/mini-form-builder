import type { FormData, Section, Field } from '@/components/form-builder/types'
import type { FormStructure, FormSection, FormField } from './types'

/**
 * Convert form builder data to backend format
 */
export function formBuilderToBackend(formBuilderData: FormData): FormStructure {
  return {
    title: formBuilderData.title,
    sections: formBuilderData.sections.map(
      (section): FormSection => ({
        id: section.id,
        name: section.name,
        fields: section.fields.map(
          (field): FormField => ({
            id: field.id,
            label: field.label,
            description: field.description,
            type: field.type,
            placeholder: field.placeholder,
            required: field.required,
          }),
        ),
      }),
    ),
  }
}

/**
 * Convert backend data to form builder format
 */
export function backendToFormBuilder(backendData: FormStructure): FormData {
  return {
    title: backendData.title,
    sections: backendData.sections.map(
      (section): Section => ({
        id: section.id,
        name: section.name,
        fields: section.fields.map(
          (field): Field => ({
            id: field.id,
            label: field.label,
            description: field.description,
            type: field.type,
            placeholder: field.placeholder,
            required: field.required,
          }),
        ),
      }),
    ),
  }
}

/**
 * Validate that form builder data matches backend constraints
 */
export function validateFormBuilderConstraints(formData: FormData): string[] {
  const errors: string[] = []

  // Check form title
  if (!formData.title.trim() || formData.title.trim() === 'Untitled Form') {
    errors.push('Form title is required')
  }

  // Check section constraints
  if (formData.sections.length === 0) {
    errors.push('Form must have at least one section')
  }

  if (formData.sections.length > 2) {
    errors.push('Form cannot have more than 2 sections')
  }

  formData.sections.forEach((section, sectionIndex) => {
    // Check section name
    if (!section.name.trim()) {
      errors.push(`Section ${sectionIndex + 1} name is required`)
    }

    // Check duplicate section names
    const duplicateSections = formData.sections.filter(
      (s) => s.name.trim() === section.name.trim(),
    )
    if (duplicateSections.length > 1) {
      errors.push(`Section name "${section.name}" is used multiple times`)
    }

    // Check field constraints
    if (section.fields.length === 0) {
      errors.push(`Section "${section.name}" must have at least one field`)
    }

    if (section.fields.length > 3) {
      errors.push(`Section "${section.name}" cannot have more than 3 fields`)
    }

    section.fields.forEach((field, fieldIndex) => {
      // Check field label
      if (!field.label.trim()) {
        errors.push(
          `Field ${fieldIndex + 1} in "${section.name}" needs a label`,
        )
      }

      // Check duplicate field labels within section
      const duplicateFields = section.fields.filter(
        (f) => f.label.trim() === field.label.trim(),
      )
      if (duplicateFields.length > 1) {
        errors.push(
          `Field label "${field.label}" is used multiple times in "${section.name}"`,
        )
      }
    })
  })

  return errors
}

/**
 * Generate a unique ID for form elements
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * Create a default form structure
 */
export function createDefaultForm(): FormData {
  return {
    title: 'Untitled Form',
    sections: [
      {
        id: generateId(),
        name: 'Section 1',
        fields: [
          {
            id: generateId(),
            label: 'Field 1',
            type: 'text',
            required: false,
          },
        ],
      },
    ],
  }
}
