// Form field types
export type FieldType = 'text' | 'number'

// Form field structure
export interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
}

// Form section structure
export interface FormSection {
  id: string
  title: string
  fields: FormField[]
}

// Complete form structure
export interface FormStructure {
  sections: FormSection[]
}

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
