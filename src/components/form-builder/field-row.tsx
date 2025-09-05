'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Trash2,
  GripVertical,
  Mail,
  Phone,
  Hash,
  Type,
  AlertTriangle,
} from 'lucide-react'
import type { Field } from './types'

interface FieldRowProps {
  field: Field
  fieldIndex: number
  totalFields: number
  onUpdate: (updates: Partial<Field>) => void
  onRemove: () => void
  hasValidationError: boolean
}

export function FieldRow({
  field,
  fieldIndex,
  totalFields,
  onUpdate,
  onRemove,
  hasValidationError,
}: FieldRowProps) {
  const getFieldTypeIcon = (type: Field['type']) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />
      case 'number':
        return <Hash className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'phone':
        return <Phone className="w-4 h-4" />
      case 'textarea':
        return <Type className="w-4 h-4" />
      default:
        return <Type className="w-4 h-4" />
    }
  }

  return (
    <Card
      className={`border border-border/50 bg-background/50 hover:bg-background transition-colors relative ${
        hasValidationError ? 'border-destructive/50' : ''
      }`}
    >
      <CardContent className="p-4">
        <Button
          onClick={onRemove}
          variant="ghost"
          size="sm"
          disabled={totalFields <= 1}
          className="absolute top-3 right-3 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        <div className="flex items-start gap-3 pr-12">
          <div className="hidden md:flex items-center justify-center w-6 h-6 mt-2 text-muted-foreground cursor-grab hover:text-foreground transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex-1 space-y-4 md:ml-0">
            <div className="space-y-2">
              <Label
                htmlFor={`field-${field.id}-label`}
                className="text-sm font-medium"
              >
                Field Label
              </Label>
              <Input
                id={`field-${field.id}-label`}
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Enter field label"
                className={`font-medium border-primary/30 focus:border-primary focus:ring-primary/20 ${
                  hasValidationError ? 'border-destructive' : ''
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`field-${field.id}-description`}
                className="text-sm font-medium"
              >
                Description (optional)
              </Label>
              <Textarea
                id={`field-${field.id}-description`}
                value={field.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Add a helpful description for this field"
                className="text-sm resize-none h-20 border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`field-${field.id}-placeholder`}
                className="text-sm font-medium"
              >
                Placeholder Text
              </Label>
              <Input
                id={`field-${field.id}-placeholder`}
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Enter placeholder text (optional)"
                className="text-sm border-primary/30 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Label className="text-sm font-medium">Field Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value: Field['type']) =>
                    onUpdate({ type: value })
                  }
                >
                  <SelectTrigger className="w-full border-primary/30 focus:border-primary focus:ring-primary/20">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getFieldTypeIcon(field.type)}
                        <span className="capitalize">{field.type}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Text
                      </div>
                    </SelectItem>
                    <SelectItem value="number">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Number
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </div>
                    </SelectItem>
                    <SelectItem value="textarea">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Textarea
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Required</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id={`field-${field.id}-required`}
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      onUpdate({ required: checked })
                    }
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary/40"
                  />
                  <Label
                    htmlFor={`field-${field.id}-required`}
                    className={`text-sm w-16 ${
                      field.required
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {field.required ? 'Required' : 'Optional'}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <Badge variant="outline" className="text-xs">
                Field {fieldIndex + 1} of {totalFields}
              </Badge>
              <div className="flex items-center gap-2">
                {field.required && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary"
                  >
                    Required
                  </Badge>
                )}
                {hasValidationError && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
