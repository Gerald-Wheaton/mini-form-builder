'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { createBasicAuthHeader, clientAuth } from '@/lib/auth'
import { FORM_CONSTRAINTS, type FormSection, type FormField } from '@/lib/types'
import { FormBuilder } from '@/components/form-builder/form-bulder'

export default function NewFormPage() {

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <FormBuilder />
    </div>
  )
}
