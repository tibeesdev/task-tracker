import * as React from 'react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

type InputGroupProps = React.ComponentProps<'div'>

type InputGroupTextareaProps = React.ComponentProps<'textarea'>

type InputGroupAddonProps = React.ComponentProps<'div'> & {
  align?: 'inline-start' | 'inline-end'
}

export function InputGroup({ className, children, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn('flex w-full items-center gap-2 rounded-lg border border-input bg-background', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function InputGroupTextarea({ className, ...props }: InputGroupTextareaProps) {
  return (
    <Textarea
      data-slot="input-group-textarea"
      className={cn('min-h-11 flex-1 resize-none rounded-r-none border-0 bg-transparent shadow-none', className)}
      {...props}
    />
  )
}

export function InputGroupAddon({ className, align = 'inline-end', children, ...props }: InputGroupAddonProps) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(
        'flex shrink-0 items-center',
        align === 'inline-end' ? 'justify-end' : 'justify-start',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
