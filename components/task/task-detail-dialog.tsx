'use client'

import { useRef, useState } from 'react'
import {
  Calendar,
  Plus,
  Upload,
  FileText,
  ImageIcon,
  Check,
  X,
  UserPlus,
  CheckCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StatusBadge } from '@/components/status-badge'
import { MemberAvatar } from '@/components/member-avatar'
import { useStore, taskProgress } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Task, Todo } from '@/lib/types'

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { tasks } = useStore()
  const live = tasks.find((t) => t.id === task?.id) ?? task
  if (!live) return null
  const progress = taskProgress(live)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b p-5">
          <DialogTitle className="text-lg">{live.title}</DialogTitle>
          <DialogDescription>{live.description || 'Tanpa deskripsi.'}</DialogDescription>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Tenggat: {live.dueDate}
            </span>
            <span aria-hidden>•</span>
            <span>{live.todos.length} to-do</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-sm font-semibold text-foreground">{progress}%</span>
          </div>
        </DialogHeader>

        <div className="flex max-h-[52vh] flex-col gap-3 overflow-y-auto p-5">
          {live.todos.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada to-do. Tambahkan item pekerjaan di bawah.
            </p>
          )}
          {live.todos.map((todo) => (
            <TodoCard key={todo.id} taskId={live.id} todo={todo} />
          ))}
        </div>

        <AddTodoBar taskId={live.id} />
      </DialogContent>
    </Dialog>
  )
}

function TodoCard({ taskId, todo }: { taskId: string; todo: Todo }) {
  const { role, currentUserId, getMember, submitProof, reviewTodo } = useStore()
  const isAssignee = todo.assigneeIds.includes(currentUserId)
  const fileRef = useRef<HTMLInputElement>(null)
  const [note, setNote] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [pendingFile, setPendingFile] = useState<{ name: string; kind: 'image' | 'file'; url?: string } | null>(null)

  const canUpload =
    role === 'member' && isAssignee && (todo.status === 'todo' || todo.status === 'dikerjakan' || todo.status === 'revisi')
  const canReview = role === 'admin' && todo.status === 'review'

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    setPendingFile({
      name: file.name,
      kind: isImage ? 'image' : 'file',
      url: isImage ? URL.createObjectURL(file) : undefined,
    })
  }

  const sendProof = () => {
    if (!pendingFile) {
      toast.error('Pilih file bukti dulu.')
      return
    }
    submitProof(taskId, todo.id, { ...pendingFile, fileName: pendingFile.name, note: note.trim() || undefined })
    toast.success('Bukti dikirim, menunggu review admin.')
    setShowUpload(false)
    setPendingFile(null)
    setNote('')
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
            todo.status === 'selesai'
              ? 'border-success bg-success text-white'
              : 'border-muted-foreground/30',
          )}
          aria-hidden
        >
          {todo.status === 'selesai' && <Check className="size-3.5" />}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'font-medium',
                todo.status === 'selesai' && 'text-muted-foreground line-through',
              )}
            >
              {todo.title}
            </span>
            <StatusBadge status={todo.status} className="ml-auto" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Ditugaskan:</span>
            <div className="flex -space-x-2">
              {todo.assigneeIds.map((id) => {
                const m = getMember(id)
                return m ? <MemberAvatar key={id} member={m} className="size-6 ring-2 ring-card" /> : null
              })}
            </div>
          </div>

          {todo.proof && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 p-2">
              {todo.proof.kind === 'image' ? (
                <span className="flex size-9 items-center justify-center rounded-md bg-info/10 text-info">
                  <ImageIcon className="size-4" />
                </span>
              ) : (
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </span>
              )}
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-medium">{todo.proof.fileName}</span>
                <span className="text-[11px] text-muted-foreground">
                  Diunggah {getMember(todo.proof.uploadedBy)?.name} · {todo.proof.uploadedAt}
                </span>
              </div>
            </div>
          )}
          {todo.proof?.note && (
            <p className="text-xs text-muted-foreground">Catatan: {todo.proof.note}</p>
          )}

          {todo.reviewNote && (
            <Alert
              className={cn(
                todo.status === 'revisi'
                  ? 'border-destructive/30 bg-destructive/5 text-destructive'
                  : 'border-success/30 bg-success/5',
              )}
            >
              {todo.status === 'revisi' ? (
                <X className="size-4" />
              ) : (
                <CheckCheck className="size-4 text-success" />
              )}
              <AlertTitle>{todo.status === 'revisi' ? 'Perlu revisi' : 'Disetujui admin'}</AlertTitle>
              <AlertDescription className={cn(todo.status === 'revisi' && 'text-destructive/90')}>
                {todo.reviewNote}
              </AlertDescription>
            </Alert>
          )}

          {/* Aksi anggota: kirim bukti */}
          {canUpload && !showUpload && (
            <Button variant="outline" size="sm" className="w-fit" onClick={() => setShowUpload(true)}>
              <Upload data-icon="inline-start" />
              {todo.status === 'revisi' ? 'Kirim ulang bukti' : 'Kirim bukti selesai'}
            </Button>
          )}
          {canUpload && showUpload && (
            <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={onPickFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                <Upload className="size-4" />
                {pendingFile ? pendingFile.name : 'Pilih foto atau file bukti'}
              </button>
              {pendingFile?.kind === 'image' && pendingFile.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pendingFile.url || '/placeholder.svg'}
                  alt="Pratinjau bukti"
                  className="max-h-40 w-full rounded-lg object-cover"
                />
              )}
              <Textarea
                placeholder="Tambahkan catatan untuk admin (opsional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={sendProof}>
                  <Check data-icon="inline-start" />
                  Kirim untuk direview
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowUpload(false)
                    setPendingFile(null)
                  }}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}

          {/* Aksi admin: review */}
          {canReview && (
            <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
              <span className="text-xs font-semibold">Review bukti dari anggota</span>
              <Textarea
                placeholder="Tulis catatan review atau alasan revisi"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-success text-white hover:bg-success/90"
                  onClick={() => {
                    reviewTodo(taskId, todo.id, 'acc', reviewNote.trim() || 'Disetujui.')
                    toast.success('Tugas disetujui (ACC).')
                    setReviewNote('')
                  }}
                >
                  <Check data-icon="inline-start" />
                  Setujui (ACC)
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (!reviewNote.trim()) {
                      toast.error('Isi alasan revisi dulu.')
                      return
                    }
                    reviewTodo(taskId, todo.id, 'revisi', reviewNote.trim())
                    toast.info('Tugas dikembalikan untuk revisi.')
                    setReviewNote('')
                  }}
                >
                  <X data-icon="inline-start" />
                  Minta revisi
                </Button>
              </div>
            </div>
          )}

          {role === 'member' && !isAssignee && todo.status !== 'selesai' && (
            <p className="text-xs text-muted-foreground">Kamu tidak ditugaskan pada item ini.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function AddTodoBar({ taskId }: { taskId: string }) {
  const { role, servers, activeServerId, getMember, addTodo } = useStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [assignees, setAssignees] = useState<string[]>([])
  const server = servers.find((s) => s.id === activeServerId)

  if (role !== 'admin') return null

  const toggle = (id: string) =>
    setAssignees((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const add = () => {
    if (!title.trim()) {
      toast.error('Judul to-do belum diisi.')
      return
    }
    if (assignees.length === 0) {
      toast.error('Pilih minimal satu anggota.')
      return
    }
    addTodo(taskId, title.trim(), assignees)
    toast.success('To-do ditambahkan & ditugaskan.')
    setTitle('')
    setAssignees([])
    setOpen(false)
  }

  return (
    <div className="border-t bg-card p-4">
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus data-icon="inline-start" />
          Tambah to-do & tugaskan anggota
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Judul to-do, mis. Buat desain visual"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <UserPlus className="size-3.5" />
              Tugaskan ke
            </span>
            <div className="flex flex-wrap gap-2">
              {server?.memberIds.map((id) => {
                const m = getMember(id)
                if (!m) return null
                const active = assignees.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition-colors',
                      active ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted',
                    )}
                  >
                    <MemberAvatar member={m} className="size-6" />
                    {m.name}
                    {active && <Check className="size-3.5" />}
                  </button>
                )
              })}
            </div>
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button size="sm" onClick={add}>
              Tambah
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
