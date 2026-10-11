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
  Play,
  Eye,
  Trash2,
  Sparkles,
  FileCheck,
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
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StatusBadge } from '@/components/status-badge'
import { MemberAvatar } from '@/components/member-avatar'
import { useStore, taskProgress } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Task, Todo } from '@/lib/types'

// SVG sample data URLs for instant feasibility testing previews
const SAMPLE_SCREENSHOT =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350"><rect width="600" height="350" fill="%23f1f5f9"/><rect x="40" y="40" width="520" height="60" rx="8" fill="%236366f1"/><text x="60" y="78" fill="white" font-size="20" font-family="sans-serif" font-weight="bold">Bukti Pekerjaan Selesai - TaskTrack UI</text><rect x="40" y="120" width="245" height="180" rx="8" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="60" y="160" fill="%23334155" font-size="16" font-family="sans-serif">Wireframe Section</text><circle cx="90" cy="210" r="30" fill="%2310b981"/><text x="140" y="215" fill="%23475569" font-size="14" font-family="sans-serif">Komponen Valid</text><rect x="315" y="120" width="245" height="180" rx="8" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="335" y="160" fill="%23334155" font-size="16" font-family="sans-serif">Tabel Pengujian</text><rect x="335" y="190" width="205" height="16" rx="4" fill="%23e2e8f0"/><rect x="335" y="220" width="160" height="16" rx="4" fill="%23e2e8f0"/></svg>'

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { tasks, role, deleteTask } = useStore()
  const live = tasks.find((t) => t.id === task?.id) ?? task
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  if (!live) return null
  const progress = taskProgress(live)
  const isAllComplete = live.todos.length > 0 && progress === 100

  const handleDelete = () => {
    if (confirm('Hapus tugas ini beserta seluruh to-do di dalamnya?')) {
      deleteTask(live.id)
      toast.success('Tugas berhasil dihapus.')
      onOpenChange(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl border shadow-xl">
          <DialogHeader className="border-b bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 flex-col">
                <DialogTitle className="text-xl font-bold">{live.title}</DialogTitle>
                <DialogDescription className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {live.description || 'Tanpa deskripsi rinci.'}
                </DialogDescription>
              </div>
              {role === 'admin' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={handleDelete}
                  title="Hapus tugas"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Calendar className="size-3.5 text-primary" />
                Tenggat: {live.dueDate}
              </span>
              <span aria-hidden>•</span>
              <span>{live.todos.length} to-do terdaftar</span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Progres Penyelesaian</span>
                <span className={isAllComplete ? 'text-success font-bold' : 'text-primary'}>
                  {progress}% Selesai
                </span>
              </div>
              <Progress value={progress} className="h-2.5 rounded-full" />
            </div>

            {/* Celebratory banner */}
            {isAllComplete && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-success/15 border border-success/30 px-3 py-2 text-xs font-semibold text-success">
                <Sparkles className="size-4 shrink-0" />
                <span>Seluruh to-do pada tugas ini telah di-ACC oleh Admin! Tugas 100% tuntas.</span>
              </div>
            )}
          </DialogHeader>

          {/* List of Todos */}
          <div className="flex max-h-[55vh] flex-col gap-3.5 overflow-y-auto p-5 bg-muted/15">
            {live.todos.length === 0 && (
              <div className="rounded-xl border border-dashed bg-card py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Belum ada to-do list. Tambahkan item pekerjaan di bawah dan tugaskan ke anggota tim.
                </p>
              </div>
            )}
            {live.todos.map((todo) => (
              <TodoCard
                key={todo.id}
                taskId={live.id}
                todo={todo}
                onPreviewProof={(url) => setPreviewImage(url)}
              />
            ))}
          </div>

          <AddTodoBar taskId={live.id} />
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal for Photo Proof */}
      <Dialog open={Boolean(previewImage)} onOpenChange={(v) => !v && setPreviewImage(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          <div className="flex flex-col bg-background">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Pratinjau Foto Bukti</span>
              <Button size="sm" variant="ghost" onClick={() => setPreviewImage(null)}>
                Tutup
              </Button>
            </div>
            <div className="flex items-center justify-center p-4 bg-muted/30">
              {previewImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewImage}
                  alt="Bukti tugas"
                  className="max-h-[60vh] w-auto rounded-lg object-contain border shadow-md"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TodoCard({
  taskId,
  todo,
  onPreviewProof,
}: {
  taskId: string
  todo: Todo
  onPreviewProof: (url: string) => void
}) {
  const { role, currentUserId, getMember, submitProof, reviewTodo, startTodo } = useStore()
  const isAssignee = todo.assigneeIds.includes(currentUserId)
  const fileRef = useRef<HTMLInputElement>(null)
  const [note, setNote] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [pendingFile, setPendingFile] = useState<{
    name: string
    kind: 'image' | 'file'
    url?: string
  } | null>(null)

  const canUpload =
    role === 'member' &&
    isAssignee &&
    (todo.status === 'todo' || todo.status === 'dikerjakan' || todo.status === 'revisi')
  const canStart = role === 'member' && isAssignee && todo.status === 'todo'
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

  const setSampleProof = (type: 'image' | 'file') => {
    if (type === 'image') {
      setPendingFile({
        name: 'screenshot-hasil-kerja.png',
        kind: 'image',
        url: SAMPLE_SCREENSHOT,
      })
      toast.info('Sampel screenshot terpilih.')
    } else {
      setPendingFile({
        name: 'dokumen-laporan-final.pdf',
        kind: 'file',
      })
      toast.info('Sampel dokumen PDF terpilih.')
    }
  }

  const sendProof = () => {
    if (!pendingFile) {
      toast.error('Pilih foto atau file bukti terlebih dahulu.')
      return
    }
    submitProof(taskId, todo.id, {
      ...pendingFile,
      fileName: pendingFile.name,
      note: note.trim() || undefined,
    })
    toast.success('Bukti berhasil dikirim! Menunggu review & ACC dari admin.')
    setShowUpload(false)
    setPendingFile(null)
    setNote('')
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-2xs transition-all hover:border-primary/30">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
            todo.status === 'selesai'
              ? 'border-success bg-success text-white'
              : 'border-muted-foreground/30 bg-muted/20',
          )}
          aria-hidden
        >
          {todo.status === 'selesai' && <Check className="size-3.5" />}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'font-medium text-sm text-foreground',
                todo.status === 'selesai' && 'text-muted-foreground line-through',
              )}
            >
              {todo.title}
            </span>
            <StatusBadge status={todo.status} className="ml-auto" />
          </div>

          {/* Assignees */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Ditugaskan:</span>
            <div className="flex -space-x-1.5">
              {todo.assigneeIds.map((id) => {
                const m = getMember(id)
                return m ? (
                  <span key={id} title={m.name}>
                    <MemberAvatar member={m} className="size-6 ring-2 ring-card" />
                  </span>
                ) : null
              })}
            </div>
            {isAssignee && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Tugasmu
              </span>
            )}
          </div>

          {/* Attached Proof Card */}
          {todo.proof && (
            <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/40 p-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {todo.proof.kind === 'image' ? (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-info/15 text-info">
                    <ImageIcon className="size-4" />
                  </span>
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <FileText className="size-4" />
                  </span>
                )}
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {todo.proof.fileName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Diunggah oleh {getMember(todo.proof.uploadedBy)?.name ?? 'Anggota'} ·{' '}
                    {todo.proof.uploadedAt}
                  </span>
                </div>
              </div>

              {/* Preview Button */}
              {todo.proof.url ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 shrink-0 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => onPreviewProof(todo.proof!.url!)}
                >
                  <Eye className="size-3.5" />
                  Lihat Foto
                </Button>
              ) : (
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <FileCheck className="size-3 text-success" />
                  Terlampir
                </span>
              )}
            </div>
          )}

          {todo.proof?.note && (
            <p className="rounded-lg bg-card p-2 text-xs text-muted-foreground border italic">
              &quot;{todo.proof.note}&quot;
            </p>
          )}

          {/* Review Note Display */}
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
              <AlertTitle className="text-xs font-semibold">
                {todo.status === 'revisi' ? 'Catatan Revisi dari Admin' : 'Disetujui (ACC) oleh Admin'}
              </AlertTitle>
              <AlertDescription className="text-xs mt-0.5">
                {todo.reviewNote}
              </AlertDescription>
            </Alert>
          )}

          {/* Member Action: Start Working */}
          {canStart && (
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => {
                  startTodo(taskId, todo.id)
                  toast.info('Status diubah ke Sedang Dikerjakan.')
                }}
              >
                <Play className="size-3" />
                Mulai Kerjakan
              </Button>
            </div>
          )}

          {/* Member Action: Upload Proof */}
          {canUpload && !showUpload && (
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10 font-semibold"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="size-3.5" />
                {todo.status === 'revisi' ? 'Kirim Ulang Bukti Revisi' : 'Kirim Bukti Selesai'}
              </Button>
            </div>
          )}

          {canUpload && showUpload && (
            <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3.5">
              <span className="text-xs font-semibold text-foreground">
                Unggah Bukti Hasil Pekerjaan
              </span>

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={onPickFile}
              />

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-card py-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Upload className="size-4 text-primary" />
                {pendingFile ? (
                  <span className="font-semibold text-primary">{pendingFile.name}</span>
                ) : (
                  'Pilih Foto / File dari Komputer'
                )}
              </button>

              {/* Quick sample pickers for testing */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">Atau coba sampel cepat:</span>
                <button
                  type="button"
                  onClick={() => setSampleProof('image')}
                  className="rounded-full border bg-card px-2.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  🖼️ Sampel Screenshot
                </button>
                <button
                  type="button"
                  onClick={() => setSampleProof('file')}
                  className="rounded-full border bg-card px-2.5 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                >
                  📄 Sampel Dokumen
                </button>
              </div>

              {/* Thumbnail preview */}
              {pendingFile?.kind === 'image' && pendingFile.url && (
                <div className="relative mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pendingFile.url}
                    alt="Pratinjau bukti"
                    className="max-h-36 w-full rounded-lg object-contain bg-white border shadow-xs"
                  />
                </div>
              )}

              <Textarea
                placeholder="Tuliskan catatan pengerjaan untuk Admin (opsional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-xs bg-card"
              />

              <div className="flex gap-2">
                <Button size="sm" onClick={sendProof} className="bg-primary text-primary-foreground">
                  <Check className="size-3.5 mr-1" />
                  Kirim Bukti ke Admin
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

          {/* Admin Review Panel (ACC / Revisi) */}
          {canReview && (
            <div className="flex flex-col gap-2.5 rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Panel Review Admin
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Periksa bukti di atas sebelum memutuskan
                </span>
              </div>

              <Textarea
                placeholder="Tuliskan catatan persetujuan atau alasan jika minta revisi..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="text-xs bg-card"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {/* Tombol ACC */}
                <Button
                  size="sm"
                  className="bg-success text-white hover:bg-success/90 font-semibold shadow-xs"
                  onClick={() => {
                    reviewTodo(taskId, todo.id, 'acc', reviewNote.trim() || 'Tugas telah di-ACC. Pekerjaan bagus!')
                    toast.success('Tugas berhasil di-ACC! Progres pekerjaan otomatis bertambah.')
                    setReviewNote('')
                  }}
                >
                  <CheckCheck className="size-4 mr-1" />
                  Setujui (ACC)
                </Button>

                {/* Tombol Minta Revisi */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="font-semibold shadow-xs"
                  onClick={() => {
                    if (!reviewNote.trim()) {
                      toast.error('Mohon isi catatan atau alasan revisi terlebih dahulu.')
                      return
                    }
                    reviewTodo(taskId, todo.id, 'revisi', reviewNote.trim())
                    toast.info('Tugas dikembalikan ke anggota dengan status Perlu Revisi.')
                    setReviewNote('')
                  }}
                >
                  <X className="size-4 mr-1" />
                  Minta Revisi
                </Button>
              </div>
            </div>
          )}

          {role === 'member' && !isAssignee && todo.status !== 'selesai' && (
            <p className="text-[11px] text-muted-foreground italic">
              Kamu tidak ditugaskan pada item pekerjaan ini.
            </p>
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
      toast.error('Pilih minimal satu anggota pelaksana to-do.')
      return
    }
    addTodo(taskId, title.trim(), assignees)
    toast.success('To-do berhasil ditambahkan dan ditugaskan.')
    setTitle('')
    setAssignees([])
    setOpen(false)
  }

  return (
    <div className="border-t bg-card p-4">
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5 font-semibold">
          <Plus className="size-4" />
          Tambah To-Do & Tugaskan Anggota
        </Button>
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3.5">
          <span className="text-xs font-semibold">Tambah Item Pekerjaan Baru</span>
          <Input
            placeholder="Judul to-do, misal: Buat desain banner utama"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xs bg-card"
          />
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <UserPlus className="size-3.5 text-primary" />
              Tugaskan ke Anggota:
            </span>
            <div className="flex flex-wrap gap-1.5">
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
                      'flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-xs transition-all',
                      active
                        ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'border-border bg-card text-foreground hover:bg-muted',
                    )}
                  >
                    <MemberAvatar member={m} className="size-5" />
                    {m.name}
                    {active && <Check className="size-3" />}
                  </button>
                )
              })}
            </div>
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button size="sm" onClick={add} className="bg-primary text-primary-foreground font-semibold">
              Simpan & Tugaskan
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
