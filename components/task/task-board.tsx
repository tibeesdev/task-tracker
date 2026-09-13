'use client'

import { useState } from 'react'
import { Calendar, ListTodo } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { StatusBadge } from '@/components/status-badge'
import { MemberAvatar } from '@/components/member-avatar'
import { CreateTaskDialog } from './create-task-dialog'
import { TaskDetailDialog } from './task-detail-dialog'
import { useStore, taskProgress } from '@/lib/store'
import type { Task, TodoStatus } from '@/lib/types'

const priority: TodoStatus[] = ['revisi', 'review', 'dikerjakan', 'todo', 'selesai']

function nextAction(task: Task): TodoStatus | null {
  for (const s of priority) {
    if (task.todos.some((t) => t.status === s)) return s
  }
  return null
}

export function TaskBoard({ roomId }: { roomId: string }) {
  const { tasks, role, getMember } = useStore()
  const roomTasks = tasks.filter((t) => t.roomId === roomId)
  const [selected, setSelected] = useState<Task | null>(null)
  const [open, setOpen] = useState(false)

  const openTask = (t: Task) => {
    setSelected(t)
    setOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">Daftar Tugas</h2>
          <p className="text-sm text-muted-foreground">
            {roomTasks.length} tugas · klik kartu untuk lihat to-do dan kirim bukti
          </p>
        </div>
        {role === 'admin' && <CreateTaskDialog roomId={roomId} />}
      </div>

      {roomTasks.length === 0 ? (
        <div className="px-6">
          <Empty className="rounded-xl border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListTodo />
              </EmptyMedia>
              <EmptyTitle>Belum ada tugas</EmptyTitle>
              <EmptyDescription>
                {role === 'admin'
                  ? 'Buat tugas pertama dan mulai bagikan pekerjaan ke anggota.'
                  : 'Admin belum membuat tugas di room ini.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-6 pb-6 md:grid-cols-2 2xl:grid-cols-3">
          {roomTasks.map((task) => {
            const progress = taskProgress(task)
            const action = nextAction(task)
            const assignees = Array.from(new Set(task.todos.flatMap((t) => t.assigneeIds)))
            return (
              <Card
                key={task.id}
                onClick={() => openTask(task)}
                className="cursor-pointer gap-0 transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-balance">{task.title}</CardTitle>
                    {action && <StatusBadge status={action} />}
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progres</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ListTodo className="size-3.5" />
                    {task.todos.filter((t) => t.status === 'selesai').length}/{task.todos.length} to-do
                    selesai
                  </div>
                </CardContent>
                <CardFooter className="mt-4 justify-between">
                  <div className="flex -space-x-2">
                    {assignees.slice(0, 4).map((id) => {
                      const m = getMember(id)
                      return m ? (
                        <MemberAvatar key={id} member={m} className="size-7 ring-2 ring-card" />
                      ) : null
                    })}
                    {assignees.length > 4 && (
                      <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold ring-2 ring-card">
                        +{assignees.length - 4}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
