import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { validateRequestAuth, createUnauthorizedResponse } from '@/lib/auth'
import {
  createFormRequestSchema,
  validateFormConstraints,
} from '@/lib/validation'
import type { FormSection } from '@/lib/types'

export async function POST(request: NextRequest) {
  if (!validateRequestAuth(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()

    const validatedData = createFormRequestSchema.parse(body)

    const constraintErrors = validateFormConstraints(validatedData.sections)
    if (constraintErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: constraintErrors },
        { status: 400 },
      )
    }

    const form = await prisma.form.create({
      data: {
        id: uuidv4(),
        title: validatedData.title,
        sections: JSON.stringify(validatedData.sections),
        publicId: uuidv4(),
      },
    })

    return NextResponse.json(
      {
        id: form.id,
        title: form.title,
        sections: JSON.parse(form.sections) as FormSection[],
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        publicId: form.publicId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating form:', error)

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

export async function GET(request: NextRequest) {
  if (!validateRequestAuth(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        publicId: true,
        _count: {
          select: { submissions: true },
        },
      },
    })

    return NextResponse.json({
      forms: forms.map((form) => ({
        id: form.id,
        title: form.title,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        publicId: form.publicId,
        submissionCount: form._count.submissions,
        publicUrl: `/public/${form.publicId}`,
      })),
    })
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
