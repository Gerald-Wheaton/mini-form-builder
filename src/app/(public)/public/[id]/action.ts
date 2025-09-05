'use server'

import { prisma } from '@/lib/prisma'
import type { FormStructure, FormSection } from '@/lib/types'

/**
 * Server action to fetch a form by public ID (for public form submissions)
 */
export async function getFormByPublicId(
  publicId: string,
): Promise<FormStructure | null> {
  try {
    console.log('🔍 Looking for form with publicId:', publicId)

    const form = await prisma.form.findUnique({
      where: { publicId },
    })

    console.log(
      '📄 Found form:',
      form ? { id: form.id, title: form.title, publicId: form.publicId } : null,
    )

    if (!form) {
      return null
    }

    // Parse the JSON sections and ensure type safety
    const sections = JSON.parse(form.sections) as FormSection[]

    return {
      title: form.title,
      sections,
    }
  } catch (error) {
    console.error('Error fetching form by public ID:', error)
    return null
  }
}

/**
 * Server action to submit form data to a public form
 */
export async function submitFormData(
  publicId: string,
  submissionData: Record<string, string | number>,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find the form by public ID
    const form = await prisma.form.findUnique({
      where: { publicId },
    })

    if (!form) {
      return { success: false, error: 'Form not found' }
    }

    // Create the submission
    await prisma.submission.create({
      data: {
        formId: form.id,
        payload: JSON.stringify(submissionData),
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting form:', error)
    return { success: false, error: 'Failed to submit form' }
  }
}
