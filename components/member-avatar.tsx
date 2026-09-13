import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Member } from '@/lib/types'

export function MemberAvatar({
  member,
  className,
  showStatus = false,
}: {
  member: Member
  className?: string
  showStatus?: boolean
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar className={cn('size-8', className)}>
        <AvatarFallback
          className="text-xs font-semibold text-white"
          style={{ backgroundColor: member.color }}
        >
          {member.initials}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card',
            member.online ? 'bg-success' : 'bg-muted-foreground/50',
          )}
          aria-hidden="true"
        />
      )}
    </span>
  )
}
