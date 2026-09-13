'use client'

import { AlarmClock, BellOff, Bell, Clock, Calendar, Repeat, CheckCircle2 } from 'lucide-react'
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
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">Alarm & Jadwal Bersama</h2>
          <p className="text-sm text-muted-foreground">
            Semua anggota menerima alarm yang sama · pantau siapa yang masih aktif
          </p>
        </div>
        {role === 'admin' && <CreateAlarmDialog roomId={roomId} />}
      </div>

      {list.length === 0 ? (
        <div className="px-6">
          <Empty className="rounded-xl border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlarmClock />
              </EmptyMedia>
              <EmptyTitle>Belum ada alarm</EmptyTitle>
              <EmptyDescription>
                {role === 'admin'
                  ? 'Buat alarm atau jadwal pertama untuk seluruh anggota.'
                  : 'Admin belum memasang alarm di room ini.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-6 pb-6 lg:grid-cols-2">
          {list.map((alarm) => (
            <AlarmCard key={alarm.id} alarm={alarm} />
          ))}
        </div>
      )}
    </div>
  )
}

function AlarmCard({ alarm }: { alarm: Alarm }) {
  const { getMember, currentUserId, setAlarmResponse } = useStore()
  const me = alarm.responses.find((r) => r.memberId === currentUserId)
  const active = alarm.responses.filter((r) => r.status === 'aktif')
  const off = alarm.responses.filter((r) => r.status === 'dimatikan')
  const total = alarm.responses.length
  const offPct = total ? Math.round((off.length / total) * 100) : 0

  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AlarmClock className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums">{alarm.time}</span>
              <Badge variant="secondary" className="gap-1">
                <Repeat className="size-3" />
                {repeatLabel[alarm.repeat]}
              </Badge>
            </div>
            <span className="font-medium">{alarm.title}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {alarm.date}
            </span>
          </div>
        </div>
        {alarm.note && <p className="text-sm text-muted-foreground">{alarm.note}</p>}
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Aksi milikku */}
        <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2">
          <span className="pl-1 text-xs font-medium text-muted-foreground">Status alarmku:</span>
          {me?.status === 'aktif' ? (
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              onClick={() => {
                setAlarmResponse(alarm.id, currentUserId, 'dimatikan')
                toast.info('Kamu mematikan alarm ini.')
              }}
            >
              <BellOff data-icon="inline-start" />
              Matikan alarm
            </Button>
          ) : (
            <Button
              size="sm"
              className="ml-auto"
              onClick={() => {
                setAlarmResponse(alarm.id, currentUserId, 'aktif')
                toast.success('Alarm diaktifkan kembali.')
              }}
            >
              <Bell data-icon="inline-start" />
              Aktifkan lagi
            </Button>
          )}
        </div>

        {/* Tracker */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-3.5 text-success" />
              {active.length} aktif
            </span>
            <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <BellOff className="size-3.5" />
              {off.length} mematikan
            </span>
          </div>
          <Progress value={offPct} className="h-2" />

          <div className="mt-1 flex flex-col gap-2">
            <TrackerRow
              label="Masih aktif"
              tone="success"
              members={active.map((r) => ({ member: getMember(r.memberId)!, meta: undefined }))}
            />
            <TrackerRow
              label="Sudah dimatikan"
              tone="muted"
              members={off.map((r) => ({ member: getMember(r.memberId)!, meta: r.updatedAt }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TrackerRow({
  label,
  tone,
  members,
}: {
  label: string
  tone: 'success' | 'muted'
  members: { member: ReturnType<ReturnType<typeof useStore>['getMember']>; meta?: string }[]
}) {
  if (members.length === 0) return null
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'w-28 shrink-0 text-xs font-medium',
          tone === 'success' ? 'text-success' : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {members.map(({ member, meta }) =>
          member ? (
            <Tooltip key={member.id}>
              <TooltipTrigger
                render={
                  <span
                    className={cn(
                      'inline-flex',
                      tone === 'muted' && 'opacity-70 grayscale',
                    )}
                  />
                }
              >
                <MemberAvatar member={member} className="size-7" />
              </TooltipTrigger>
              <TooltipContent>
                {member.name}
                {meta ? ` · matikan ${meta}` : ''}
              </TooltipContent>
            </Tooltip>
          ) : null,
        )}
      </div>
    </div>
  )
}
