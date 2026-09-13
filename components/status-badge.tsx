import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TodoStatus } from '@/lib/types'

const map: Record<TodoStatus, { label: string; cls: string }> = {
  todo: { label: 'Belum mulai', cls: 'bg-muted text-muted-foreground' },
  dikerjakan: { label: 'Dikerjakan', cls: 'bg-info/10 text-info' },
  review: { label: 'Menunggu review', cls: 'bg-warning/25 text-warning-foreground' },
  revisi: { label: 'Perlu revisi', cls: 'bg-destructive/10 text-destructive' },
  selesai: { label: 'Selesai', cls: 'bg-success/12 text-success' },
}

export function StatusBadge({ status, className }: { status: TodoStatus; className?: string }) {
  const { label, cls } = map[status]
  return (
    <Badge variant="secondary" className={cn('border-transparent font-medium', cls, className)}>
      {label}
    </Badge>
  )
}
