import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 },
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 },
      )
    }

    const prompt = `
You are a form builder assistant. Based on the user's description, generate a form configuration.

User description: "${description}"

Please respond with a JSON object that follows this exact structure:
{
  "title": "Form Title",
  "sections": [
    {
      "id": "1",
      "name": "Section Name",
      "fields": [
        {
          "id": "1",
          "label": "Field Label",
          "type": "text|email|number|select|textarea",
          "required": true|false,
          "options": ["option1", "option2"] // only for select type
        }
      ]
    }
  ]
}

Rules:
- Maximum 2 sections
- Maximum 3 fields per section
- Field types: text, email, number, select, textarea
- Keep it simple and practical
- Generate realistic field labels and types based on the description
- Only include "options" property for select fields
- Use meaningful section names that group related fields
- Make field labels clear and user-friendly

Respond with ONLY the JSON object, no other text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content?.trim()

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let formData
    try {
      formData = JSON.parse(response)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response)
      throw new Error('Invalid JSON response from AI')
    }

    // Validate the response structure
    if (
      !formData.title ||
      !formData.sections ||
      !Array.isArray(formData.sections)
    ) {
      throw new Error('Invalid form data structure from AI')
    }

    // Ensure constraints are met
    if (formData.sections.length > 2) {
      formData.sections = formData.sections.slice(0, 2)
    }

    formData.sections = formData.sections.map((section: any) => {
      if (section.fields && section.fields.length > 3) {
        section.fields = section.fields.slice(0, 3)
      }
      return section
    })

    return NextResponse.json(formData)
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate form with AI' },
      { status: 500 },
    )
  }
}
