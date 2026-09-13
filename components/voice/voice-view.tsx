'use client'

import { Mic, MicOff, PhoneOff, Headphones, Volume2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { MemberAvatar } from '@/components/member-avatar'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function VoiceView({ roomId }: { roomId: string }) {
  const { rooms, voice, currentUserId, getMember, joinVoice, leaveVoice, toggleMute } = useStore()
  const room = rooms.find((r) => r.id === roomId)
  const participants = voice[roomId] ?? []
  const me = participants.find((p) => p.memberId === currentUserId)
  const joined = Boolean(me)

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-muted/30">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Volume2 className="size-5 text-primary" />
          <h2 className="text-base font-semibold">{room?.name}</h2>
          <span className="ml-2 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
            {participants.length} tersambung
          </span>
        </div>

        {participants.length === 0 ? (
          <Empty className="flex-1 rounded-2xl border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Headphones />
              </EmptyMedia>
              <EmptyTitle>Ruang suara masih kosong</EmptyTitle>
              <EmptyDescription>
                Jadilah yang pertama bergabung dan mulai diskusi dengan tim.
              </EmptyDescription>
            </EmptyHeader>
            <Button onClick={() => joinVoice(roomId)}>
              <LogIn data-icon="inline-start" />
              Gabung ke Voice
            </Button>
          </Empty>
        ) : (
          <div className="grid flex-1 grid-cols-2 content-start gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {participants.map((p) => {
              const m = getMember(p.memberId)
              if (!m) return null
              const isMe = p.memberId === currentUserId
              return (
                <div
                  key={p.memberId}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 transition-all',
                    p.speaking && 'ring-2 ring-success ring-offset-2',
                  )}
                >
                  <div className="relative">
                    <span
                      className={cn(
                        'flex items-center justify-center rounded-full p-1 transition-all',
                        p.speaking ? 'bg-success/20' : 'bg-transparent',
                      )}
                    >
                      <MemberAvatar member={m} className="size-16 text-lg" />
                    </span>
                    <span
                      className={cn(
                        'absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card text-white',
                        p.muted ? 'bg-destructive' : 'bg-success',
                      )}
                    >
                      {p.muted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {m.name}
                    {isMe && ' (kamu)'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Kontrol bawah */}
      <div className="sticky bottom-0 border-t bg-card/80 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-center gap-3">
          {joined ? (
            <>
              <Button
                variant={me?.muted ? 'destructive' : 'outline'}
                size="lg"
                className="rounded-full"
                onClick={() => toggleMute(roomId)}
              >
                {me?.muted ? <MicOff data-icon="inline-start" /> : <Mic data-icon="inline-start" />}
                {me?.muted ? 'Bunyikan' : 'Bisukan'}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full"
                onClick={() => {
                  leaveVoice(roomId)
                  toast.info('Kamu keluar dari voice chat.')
                }}
              >
                <PhoneOff data-icon="inline-start" />
                Keluar
              </Button>
            </>
          ) : (
            <Button size="lg" className="rounded-full" onClick={() => joinVoice(roomId)}>
              <LogIn data-icon="inline-start" />
              Gabung ke Voice
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Voice chat masih tampilan demo — kontrol berfungsi, audio real-time menyusul.
        </p>
      </div>
    </div>
  )
}
