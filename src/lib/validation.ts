import { z } from 'zod'
import { FORM_CONSTRAINTS } from './types'

export const fieldTypeSchema = z.enum([
  'text',
  'number',
  'email',
  'phone',
  'textarea',
])

export const formFieldSchema = z.object({
  id: z.string().min(1, 'Field ID is required'),
  label: z
    .string()
    .min(1, 'Field label is required')
    .max(100, 'Field label too long'),
  description: z.string().optional(),
  type: fieldTypeSchema,
  placeholder: z.string().optional(),
  required: z.boolean(),
})

export const formSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  name: z
    .string()
    .min(1, 'Section name is required')
    .max(50, 'Section name too long'),
  fields: z
    .array(formFieldSchema)
    .min(1, 'Section must have at least one field')
    .max(
      FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION,
      `Section cannot have more than ${FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION} fields`,
    ),
})

export const formStructureSchema = z.object({
  title: z
    .string()
    .min(1, 'Form title is required')
    .max(100, 'Form title too long'),
  sections: z
    .array(formSectionSchema)
    .min(1, 'Form must have at least one section')
    .max(
      FORM_CONSTRAINTS.MAX_SECTIONS,
      `Form cannot have more than ${FORM_CONSTRAINTS.MAX_SECTIONS} sections`,
    ),
})

export const formCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Form title is required')
    .max(200, 'Form title too long'),
  sections: z
    .array(formSectionSchema)
    .min(1, 'Form must have at least one section')
    .max(
      FORM_CONSTRAINTS.MAX_SECTIONS,
      `Form cannot have more than ${FORM_CONSTRAINTS.MAX_SECTIONS} sections`,
    ),
})

export const formSubmissionSchema = z.record(
  z.string(), // field ID
  z.union([z.string(), z.number()]), // field value
)

export const createFormRequestSchema = z.object({
  title: z.string().min(1).max(200),
  sections: z
    .array(formSectionSchema)
    .min(1)
    .max(FORM_CONSTRAINTS.MAX_SECTIONS),
})

export const updateFormRequestSchema = z.object({
  title: z.string().min(1).max(200),
  sections: z
    .array(formSectionSchema)
    .min(1)
    .max(FORM_CONSTRAINTS.MAX_SECTIONS),
})

export const submitFormRequestSchema = z.object({
  payload: formSubmissionSchema,
})

export function validateFormConstraints(sections: any[]): string[] {
  const errors: string[] = []

  if (sections.length > FORM_CONSTRAINTS.MAX_SECTIONS) {
    errors.push(
      `Form cannot have more than ${FORM_CONSTRAINTS.MAX_SECTIONS} sections`,
    )
  }

  sections.forEach((section, sectionIndex) => {
    if (section.fields?.length > FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION) {
      errors.push(
        `Section ${sectionIndex + 1} cannot have more than ${
          FORM_CONSTRAINTS.MAX_FIELDS_PER_SECTION
        } fields`,
      )
    }
  })

  return errors
}

export function validateRequiredFields(
  submission: Record<string, any>,
  sections: any[],
): string[] {
  const errors: string[] = []

  sections.forEach((section) => {
    section.fields?.forEach((field: any) => {
      if (
        field.required &&
        (!submission[field.id] || submission[field.id] === '')
      ) {
        errors.push(`${field.label} is required`)
      }
    })
  })

  return errors
}
