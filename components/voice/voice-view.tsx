'use client'

import {
  Mic,
  MicOff,
  PhoneOff,
  Headphones,
  Volume2,
  LogIn,
  Activity,
  Radio,
  Wifi,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { MemberAvatar } from '@/components/member-avatar'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function VoiceView({ roomId }: { roomId: string }) {
  const {
    rooms,
    voice,
    currentUserId,
    getMember,
    joinVoice,
    leaveVoice,
    toggleMute,
    toggleVoiceSpeaking,
  } = useStore()

  const room = rooms.find((r) => r.id === roomId)
  const participants = voice[roomId] ?? []
  const me = participants.find((p) => p.memberId === currentUserId)
  const joined = Boolean(me)

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-muted/20">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card/70 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Volume2 className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold">{room?.name}</h2>
            <p className="text-xs text-muted-foreground">
              Diskusi audio grup tanpa hambatan untuk koordinasi tim.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success font-semibold">
            <Wifi className="size-3" />
            18ms · Audio HD
          </Badge>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {participants.length} Terhubung
          </span>
        </div>
      </div>

      {/* Main audio stage */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col p-6">
        {participants.length === 0 ? (
          <Empty className="flex-1 rounded-2xl border border-dashed bg-card/60 p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Headphones className="text-primary" />
              </EmptyMedia>
              <EmptyTitle>Ruang voice chat masih kosong</EmptyTitle>
              <EmptyDescription>
                Klik tombol di bawah untuk bergabung dan mulai mengobrol bersama rekan tim.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              size="lg"
              onClick={() => {
                joinVoice(roomId)
                toast.success('Kamu terhubung ke ruang suara.')
              }}
              className="mt-2 bg-primary text-primary-foreground font-semibold shadow-md"
            >
              <LogIn className="size-4 mr-2" />
              Gabung ke Ruang Suara
            </Button>
          </Empty>
        ) : (
          <div className="flex flex-1 flex-col gap-5">
            {/* Grid of participants */}
            <div className="grid flex-1 grid-cols-2 content-start gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {participants.map((p) => {
                const m = getMember(p.memberId)
                if (!m) return null
                const isMe = p.memberId === currentUserId

                return (
                  <div
                    key={p.memberId}
                    className={cn(
                      'relative flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 shadow-2xs transition-all',
                      p.speaking
                        ? 'border-success ring-2 ring-success/30 shadow-md shadow-success/10'
                        : 'border-border hover:border-primary/30',
                    )}
                  >
                    {p.speaking && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-[9px] font-bold text-success animate-pulse">
                        <Activity className="size-2.5" />
                        Bicara
                      </span>
                    )}

                    <div className="relative mt-1">
                      <span
                        className={cn(
                          'flex items-center justify-center rounded-full p-1.5 transition-all',
                          p.speaking ? 'bg-success/20 ring-4 ring-success/30' : 'bg-transparent',
                        )}
                      >
                        <MemberAvatar member={m} className="size-16 text-lg" />
                      </span>
                      <span
                        className={cn(
                          'absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card text-white shadow-xs',
                          p.muted ? 'bg-destructive' : 'bg-success',
                        )}
                      >
                        {p.muted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <span className="text-sm font-semibold text-foreground">
                        {m.name}
                        {isMe && ' (Kamu)'}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        {p.muted ? 'Mikrofon Mati' : p.speaking ? 'Sedang Berbicara...' : 'Mendengarkan'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Control Bar */}
      <div className="sticky bottom-0 border-t bg-card/90 p-4 backdrop-blur shadow-lg">
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-3">
          {joined ? (
            <>
              {/* Toggle Speaking simulation for testing */}
              <Button
                variant="outline"
                size="default"
                className="rounded-full gap-1.5 border-success/40 text-success hover:bg-success/10 text-xs font-semibold"
                onClick={() => toggleVoiceSpeaking(roomId)}
                title="Simulasi berbicara untuk menguji indikator hijau"
              >
                <Radio className="size-3.5" />
                {me?.speaking ? 'Stop Bicara' : 'Mulai Bicara (Tes Gelombang)'}
              </Button>

              <Button
                variant={me?.muted ? 'destructive' : 'outline'}
                size="default"
                className="rounded-full gap-1.5 font-semibold text-xs"
                onClick={() => {
                  toggleMute(roomId)
                  toast.info(me?.muted ? 'Mikrofon aktif.' : 'Mikrofon dibisukan.')
                }}
              >
                {me?.muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                {me?.muted ? 'Bunyikan Mic' : 'Bisukan Mic'}
              </Button>

              <Button
                variant="destructive"
                size="default"
                className="rounded-full gap-1.5 font-semibold text-xs"
                onClick={() => {
                  leaveVoice(roomId)
                  toast.info('Kamu keluar dari ruang suara.')
                }}
              >
                <PhoneOff className="size-4" />
                Putuskan Koneksi
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground font-semibold shadow-md"
              onClick={() => {
                joinVoice(roomId)
                toast.success('Kamu bergabung ke ruang suara.')
              }}
            >
              <LogIn className="size-4 mr-2" />
              Gabung ke Ruang Suara
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
