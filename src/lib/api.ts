import type { FormData } from '@/components/form-builder/types'
import type { FormStructure, ParsedForm } from './types'
import { formBuilderToBackend, backendToFormBuilder } from './form-utils'
import { createBasicAuthHeader } from './auth'

const API_BASE = '/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: string[]
}

/**
 * Create a new form
 */
export async function createForm(
  formData: FormData,
): Promise<ApiResponse<ParsedForm>> {
  try {
    const backendData = formBuilderToBackend(formData)

    const response = await fetch(`${API_BASE}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: createBasicAuthHeader(),
      },
      body: JSON.stringify(backendData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create form',
        details: result.details,
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error creating form:', error)
    return {
      success: false,
      error: 'Network error occurred',
    }
  }
}

/**
 * Update an existing form
 */
export async function updateForm(
  formId: string,
  formData: FormData,
): Promise<ApiResponse<ParsedForm>> {
  try {
    const backendData = formBuilderToBackend(formData)

    const response = await fetch(`${API_BASE}/forms/${formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: createBasicAuthHeader(),
      },
      body: JSON.stringify(backendData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to update form',
        details: result.details,
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error updating form:', error)
    return {
      success: false,
      error: 'Network error occurred',
    }
  }
}

/**
 * Get a form by ID
 */
export async function getForm(formId: string): Promise<ApiResponse<FormData>> {
  try {
    const response = await fetch(`${API_BASE}/forms/${formId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: createBasicAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to fetch form',
      }
    }

    // Convert backend data to form builder format
    const formBuilderData = backendToFormBuilder({
      title: result.title,
      sections: result.sections,
    })

    return {
      success: true,
      data: formBuilderData,
    }
  } catch (error) {
    console.error('Error fetching form:', error)
    return {
      success: false,
      error: 'Network error occurred',
    }
  }
}

/**
 * Get all forms (for admin listing)
 */
export async function getForms(): Promise<ApiResponse<any[]>> {
  try {
    const response = await fetch(`${API_BASE}/forms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: createBasicAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to fetch forms',
      }
    }

    return {
      success: true,
      data: result.forms,
    }
  } catch (error) {
    console.error('Error fetching forms:', error)
    return {
      success: false,
      error: 'Network error occurred',
    }
  }
}

/**
 * Delete a form
 */
export async function deleteForm(formId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE}/forms/${formId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: createBasicAuthHeader(),
      },
    })

    if (!response.ok) {
      const result = await response.json()
      return {
        success: false,
        error: result.error || 'Failed to delete form',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting form:', error)
    return {
      success: false,
      error: 'Network error occurred',
    }
  }
}
