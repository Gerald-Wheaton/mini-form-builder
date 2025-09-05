import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import {
  submitFormRequestSchema,
  validateRequiredFields,
} from '@/lib/validation'
import type { FormSection } from '@/lib/types'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()

    const validatedData = submitFormRequestSchema.parse(body)

    const form = await prisma.form.findUnique({
      where: { id: params.id },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const sections = JSON.parse(form.sections) as FormSection[]

    const requiredFieldErrors = validateRequiredFields(
      validatedData.payload,
      sections,
    )
    if (requiredFieldErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: requiredFieldErrors },
        { status: 400 },
      )
    }

    const fieldValidationErrors: string[] = []
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        const value = validatedData.payload[field.id]

        if (value !== undefined && value !== '') {
          if (field.type === 'number') {
            const numValue = Number(value)
            if (isNaN(numValue)) {
              fieldValidationErrors.push(
                `${field.label} must be a valid number`,
              )
            }
          }
        }
      })
    })

    if (fieldValidationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: fieldValidationErrors },
        { status: 400 },
      )
    }

    const submission = await prisma.submission.create({
      data: {
        id: uuidv4(),
        formId: params.id,
        payload: JSON.stringify(validatedData.payload),
      },
    })

    return NextResponse.json(
      {
        id: submission.id,
        message: 'Form submitted successfully',
        submittedAt: submission.createdAt,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error submitting form:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
