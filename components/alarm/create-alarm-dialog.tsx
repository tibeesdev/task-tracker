'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import type { Alarm } from '@/lib/types'

export function CreateAlarmDialog({ roomId }: { roomId: string }) {
  const { addAlarm } = useStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [time, setTime] = useState('09:00')
  const [date, setDate] = useState('')
  const [repeat, setRepeat] = useState<Alarm['repeat']>('sekali')

  const submit = () => {
    if (!title.trim()) {
      toast.error('Judul alarm belum diisi.')
      return
    }
    addAlarm(roomId, {
      title: title.trim(),
      note: note.trim(),
      time,
      date: date || 'Hari ini',
      repeat,
    })
    toast.success('Alarm dibagikan ke semua anggota.')
    setTitle('')
    setNote('')
    setTime('09:00')
    setDate('')
    setRepeat('sekali')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" />
        Buat Alarm
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Alarm / Jadwal</DialogTitle>
          <DialogDescription>
            Alarm ini akan muncul untuk semua anggota room, dan kamu bisa memantau siapa yang sudah
            mematikannya.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="alarm-title">Judul</FieldLabel>
            <Input
              id="alarm-title"
              placeholder="Contoh: Daily Standup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="alarm-note">Catatan</FieldLabel>
            <Textarea
              id="alarm-note"
              placeholder="Info tambahan untuk anggota"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="alarm-time">Jam</FieldLabel>
              <Input
                id="alarm-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="alarm-date">Tanggal</FieldLabel>
              <Input
                id="alarm-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Pengulangan</FieldLabel>
            <Select value={repeat} onValueChange={(v) => setRepeat(v as Alarm['repeat'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="sekali">Sekali saja</SelectItem>
                  <SelectItem value="harian">Setiap hari</SelectItem>
                  <SelectItem value="mingguan">Setiap minggu</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
          <Button onClick={submit}>Bagikan Alarm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
