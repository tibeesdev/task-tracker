'use client'

import { useState } from 'react'
import { Plus, ListTodo, AlarmClock, Volume2, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import type { RoomType } from '@/lib/types'
import { cn } from '@/lib/utils'

const roomTypes: { type: RoomType; label: string; desc: string; icon: typeof ListTodo }[] = [
  {
    type: 'tugas',
    label: 'Room Tugas',
    desc: 'Untuk membuat tugas, to-do list, upload bukti & review ACC/Revisi',
    icon: ListTodo,
  },
  {
    type: 'jadwal',
    label: 'Room Jadwal & Alarm',
    desc: 'Alarm & jadwal bersama dengan pelacak respons tim',
    icon: AlarmClock,
  },
  {
    type: 'suara',
    label: 'Room Voice Chat',
    desc: 'Diskusi suara grup untuk koordinasi langsung',
    icon: Volume2,
  },
  {
    type: 'chat',
    label: 'Room Obrolan Teks',
    desc: 'Percakapan teks dan bertukar pesan antar anggota',
    icon: Hash,
  },
]

export function CreateRoomDialog({
  open,
  onOpenChange,
  defaultType = 'tugas',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: RoomType
}) {
  const { addRoom, activeServerId } = useStore()
  const [name, setName] = useState('')
  const [type, setType] = useState<RoomType>(defaultType)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Nama room harus diisi.')
      return
    }
    addRoom(activeServerId, name.trim(), type)
    toast.success(`Room "${name.trim()}" berhasil dibuat.`)
    setName('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Room Baru</DialogTitle>
          <DialogDescription>
            Pilih jenis room dan beri nama untuk memulai kolaborasi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4 pt-2">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="room-name">Nama Room</FieldLabel>
              <Input
                id="room-name"
                placeholder="Contoh: sprint-desain atau alarm-harian"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Field>

            <Field>
              <FieldLabel>Jenis Room</FieldLabel>
              <div className="grid grid-cols-1 gap-2 pt-1">
                {roomTypes.map((rt) => {
                  const Icon = rt.icon
                  const active = type === rt.type
                  return (
                    <button
                      key={rt.type}
                      type="button"
                      onClick={() => setType(rt.type)}
                      className={cn(
                        'flex items-start gap-3 rounded-xl border p-3 text-left transition-all',
                        active
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-lg',
                          active ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                        )}
                      >
                        <Icon className="size-4.5" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground">{rt.label}</span>
                        <span className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                          {rt.desc}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Buat Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
