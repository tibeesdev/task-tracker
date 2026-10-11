'use client'

import { useState } from 'react'
import { ListTodo, AlarmClock, Volume2, Hash, Plus, Crown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { CreateRoomDialog } from './create-room-dialog'
import type { RoomType } from '@/lib/types'

const groupMeta: Record<RoomType, { label: string; icon: typeof ListTodo }> = {
  chat: { label: 'CHAT TEKS', icon: Hash },
  tugas: { label: 'TUGAS & JOBDESK', icon: ListTodo },
  jadwal: { label: 'JADWAL & ALARM', icon: AlarmClock },
  suara: { label: 'VOICE CHAT', icon: Volume2 },
}

export function RoomSidebar() {
  const { servers, rooms, activeServerId, activeRoomId, setActiveRoom, voice, role, currentUserId } =
    useStore()
  const server = servers.find((s) => s.id === activeServerId)
  const isOwner = server?.ownerId === currentUserId
  const serverRooms = rooms.filter((r) => r.serverId === activeServerId)
  const order: RoomType[] = ['chat', 'tugas', 'jadwal', 'suara']

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<RoomType>('tugas')

  const openCreateDialog = (type: RoomType) => {
    setSelectedType(type)
    setCreateDialogOpen(true)
  }

  return (
    <>
      <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-sidebar">
        {/* Server Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate font-bold text-sm text-sidebar-foreground">
              {server?.name}
            </span>
            {isOwner && (
              <span
                className="flex items-center gap-1 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300"
                title="Kamu adalah Pembuat / Admin Server ini"
              >
                <Crown className="size-2.5" />
                Admin
              </span>
            )}
          </div>

          {role === 'admin' && (
            <button
              type="button"
              onClick={() => openCreateDialog('tugas')}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Tambah Room"
              title="Tambah Room Baru"
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-3">
            {order.map((type) => {
              const list = serverRooms.filter((r) => r.type === type)
              const Meta = groupMeta[type]
              return (
                <div key={type} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-[11px] font-bold tracking-wide text-muted-foreground">
                      {Meta.label}
                    </span>
                    {role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => openCreateDialog(type)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Tambah room ${Meta.label}`}
                        title={`Tambah room ${Meta.label}`}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {list.length === 0 ? (
                    <div className="px-2 py-1 text-[11px] text-muted-foreground italic">
                      Belum ada room
                    </div>
                  ) : (
                    list.map((room) => {
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
                            'flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium transition-all',
                            active
                              ? 'bg-primary/10 text-primary font-semibold shadow-2xs'
                              : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                          )}
                        >
                          <Icon className={cn('size-4 shrink-0', active && 'text-primary')} />
                          <span className="truncate">{room.name}</span>
                          {room.type === 'suara' && count > 0 && (
                            <span className="ml-auto flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                              <span className="size-1.5 rounded-full bg-success animate-pulse" />
                              {count}
                            </span>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </aside>

      <CreateRoomDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultType={selectedType}
      />
    </>
  )
}
