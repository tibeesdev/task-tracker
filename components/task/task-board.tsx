'use client'

import { useState } from 'react'
import {
  Calendar,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { StatusBadge } from '@/components/status-badge'
import { MemberAvatar } from '@/components/member-avatar'
import { CreateTaskDialog } from './create-task-dialog'
import { TaskDetailDialog } from './task-detail-dialog'
import { useStore, taskProgress } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Task, TodoStatus } from '@/lib/types'

const priority: TodoStatus[] = ['revisi', 'review', 'dikerjakan', 'todo', 'selesai']

function nextAction(task: Task): TodoStatus | null {
  for (const s of priority) {
    if (task.todos.some((t) => t.status === s)) return s
  }
  return null
}

export function TaskBoard({ roomId }: { roomId: string }) {
  const { tasks, role, currentUserId, getMember } = useStore()
  const roomTasks = tasks.filter((t) => t.roomId === roomId)
  const [selected, setSelected] = useState<Task | null>(null)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'mine' | 'review' | 'done'>('all')

  const openTask = (t: Task) => {
    setSelected(t)
    setOpen(true)
  }

  // Summary counts
  const totalTasks = roomTasks.length
  const reviewCount = roomTasks.reduce(
    (acc, t) => acc + t.todos.filter((td) => td.status === 'review').length,
    0,
  )
  const revisionCount = roomTasks.reduce(
    (acc, t) => acc + t.todos.filter((td) => td.status === 'revisi').length,
    0,
  )
  const completedTasks = roomTasks.filter(
    (t) => t.todos.length > 0 && taskProgress(t) === 100,
  ).length

  // Filter logic
  const filteredTasks = roomTasks.filter((task) => {
    if (filter === 'mine') {
      return task.todos.some((td) => td.assigneeIds.includes(currentUserId))
    }
    if (filter === 'review') {
      return task.todos.some((td) => td.status === 'review')
    }
    if (filter === 'done') {
      return task.todos.length > 0 && taskProgress(task) === 100
    }
    return true
  })

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card/60 px-6 py-4 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">Daftar Jobdesk & Penugasan Tim</h2>
            <Badge variant="secondary" className="font-bold bg-primary/10 text-primary">
              {roomTasks.length} Jobdesk
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sistem akuntabilitas resmi: pembagian jobdesk anggota, pengumpulan bukti kerja, dan verifikasi ACC / Revisi Admin.
          </p>
        </div>
        {role === 'admin' && <CreateTaskDialog roomId={roomId} />}
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 gap-3 border-b bg-muted/20 px-6 py-3 sm:grid-cols-4">
        <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ListTodo className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Tugas</span>
            <span className="text-sm font-bold">{totalTasks}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <Clock className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Menunggu ACC</span>
            <span className="text-sm font-bold text-amber-600">{reviewCount} to-do</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Perlu Revisi</span>
            <span className="text-sm font-bold text-destructive">{revisionCount} to-do</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Tuntas 100%</span>
            <span className="text-sm font-bold text-success">{completedTasks} tugas</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 px-6 pt-4 pb-2">
        <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Filter className="size-3" />
          Filter:
        </span>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition-all',
            filter === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'border bg-card text-muted-foreground hover:bg-muted',
          )}
        >
          Semua Jobdesk ({roomTasks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('mine')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition-all',
            filter === 'mine'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'border bg-card text-muted-foreground hover:bg-muted',
          )}
        >
          Jobdesk Saya
        </button>
        <button
          type="button"
          onClick={() => setFilter('review')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition-all',
            filter === 'review'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'border bg-card text-muted-foreground hover:bg-muted',
          )}
        >
          Butuh ACC {reviewCount > 0 && `(${reviewCount})`}
        </button>
        <button
          type="button"
          onClick={() => setFilter('done')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition-all',
            filter === 'done'
              ? 'bg-success text-white shadow-xs'
              : 'border bg-card text-muted-foreground hover:bg-muted',
          )}
        >
          Tuntas ({completedTasks})
        </button>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="p-6">
          <Empty className="rounded-xl border border-dashed bg-card/50">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListTodo />
              </EmptyMedia>
              <EmptyTitle>
                {filter === 'all' ? 'Belum ada jobdesk di ruang kerja ini' : 'Tidak ada jobdesk yang sesuai filter'}
              </EmptyTitle>
              <EmptyDescription>
                {filter !== 'all' ? (
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className="font-semibold text-primary underline"
                  >
                    Reset filter ke semua jobdesk
                  </button>
                ) : role === 'admin' ? (
                  'Buat jobdesk pertama dan mulai bagikan tanggung jawab ke anggota tim.'
                ) : (
                  'Admin belum membuat jobdesk di ruang kerja ini.'
                )}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4.5 p-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredTasks.map((task) => {
            const progress = taskProgress(task)
            const action = nextAction(task)
            const assignees = Array.from(new Set(task.todos.flatMap((t) => t.assigneeIds)))
            const doneTodos = task.todos.filter((t) => t.status === 'selesai').length
            const isFinished = task.todos.length > 0 && progress === 100

            return (
              <Card
                key={task.id}
                onClick={() => openTask(task)}
                className="group relative cursor-pointer gap-0 overflow-hidden border shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                {isFinished && (
                  <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden">
                    <span className="absolute top-1.5 -right-3 block w-14 rotate-45 bg-success text-center text-[9px] font-bold text-white shadow-xs">
                      ACC
                    </span>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 pr-6">
                    <CardTitle className="text-balance font-bold leading-snug group-hover:text-primary transition-colors">
                      {task.title}
                    </CardTitle>
                    {action && <StatusBadge status={action} />}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed mt-1">
                    {task.description || 'Tanpa deskripsi rinci.'}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col gap-3 py-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">Progres Jobdesk</span>
                    <span
                      className={cn(
                        'font-bold',
                        isFinished ? 'text-success' : 'text-primary',
                      )}
                    >
                      {progress}%
                    </span>
                  </div>

                  <Progress
                    value={progress}
                    className="h-2 rounded-full overflow-hidden bg-muted"
                  />

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ListTodo className="size-3.5 text-primary" />
                      {doneTodos} dari {task.todos.length} to-do ACC
                    </span>
                    {task.todos.some((t) => t.status === 'review') && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-600">
                        Menunggu review
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="mt-2 justify-between border-t bg-muted/20 pt-3 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground font-medium">Tim:</span>
                    <div className="flex -space-x-2">
                      {assignees.length === 0 ? (
                        <span className="text-[11px] italic text-muted-foreground">Belum ditugaskan</span>
                      ) : (
                        assignees.slice(0, 4).map((id) => {
                          const m = getMember(id)
                          return m ? (
                            <MemberAvatar key={id} member={m} className="size-6 ring-2 ring-card" />
                          ) : null
                        })
                      )}
                      {assignees.length > 4 && (
                        <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold ring-2 ring-card">
                          +{assignees.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {task.dueDate}
                  </span>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      <TaskDetailDialog task={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}
