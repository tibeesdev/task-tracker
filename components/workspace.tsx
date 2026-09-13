'use client'

import { useStore } from '@/lib/store'
import { TopBar } from '@/components/top-bar'
import { MembersPanel } from '@/components/members-panel'
import { TaskBoard } from '@/components/task/task-board'
import { AlarmView } from '@/components/alarm/alarm-view'
import { VoiceView } from '@/components/voice/voice-view'
import { ChatView } from '@/components/chat/chat-view'

export function Workspace() {
  const { rooms, activeRoomId } = useStore()
  const room = rooms.find((r) => r.id === activeRoomId)

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col bg-background">
          {room?.type === 'chat' && <ChatView key={room.id} roomId={room.id} />}
          {room?.type === 'tugas' && <TaskBoard key={room.id} roomId={room.id} />}
          {room?.type === 'jadwal' && <AlarmView key={room.id} roomId={room.id} />}
          {room?.type === 'suara' && <VoiceView key={room.id} roomId={room.id} />}
        </main>
        {(room?.type === 'tugas' || room?.type === 'chat') && <MembersPanel />}
      </div>
    </div>
  )
}

