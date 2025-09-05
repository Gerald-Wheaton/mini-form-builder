'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Sparkles, Send } from 'lucide-react'
import type { FormData } from './types'

interface AIGenerationDialogProps {
  isOpen: boolean
  onClose: () => void
  onFormGenerated: (formData: FormData) => void
}

export function AIGenerationDialog({
  isOpen,
  onClose,
  onFormGenerated,
}: AIGenerationDialogProps) {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])

  const handleSubmit = async () => {
    if (!description.trim()) return

    setIsGenerating(true)
    setError(null)

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: description }
    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch('/api/ai/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate form')
      }

      const formData = await response.json()

      // Add assistant response to chat
      const assistantMessage = {
        role: 'assistant' as const,
        content: `Great! I've generated a form called "${
          formData.title
        }" with ${formData.sections.length} section${
          formData.sections.length > 1 ? 's' : ''
        }. The form is now ready for you to review and customize further.`,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Wait a moment to show the response, then close and apply
      setTimeout(() => {
        onFormGenerated(formData)
        handleClose()
      }, 1500)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}`,
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setDescription('')
    setMessages([])
    setError(null)
    setIsGenerating(false)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate Form with AI
          </DialogTitle>
          <DialogDescription>
            Describe the form you want to create and I'll build it for you.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col gap-4">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[300px] p-3 border rounded-lg bg-muted/20">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Tell me about the form you'd like to create...
                </p>
                <p className="text-xs mt-1 opacity-75">
                  Example: "A contact form with name, email, and message fields"
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-background border p-3 rounded-lg text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking about your form...
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the form you want to create..."
              className="flex-1 min-h-[60px] resize-none"
              disabled={isGenerating}
            />
            <Button
              onClick={handleSubmit}
              disabled={!description.trim() || isGenerating}
              className="px-3"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded border">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
