'use client'

import {
  AlarmClock,
  BellOff,
  Bell,
  Calendar,
  Repeat,
  CheckCircle2,
  Volume2,
  Users,
  Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { MemberAvatar } from '@/components/member-avatar'
import { CreateAlarmDialog } from './create-alarm-dialog'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Alarm } from '@/lib/types'

const repeatLabel: Record<Alarm['repeat'], string> = {
  sekali: 'Sekali',
  harian: 'Harian',
  mingguan: 'Mingguan',
}

export function AlarmView({ roomId }: { roomId: string }) {
  const { alarms, role } = useStore()
  const list = alarms.filter((a) => a.roomId === roomId)

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card/60 px-6 py-4 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">Sistem Pengingat & Alarm Serentak Tim</h2>
            <Badge variant="secondary" className="font-bold bg-primary/10 text-primary">
              Sinkronisasi Seluruh Anggota
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Jadwal pengingat resmi yang berdering serentak untuk semua anggota organisasi · Pantau kepatuhan respons anggota pada tabel tracker.
          </p>
        </div>
        {role === 'admin' && <CreateAlarmDialog roomId={roomId} />}
      </div>

      {/* Guide Banner for Feasibility Testing */}
      <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground/90">
        <Info className="size-4 shrink-0 text-primary" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-primary">Fitur Sinkronisasi & Tracker:</strong> Klik{' '}
          <span className="font-semibold underline">Uji Bunyikan</span> untuk mensimulasikan alarm berdering di layar semua anggota, dan pantau status pemadaman alarm di bagian <em>Tracker Anggota</em> di bawah.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="p-6">
          <Empty className="rounded-xl border border-dashed bg-card/50">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlarmClock />
              </EmptyMedia>
              <EmptyTitle>Belum ada alarm atau jadwal</EmptyTitle>
              <EmptyDescription>
                {role === 'admin'
                  ? 'Pasang alarm pertama untuk seluruh anggota tim di room ini.'
                  : 'Admin belum memasang alarm di room ini.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 p-6 lg:grid-cols-2">
          {list.map((alarm) => (
            <AlarmCard key={alarm.id} alarm={alarm} />
          ))}
        </div>
      )}
    </div>
  )
}

function AlarmCard({ alarm }: { alarm: Alarm }) {
  const {
    getMember,
    currentUserId,
    setAlarmResponse,
    triggerAlarm,
    simulateOtherMembersAlarm,
  } = useStore()

  const me = alarm.responses.find((r) => r.memberId === currentUserId)
  const isMyOff = me?.status === 'dimatikan'
  const active = alarm.responses.filter((r) => r.status === 'aktif')
  const off = alarm.responses.filter((r) => r.status === 'dimatikan')
  const total = alarm.responses.length
  const offPct = total ? Math.round((off.length / total) * 100) : 0

  return (
    <Card className="flex flex-col gap-0 overflow-hidden border shadow-sm transition-all hover:shadow-md">
      <CardHeader className="gap-3 bg-muted/20 border-b pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
              <AlarmClock className="size-6" />
            </span>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
                  {alarm.time}
                </span>
                <Badge variant="outline" className="gap-1 border-primary/20 bg-background text-xs font-medium">
                  <Repeat className="size-3 text-primary" />
                  {repeatLabel[alarm.repeat]}
                </Badge>
              </div>
              <span className="font-semibold text-base text-foreground mt-0.5">{alarm.title}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                {alarm.date}
              </span>
            </div>
          </div>

          {/* Tombol Uji Bunyikan Alarm */}
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => triggerAlarm(alarm.id)}
            title="Uji coba alarm berdering"
          >
            <Volume2 className="size-3.5" />
            Uji Bunyikan
          </Button>
        </div>

        {alarm.note && (
          <p className="rounded-lg bg-card p-2.5 text-xs leading-relaxed text-muted-foreground border">
            {alarm.note}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
        {/* Kontrol Personal Matikan Alarm */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'size-2.5 rounded-full',
                isMyOff ? 'bg-success ring-2 ring-success/20' : 'bg-amber-500 animate-pulse',
              )}
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Alarm Kamu</span>
              <span className="text-[11px] text-muted-foreground">
                {isMyOff ? 'Sudah dimatikan' : 'Masih aktif berdering'}
              </span>
            </div>
          </div>

          {!isMyOff ? (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setAlarmResponse(alarm.id, currentUserId, 'dimatikan')
                toast.success('Kamu berhasil mematikan alarm.')
              }}
            >
              <BellOff data-icon="inline-start" />
              Matikan Alarm
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                setAlarmResponse(alarm.id, currentUserId, 'aktif')
                toast.info('Alarm diaktifkan kembali untukmu.')
              }}
            >
              <Bell data-icon="inline-start" />
              Nyalakan Kembali
            </Button>
          )}
        </div>

        {/* Tracker Keseluruhan Anggota */}
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Users className="size-3.5 text-muted-foreground" />
              <span>Pelacak Respons Tim</span>
            </div>
            <span className="text-xs font-semibold text-primary">
              {off.length} dari {total} mematikan ({offPct}%)
            </span>
          </div>

          <Progress value={offPct} className="h-2 rounded-full" />

          {/* Rincian Status Anggota */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Yang sudah mematikan */}
            <div className="flex items-start gap-2">
              <span className="flex w-28 shrink-0 items-center gap-1 text-[11px] font-semibold text-success">
                <CheckCircle2 className="size-3" />
                Sudah Matikan ({off.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {off.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">Belum ada</span>
                ) : (
                  off.map((r) => {
                    const m = getMember(r.memberId)
                    if (!m) return null
                    return (
                      <Tooltip key={r.memberId}>
                        <TooltipTrigger
                          render={
                            <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success" />
                          }
                        >
                          <MemberAvatar member={m} className="size-4" />
                          <span>{m.name.split(' ')[0]}</span>
                          {r.updatedAt && <span className="opacity-70 text-[10px]">({r.updatedAt})</span>}
                        </TooltipTrigger>
                        <TooltipContent>
                          {m.name} · Dimatikan pukul {r.updatedAt || 'tadi'}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })
                )}
              </div>
            </div>

            {/* Yang masih aktif / belum mematikan */}
            <div className="flex items-start gap-2">
              <span className="flex w-28 shrink-0 items-center gap-1 text-[11px] font-semibold text-amber-600">
                <Bell className="size-3" />
                Masih Aktif ({active.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {active.length === 0 ? (
                  <span className="text-[11px] text-success font-medium">Semua sudah mematikan! 🎉</span>
                ) : (
                  active.map((r) => {
                    const m = getMember(r.memberId)
                    if (!m) return null
                    return (
                      <Tooltip key={r.memberId}>
                        <TooltipTrigger
                          render={
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200" />
                          }
                        >
                          <MemberAvatar member={m} className="size-4" />
                          <span>{m.name.split(' ')[0]}</span>
                        </TooltipTrigger>
                        <TooltipContent>{m.name} · Belum mematikan alarm</TooltipContent>
                      </Tooltip>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Tombol Simulasi untuk Penguji Feasibility */}
          <div className="mt-1 border-t pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => simulateOtherMembersAlarm(alarm.id)}
              className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary underline decoration-dotted"
            >
              Simulasikan Anggota Lain Matikan / Nyalakan
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
