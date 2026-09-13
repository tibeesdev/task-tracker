'use client'

import { ListTodo, AlarmClock, Volume2, Hash, type LucideIcon } from 'lucide-react'
import { useStore } from '@/lib/store'
import { MemberAvatar } from '@/components/member-avatar'
import { cn } from '@/lib/utils'
import type { RoomType } from '@/lib/types'

const icons: Record<RoomType, LucideIcon> = {
  tugas: ListTodo,
  jadwal: AlarmClock,
  suara: Volume2,
  chat: Hash,
}

const hints: Record<RoomType, string> = {
  tugas: 'Kelola tugas & to-do list tim di sini',
  jadwal: 'Alarm & jadwal yang dibagikan ke semua anggota',
  suara: 'Ruang diskusi suara bersama',
}

export function TopBar() {
  const { rooms, activeRoomId, role, setRole, getMember, currentUserId } = useStore()
  const room = rooms.find((r) => r.id === activeRoomId)
  const me = getMember(currentUserId)
  if (!room) return null
  const Icon = icons[room.type]

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4">
      <Icon className="size-5 text-muted-foreground" />
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-sm font-semibold leading-tight">{room.name}</h1>
        <p className="truncate text-xs text-muted-foreground">{hints[room.type]}</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div
          className="flex items-center rounded-full bg-muted p-1"
          role="group"
          aria-label="Lihat aplikasi sebagai"
        >
          {(['admin', 'member'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                role === r
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {r === 'admin' ? 'Admin' : 'Anggota'}
            </button>
          ))}
        </div>
        {me && (
          <div className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3">
            <MemberAvatar member={me} className="size-7" showStatus />
            <span className="text-xs font-medium">{me.name}</span>
          </div>
        )}
      </div>
    </header>
  )
}
