export interface Field {
  id: string
  label: string
  description?: string
  type: 'text' | 'number' | 'email' | 'phone' | 'textarea'
  placeholder?: string
  required: boolean
}

export interface Section {
  id: string
  name: string
  fields: Field[]
}

export interface FormData {
  title: string
  sections: Section[]
}
