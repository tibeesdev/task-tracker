'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  members as seedMembers,
  servers as seedServers,
  rooms as seedRooms,
  tasks as seedTasks,
  alarms as seedAlarms,
  initialVoice,
  messages as seedMessages,
  CURRENT_USER_ID,
} from './mock-data'
import type {
  Alarm,
  ChatMessage,
  Member,
  Role,
  Room,
  Server,
  Task,
  Todo,
  TodoStatus,
  VoiceParticipant,
} from './types'

const uid = () => Math.random().toString(36).slice(2, 9)
const nowTime = () =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

type StoreValue = {
  members: Member[]
  servers: Server[]
  rooms: Room[]
  tasks: Task[]
  alarms: Alarm[]
  voice: Record<string, VoiceParticipant[]>
  messages: ChatMessage[]
  currentUserId: string
  role: Role
  setRole: (r: Role) => void
  activeServerId: string
  activeRoomId: string
  setActiveServer: (id: string) => void
  setActiveRoom: (id: string) => void
  getMember: (id: string) => Member | undefined
  // tasks
  addTask: (roomId: string, title: string, description: string, dueDate: string) => void
  addTodo: (taskId: string, title: string, assigneeIds: string[]) => void
  submitProof: (
    taskId: string,
    todoId: string,
    proof: { kind: 'image' | 'file'; fileName: string; url?: string; note?: string },
  ) => void
  reviewTodo: (taskId: string, todoId: string, decision: 'acc' | 'revisi', note: string) => void
  // alarms
  addAlarm: (
    roomId: string,
    data: { title: string; note: string; time: string; date: string; repeat: Alarm['repeat'] },
  ) => void
  setAlarmResponse: (alarmId: string, memberId: string, status: 'aktif' | 'dimatikan') => void
  // voice
  joinVoice: (roomId: string) => void
  leaveVoice: (roomId: string) => void
  toggleMute: (roomId: string) => void
  // chat
  sendMessage: (roomId: string, text: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [members] = useState<Member[]>(seedMembers)
  const [servers] = useState<Server[]>(seedServers)
  const [rooms] = useState<Room[]>(seedRooms)
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [alarms, setAlarms] = useState<Alarm[]>(seedAlarms)
  const [voice, setVoice] = useState<Record<string, VoiceParticipant[]>>(initialVoice)
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages)
  const [role, setRole] = useState<Role>('admin')
  const [activeServerId, setActiveServerId] = useState<string>(seedServers[0].id)
  const [activeRoomId, setActiveRoomId] = useState<string>('r-produk-tugas')

  const setActiveServer = (id: string) => {
    setActiveServerId(id)
    const firstRoom = seedRooms.find((r) => r.serverId === id)
    if (firstRoom) setActiveRoomId(firstRoom.id)
  }

  const getMember = (id: string) => members.find((m) => m.id === id)

  const addTask = (roomId: string, title: string, description: string, dueDate: string) => {
    setTasks((prev) => [
      { id: uid(), roomId, title, description, dueDate, todos: [] },
      ...prev,
    ])
  }

  const addTodo = (taskId: string, title: string, assigneeIds: string[]) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, todos: [...t.todos, { id: uid(), title, assigneeIds, status: 'todo' as TodoStatus }] }
          : t,
      ),
    )
  }

  const submitProof: StoreValue['submitProof'] = (taskId, todoId, proof) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              todos: t.todos.map((td) =>
                td.id === todoId
                  ? {
                      ...td,
                      status: 'review',
                      reviewNote: undefined,
                      proof: {
                        ...proof,
                        uploadedAt: nowTime(),
                        uploadedBy: CURRENT_USER_ID,
                      },
                    }
                  : td,
              ),
            }
          : t,
      ),
    )
  }

  const reviewTodo: StoreValue['reviewTodo'] = (taskId, todoId, decision, note) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              todos: t.todos.map((td) =>
                td.id === todoId
                  ? {
                      ...td,
                      status: decision === 'acc' ? 'selesai' : 'revisi',
                      reviewNote: note,
                    }
                  : td,
              ),
            }
          : t,
      ),
    )
  }

  const addAlarm: StoreValue['addAlarm'] = (roomId, data) => {
    const room = rooms.find((r) => r.id === roomId)
    const server = servers.find((s) => s.id === room?.serverId)
    const responses =
      server?.memberIds.map((memberId) => ({ memberId, status: 'aktif' as const })) ?? []
    setAlarms((prev) => [{ id: uid(), roomId, ...data, responses }, ...prev])
  }

  const setAlarmResponse: StoreValue['setAlarmResponse'] = (alarmId, memberId, status) => {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              responses: a.responses.map((r) =>
                r.memberId === memberId ? { ...r, status, updatedAt: nowTime() } : r,
              ),
            }
          : a,
      ),
    )
  }

  const joinVoice = (roomId: string) => {
    setVoice((prev) => {
      const list = prev[roomId] ?? []
      if (list.some((p) => p.memberId === CURRENT_USER_ID)) return prev
      return { ...prev, [roomId]: [...list, { memberId: CURRENT_USER_ID, muted: false, speaking: false }] }
    })
  }

  const leaveVoice = (roomId: string) => {
    setVoice((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] ?? []).filter((p) => p.memberId !== CURRENT_USER_ID),
    }))
  }

  const toggleMute = (roomId: string) => {
    setVoice((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] ?? []).map((p) =>
        p.memberId === CURRENT_USER_ID ? { ...p, muted: !p.muted } : p,
      ),
    }))
  }

  const sendMessage: StoreValue['sendMessage'] = (roomId, text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: uid(), roomId, senderId: CURRENT_USER_ID, text: trimmed, createdAt: nowTime() },
    ])
  }

  const value = useMemo<StoreValue>(
    () => ({
      members,
      servers,
      rooms,
      tasks,
      alarms,
      voice,
      messages,
      currentUserId: CURRENT_USER_ID,
      role,
      setRole,
      activeServerId,
      activeRoomId,
      setActiveServer,
      setActiveRoom: setActiveRoomId,
      getMember,
      addTask,
      addTodo,
      submitProof,
      reviewTodo,
      addAlarm,
      setAlarmResponse,
      joinVoice,
      leaveVoice,
      toggleMute,
      sendMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [members, servers, rooms, tasks, alarms, voice, messages, role, activeServerId, activeRoomId],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore harus dipakai di dalam StoreProvider')
  return ctx
}

export function taskProgress(task: Task): number {
  if (task.todos.length === 0) return 0
  const done = task.todos.filter((t) => t.status === 'selesai').length
  return Math.round((done / task.todos.length) * 100)
}

export const statusLabel: Record<TodoStatus, string> = {
  todo: 'Belum mulai',
  dikerjakan: 'Dikerjakan',
  review: 'Menunggu review',
  revisi: 'Perlu revisi',
  selesai: 'Selesai',
}

export function todoOfCurrentUser(todo: Todo, userId: string) {
  return todo.assigneeIds.includes(userId)
}
