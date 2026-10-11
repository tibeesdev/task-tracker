'use client'

import { useState } from 'react'
import { Plus, Briefcase } from 'lucide-react'
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
      toast.error('Judul jobdesk belum diisi.')
      return
    }
    addTask(roomId, title.trim(), description.trim(), dueDate || 'Tanpa tenggat')
    toast.success('Jobdesk baru berhasil dibuat.')
    setTitle('')
    setDescription('')
    setDueDate('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="bg-primary text-primary-foreground font-bold shadow-xs gap-1.5" />}>
        <Plus className="size-4" />
        Buat Jobdesk Baru
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Briefcase className="size-4" />
            </span>
            <DialogTitle className="text-base font-bold">Buat Jobdesk Organisasi</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Sebagai Administrator, buat penugasan kerja ini. Setelah dibuat, kamu dapat membagi rincian
            to-do list dan menugaskan anggota penanggung jawab.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="pt-2">
          <Field>
            <FieldLabel htmlFor="task-title" className="text-xs font-bold">Nama Jobdesk / Proyek</FieldLabel>
            <Input
              id="task-title"
              placeholder="Contoh: Penyusunan Laporan Pertanggungjawaban (LPJ)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs"
              autoFocus
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="task-desc" className="text-xs font-bold">Deskripsi & Ruang Lingkup</FieldLabel>
            <Textarea
              id="task-desc"
              placeholder="Jelaskan instruksi kerja, standar luaran, atau ketentuan penting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="task-due" className="text-xs font-bold">Batas Waktu Penyelesaian (Deadline)</FieldLabel>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs"
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="pt-2">
          <DialogClose render={<Button variant="outline" size="sm" />}>Batal</DialogClose>
          <Button size="sm" onClick={submit} className="bg-primary text-primary-foreground font-bold">
            Simpan & Buat Jobdesk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
