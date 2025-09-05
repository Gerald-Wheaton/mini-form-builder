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
      publicUrl: `/public/${form.publicId}`,
    })
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
