export type Role = 'admin' | 'member'

export type Member = {
  id: string
  name: string
  initials: string
  color: string
  online: boolean
}

export type RoomType = 'tugas' | 'jadwal' | 'suara' | 'chat'

export type Room = {
  id: string
  serverId: string
  name: string
  type: RoomType
}

export type Server = {
  id: string
  name: string
  short: string
  color: string
  memberIds: string[]
}

export type TodoStatus = 'todo' | 'dikerjakan' | 'review' | 'revisi' | 'selesai'

export type Proof = {
  kind: 'image' | 'file'
  fileName: string
  url?: string
  note?: string
  uploadedAt: string
  uploadedBy: string
}

export type Todo = {
  id: string
  title: string
  assigneeIds: string[]
  status: TodoStatus
  proof?: Proof
  reviewNote?: string
}

export type Task = {
  id: string
  roomId: string
  title: string
  description: string
  dueDate: string
  todos: Todo[]
}

export type AlarmResponseStatus = 'aktif' | 'dimatikan'

export type AlarmResponse = {
  memberId: string
  status: AlarmResponseStatus
  updatedAt?: string
}

export type Alarm = {
  id: string
  roomId: string
  title: string
  note: string
  time: string
  date: string
  repeat: 'sekali' | 'harian' | 'mingguan'
  responses: AlarmResponse[]
}

export type VoiceParticipant = {
  memberId: string
  muted: boolean
  speaking: boolean
}

export type ChatMessage = {
  id: string
  roomId: string
  senderId: string
  text: string
  createdAt: string
}
