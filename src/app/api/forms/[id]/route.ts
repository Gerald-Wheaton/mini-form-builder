import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRequestAuth, createUnauthorizedResponse } from '@/lib/auth'
import {
  updateFormRequestSchema,
  validateFormConstraints,
} from '@/lib/validation'
import type { FormSection } from '@/lib/types'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!validateRequestAuth(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: form.id,
      title: form.title,
      sections: JSON.parse(form.sections) as FormSection[],
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      publicId: form.publicId,
      submissionCount: form._count.submissions,
      publicUrl: `/form/${form.publicId}`,
    })
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!validateRequestAuth(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()

    const validatedData = updateFormRequestSchema.parse(body)

    if (validatedData.sections) {
      const constraintErrors = validateFormConstraints(validatedData.sections)
      if (constraintErrors.length > 0) {
        return NextResponse.json(
          { error: 'Validation failed', details: constraintErrors },
          { status: 400 },
        )
      }
    }

    const existingForm = await prisma.form.findUnique({
      where: { id: params.id },
    })

    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const updateData: { title?: string; sections?: string } = {}
    if (validatedData.title) {
      updateData.title = validatedData.title
    }
    if (validatedData.sections) {
      updateData.sections = JSON.stringify(validatedData.sections)
    }

    const updatedForm = await prisma.form.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({
      id: updatedForm.id,
      title: updatedForm.title,
      sections: JSON.parse(updatedForm.sections) as FormSection[],
      createdAt: updatedForm.createdAt,
      updatedAt: updatedForm.updatedAt,
      publicId: updatedForm.publicId,
    })
  } catch (error) {
    console.error('Error updating form:', error)

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
