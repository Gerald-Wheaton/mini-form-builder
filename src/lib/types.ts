// Form field types - updated to match form builder UI
export type FieldType = 'text' | 'number' | 'email' | 'phone' | 'textarea'

// Form field structure - updated to match form builder UI
export interface FormField {
  id: string
  label: string
  description?: string
  type: FieldType
  placeholder?: string
  required: boolean
}

// Form section structure - updated to match form builder UI
export interface FormSection {
  id: string
  name: string // Changed from 'title' to 'name' to match form builder
  fields: FormField[]
}

// Complete form structure
export interface FormStructure {
  title: string // Added form title
  sections: FormSection[]
}

// Type alias to match form builder component types
export type FormBuilderData = FormStructure
export type FormBuilderField = FormField
export type FormBuilderSection = FormSection

// Form data from database
export interface Form {
  id: string
  title: string
  sections: string // JSON string
  createdAt: Date
  updatedAt: Date
  publicId: string
}

// Parsed form with structure
export interface ParsedForm {
  id: string
  title: string
  sections: FormSection[]
  createdAt: Date
  updatedAt: Date
  publicId: string
}

// Form submission data
export interface FormSubmission {
  [fieldId: string]: string | number
}

// Submission from database
export interface Submission {
  id: string
  formId: string
  payload: string // JSON string
  createdAt: Date
}

// Parsed submission
export interface ParsedSubmission {
  id: string
  formId: string
  payload: FormSubmission
  createdAt: Date
}

// Form constraints
export const FORM_CONSTRAINTS = {
  MAX_SECTIONS: 2,
  MAX_FIELDS_PER_SECTION: 3,
} as const
