'use client'

import { ListTodo, AlarmClock, Volume2, Hash, Plus, ChevronDown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import type { RoomType } from '@/lib/types'

const groupMeta: Record<RoomType, { label: string; icon: typeof ListTodo }> = {
  chat: { label: 'CHAT TEKS', icon: Hash },
  tugas: { label: 'TUGAS', icon: ListTodo },
  jadwal: { label: 'JADWAL & ALARM', icon: AlarmClock },
  suara: { label: 'VOICE CHAT', icon: Volume2 },
}

export function RoomSidebar() {
  const { servers, rooms, activeServerId, activeRoomId, setActiveRoom, voice } = useStore()
  const server = servers.find((s) => s.id === activeServerId)
  const serverRooms = rooms.filter((r) => r.serverId === activeServerId)
  const order: RoomType[] = ['chat', 'tugas', 'jadwal', 'suara']

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <span className="truncate font-semibold text-sidebar-foreground">{server?.name}</span>
        <ChevronDown className="ml-auto size-4 text-muted-foreground" />
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-3">
          {order.map((type) => {
            const list = serverRooms.filter((r) => r.type === type)
            if (list.length === 0) return null
            const Meta = groupMeta[type]
            return (
              <div key={type} className="flex flex-col gap-1">
                <div className="flex items-center gap-1 px-2 py-1">
                  <span className="text-[11px] font-bold tracking-wide text-muted-foreground">
                    {Meta.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.info('Menambah room baru (demo tampilan).')}
                    className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Tambah room ${Meta.label}`}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                {list.map((room) => {
                  const active = room.id === activeRoomId
                  const Icon = groupMeta[room.type].icon
                  const count = voice[room.id]?.length ?? 0
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setActiveRoom(room.id)}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium transition-colors',
                        active
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{room.name}</span>
                      {room.type === 'suara' && count > 0 && (
                        <span className="ml-auto flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-[11px] font-semibold text-success">
                          <span className="size-1.5 rounded-full bg-success" />
                          {count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}
