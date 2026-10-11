'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { usePersistedState } from './use-persisted-state'
import type {
  Alarm,
  ChatMessage,
  Member,
  Role,
  Room,
  RoomType,
  Server,
  Task,
  Todo,
  TodoStatus,
  VoiceParticipant,
} from './types'
import { playAlarmChime } from './sound'
import { toast } from 'sonner'

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
  activeServerId: string
  activeRoomId: string
  setActiveServer: (id: string) => void
  setActiveRoom: (id: string) => void
  getMember: (id: string) => Member | undefined
  // auth
  login: (userId: string) => void
  logout: () => void
  // servers & rooms
  addServer: (name: string) => void
  addRoom: (serverId: string, name: string, type: RoomType) => void
  // tasks
  addTask: (roomId: string, title: string, description: string, dueDate: string) => void
  deleteTask: (taskId: string) => void
  addTodo: (taskId: string, title: string, assigneeIds: string[]) => void
  startTodo: (taskId: string, todoId: string) => void
  submitProof: (
    taskId: string,
    todoId: string,
    proof: { kind: 'image' | 'file'; fileName: string; url?: string; note?: string },
  ) => void
  reviewTodo: (taskId: string, todoId: string, decision: 'acc' | 'revisi', note: string) => void
  // alarms & schedule
  addAlarm: (
    roomId: string,
    data: { title: string; note: string; time: string; date: string; repeat: Alarm['repeat'] },
  ) => void
  setAlarmResponse: (alarmId: string, memberId: string, status: 'aktif' | 'dimatikan') => void
  activeAlarmModal: Alarm | null
  triggerAlarm: (alarmId: string) => void
  dismissActiveAlarm: () => void
  simulateOtherMembersAlarm: (alarmId: string) => void
  // voice
  joinVoice: (roomId: string) => void
  leaveVoice: (roomId: string) => void
  toggleMute: (roomId: string) => void
  toggleVoiceSpeaking: (roomId: string, memberId?: string) => void
  // chat
  sendMessage: (roomId: string, text: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({
  children,
  initialUserId = CURRENT_USER_ID,
}: {
  children: ReactNode
  initialUserId?: string
}) {
  const [members] = useState<Member[]>(seedMembers)
  const [servers, setServers] = usePersistedState<Server[]>('tt:servers', seedServers)
  const [rooms, setRooms] = usePersistedState<Room[]>('tt:rooms', seedRooms)
  const [tasks, setTasks] = usePersistedState<Task[]>('tt:tasks', seedTasks)
  const [alarms, setAlarms] = usePersistedState<Alarm[]>('tt:alarms', seedAlarms)
  const [voice, setVoice] = useState<Record<string, VoiceParticipant[]>>(initialVoice)
  const [messages, setMessages] = usePersistedState<ChatMessage[]>('tt:messages', seedMessages)
  const [currentUserId, setCurrentUserId] = useState<string>(initialUserId)
  const [activeServerId, setActiveServerId] = useState<string>(seedServers[0].id)
  const [activeRoomId, setActiveRoomId] = useState<string>('r-produk-tugas')
  const [activeAlarmModal, setActiveAlarmModal] = useState<Alarm | null>(null)

  // Derive role from server ownership — no manual toggle needed
  const activeServer = servers.find((s) => s.id === activeServerId) ?? servers[0]
  const role: Role = activeServer?.ownerId === currentUserId ? 'admin' : 'member'

  const setActiveServer = (id: string) => {
    setActiveServerId(id)
    const firstRoom = rooms.find((r) => r.serverId === id)
    if (firstRoom) setActiveRoomId(firstRoom.id)
  }

  const getMember = (id: string) => members.find((m) => m.id === id)

  // --- Auth ---
  const login = (userId: string) => {
    setCurrentUserId(userId)
    setActiveServerId(seedServers[0].id)
    setActiveRoomId('r-produk-tugas')
  }

  const logout = () => {
    setCurrentUserId(CURRENT_USER_ID)
  }

  // --- Servers & Rooms ---
  const addServer = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = `s-${uid()}`
    const short = trimmed.slice(0, 2).toUpperCase()
    const colors = [
      'oklch(0.56 0.2 285)',
      'oklch(0.65 0.18 20)',
      'oklch(0.63 0.16 155)',
      'oklch(0.7 0.15 60)',
      'oklch(0.62 0.15 245)',
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]
    setServers((prev) => [
      ...prev,
      {
        id,
        name: trimmed,
        short,
        color,
        ownerId: currentUserId,
        memberIds: [currentUserId, 'u-nadia', 'u-bagas', 'u-sari', 'u-dimas', 'u-rina', 'u-fajar'],
      },
    ])
    // buat default rooms
    const defaultRooms: Room[] = [
      { id: `r-${uid()}`, serverId: id, name: 'obrolan-umum', type: 'chat' },
      { id: `r-${uid()}`, serverId: id, name: 'Tugas Utama', type: 'tugas' },
      { id: `r-${uid()}`, serverId: id, name: 'Jadwal & Alarm', type: 'jadwal' },
      { id: `r-${uid()}`, serverId: id, name: 'Ruang Diskusi', type: 'suara' },
    ]
    setRooms((prev) => [...prev, ...defaultRooms])
    setActiveServerId(id)
    setActiveRoomId(defaultRooms[1].id)
  }

  const addRoom = (serverId: string, name: string, type: RoomType) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = `r-${uid()}`
    setRooms((prev) => [...prev, { id, serverId, name: trimmed, type }])
    setActiveRoomId(id)
  }

  // --- Tasks ---
  const addTask = (roomId: string, title: string, description: string, dueDate: string) => {
    setTasks((prev) => [
      { id: uid(), roomId, title, description, dueDate, todos: [] },
      ...prev,
    ])
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
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

  const startTodo = (taskId: string, todoId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              todos: t.todos.map((td) =>
                td.id === todoId && (td.status === 'todo')
                  ? { ...td, status: 'dikerjakan' as TodoStatus }
                  : td,
              ),
            }
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
                        uploadedBy: currentUserId,
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

  const triggerAlarm = (alarmId: string) => {
    const found = alarms.find((a) => a.id === alarmId)
    if (found) {
      setActiveAlarmModal(found)
      playAlarmChime()
      toast.warning(`⏰ ALARM BERBUNYI: ${found.title}`, {
        description: found.note || 'Alarm ini aktif berdering untuk semua anggota room.',
        duration: 8000,
      })
    }
  }

  const dismissActiveAlarm = () => {
    if (activeAlarmModal) {
      setAlarmResponse(activeAlarmModal.id, currentUserId, 'dimatikan')
      setActiveAlarmModal(null)
      toast.success('Kamu berhasil mematikan alarm.')
    }
  }

  const simulateOtherMembersAlarm = (alarmId: string) => {
    const alarm = alarms.find((a) => a.id === alarmId)
    if (!alarm) return
    const activeOthers = alarm.responses.filter(
      (r) => r.memberId !== currentUserId && r.status === 'aktif',
    )
    if (activeOthers.length === 0) {
      // Reset status anggota lain agar bisa diuji coba berulang
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === alarmId
            ? {
                ...a,
                responses: a.responses.map((r) =>
                  r.memberId !== currentUserId
                    ? { ...r, status: 'aktif' as const, updatedAt: undefined }
                    : r,
                ),
              }
            : a,
        ),
      )
      toast.info('Status anggota lain direset ke aktif berdering untuk pengujian ulang.')
      return
    }
    const target = activeOthers[Math.floor(Math.random() * activeOthers.length)]
    setAlarmResponse(alarmId, target.memberId, 'dimatikan')
    const targetMember = getMember(target.memberId)
    toast.info(`🔔 ${targetMember?.name ?? 'Anggota'} baru saja mematikan alarmnya.`)
  }

  const joinVoice = (roomId: string) => {
    setVoice((prev) => {
      const list = prev[roomId] ?? []
      if (list.some((p) => p.memberId === currentUserId)) return prev
      return { ...prev, [roomId]: [...list, { memberId: currentUserId, muted: false, speaking: false }] }
    })
  }

  const leaveVoice = (roomId: string) => {
    setVoice((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] ?? []).filter((p) => p.memberId !== currentUserId),
    }))
  }

  const toggleMute = (roomId: string) => {
    setVoice((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] ?? []).map((p) =>
        p.memberId === currentUserId ? { ...p, muted: !p.muted } : p,
      ),
    }))
  }

  const toggleVoiceSpeaking = (roomId: string, memberId?: string) => {
    const targetId = memberId ?? CURRENT_USER_ID
    setVoice((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] ?? []).map((p) =>
        p.memberId === targetId ? { ...p, speaking: !p.speaking } : p,
      ),
    }))
  }

  const sendMessage: StoreValue['sendMessage'] = (roomId, text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: uid(), roomId, senderId: currentUserId, text: trimmed, createdAt: nowTime() },
    ])
  }

  // --- Alarm notifications ---
  const firedRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      const currentDate = now.toISOString().slice(0, 10)
      alarms.forEach((alarm) => {
        const key = `${alarm.id}-${currentDate}-${alarm.time}`
        if (firedRef.current.has(key)) return
        const myResponse = alarm.responses.find((r) => r.memberId === currentUserId)
        if (!myResponse || myResponse.status !== 'aktif') return
        if (alarm.time === currentTime && alarm.date <= currentDate) {
          firedRef.current.add(key)
          setActiveAlarmModal(alarm)
          playAlarmChime()
          toast.warning(`⏰ ${alarm.title}`, { description: alarm.note, duration: 10000 })
        }
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [alarms])

  const value = useMemo<StoreValue>(
    () => ({
      members,
      servers,
      rooms,
      tasks,
      alarms,
      voice,
      messages,
      currentUserId,
      role,
      activeServerId,
      activeRoomId,
      setActiveServer,
      setActiveRoom: setActiveRoomId,
      getMember,
      login,
      logout,
      addServer,
      addRoom,
      addTask,
      deleteTask,
      addTodo,
      startTodo,
      submitProof,
      reviewTodo,
      addAlarm,
      setAlarmResponse,
      activeAlarmModal,
      triggerAlarm,
      dismissActiveAlarm,
      simulateOtherMembersAlarm,
      joinVoice,
      leaveVoice,
      toggleMute,
      toggleVoiceSpeaking,
      sendMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [members, servers, rooms, tasks, alarms, voice, messages, currentUserId, role, activeServerId, activeRoomId, activeAlarmModal],
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
