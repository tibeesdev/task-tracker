'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Hash, SendHorizontal } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
} from '@/components/ui/input-group'
import { MemberAvatar } from '@/components/member-avatar'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/types'

export function ChatView({ roomId }: { roomId: string }) {
  const { rooms, messages, getMember, sendMessage, currentUserId } = useStore()
  const room = rooms.find((r) => r.id === roomId)
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const roomMessages = useMemo(
    () => messages.filter((m) => m.roomId === roomId),
    [messages, roomId],
  )

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [roomMessages.length, roomId])

  const send = () => {
    if (!draft.trim()) return
    sendMessage(roomId, draft)
    setDraft('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-5">
        <Hash className="size-5 text-muted-foreground" />
        <span className="font-semibold">{room?.name}</span>
        <span className="ml-2 hidden text-sm text-muted-foreground sm:inline">
          Ngobrol santai bareng anggota tim
        </span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div ref={scrollRef} className="flex flex-col gap-1 p-4">
          <div className="mb-4 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-2 font-semibold">
              <Hash className="size-4 text-primary" />
              Selamat datang di #{room?.name}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Ini awal dari percakapan. Sapa teman satu timmu!
            </p>
          </div>
          {roomMessages.map((msg, i) => {
            const prev = roomMessages[i - 1]
            const grouped = prev && prev.senderId === msg.senderId
            return (
              <MessageRow
                key={msg.id}
                message={msg}
                grouped={grouped}
                mine={msg.senderId === currentUserId}
                name={getMember(msg.senderId)?.name ?? 'Anggota'}
              />
            )
          })}
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t bg-background p-4">
        <InputGroup>
          <InputGroupTextarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Kirim pesan ke #${room?.name}`}
            className="min-h-11"
            aria-label="Tulis pesan"
          />
          <InputGroupAddon align="inline-end">
            <Button
              size="icon"
              onClick={send}
              disabled={!draft.trim()}
              aria-label="Kirim pesan"
            >
              <SendHorizontal />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Tekan Enter untuk mengirim, Shift + Enter untuk baris baru.
        </p>
      </div>
    </div>
  )
}

function MessageRow({
  message,
  grouped,
  mine,
  name,
}: {
  message: ChatMessage
  grouped: boolean
  mine: boolean
  name: string
}) {
  const { getMember } = useStore()
  const member = getMember(message.senderId)

  if (mine) {
    return (
      <div className={cn('flex flex-col items-end gap-1', grouped ? 'mt-1' : 'mt-3')}>
        {!grouped && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] text-muted-foreground">{message.createdAt}</span>
            <span className="text-xs font-semibold text-primary">{name} (Anda)</span>
          </div>
        )}
        <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-primary px-4 py-2.5 text-sm font-normal text-primary-foreground shadow-xs sm:max-w-[70%]">
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-2.5', grouped ? 'mt-1 pl-10' : 'mt-3')}>
      {!grouped && (
        member ? (
          <MemberAvatar member={member} className="mt-1 size-8 shrink-0" />
        ) : (
          <div className="mt-1 size-8 shrink-0 rounded-full bg-muted" />
        )
      )}
      <div className="flex max-w-[85%] flex-col items-start gap-1 sm:max-w-[70%]">
        {!grouped && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold text-foreground">{name}</span>
            <span className="text-[11px] text-muted-foreground">{message.createdAt}</span>
          </div>
        )}
        <div className="rounded-2xl rounded-tl-xs border bg-muted/80 px-4 py-2.5 text-sm text-foreground shadow-xs">
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
        </div>
      </div>
    </div>
  )
}
