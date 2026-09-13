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
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

export function CreateTaskDialog({ roomId }: { roomId: string }) {
  const { addTask } = useStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const submit = () => {
    if (!title.trim()) {
      toast.error('Judul tugas belum diisi.')
      return
    }
    addTask(roomId, title.trim(), description.trim(), dueDate || 'Tanpa tenggat')
    toast.success('Tugas baru dibuat.')
    setTitle('')
    setDescription('')
    setDueDate('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" />
        Buat Tugas
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Tugas Baru</DialogTitle>
          <DialogDescription>
            Setelah tugas dibuat, tambahkan daftar to-do dan tugaskan ke anggota.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="task-title">Judul tugas</FieldLabel>
            <Input
              id="task-title"
              placeholder="Contoh: Redesain halaman beranda"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="task-desc">Deskripsi</FieldLabel>
            <Textarea
              id="task-desc"
              placeholder="Jelaskan tujuan tugas ini secara singkat"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="task-due">Tenggat waktu</FieldLabel>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
          <Button onClick={submit}>Buat Tugas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
