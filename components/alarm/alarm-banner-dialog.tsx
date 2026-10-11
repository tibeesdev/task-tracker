'use client'

import { AlarmClock, BellOff, Volume2, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { MemberAvatar } from '@/components/member-avatar'

export function AlarmBannerDialog() {
  const { activeAlarmModal, dismissActiveAlarm, setAlarmResponse, currentUserId, getMember } =
    useStore()

  if (!activeAlarmModal) return null

  const myResp = activeAlarmModal.responses.find((r) => r.memberId === currentUserId)
  const isTurnedOff = myResp?.status === 'dimatikan'
  const offCount = activeAlarmModal.responses.filter((r) => r.status === 'dimatikan').length
  const totalCount = activeAlarmModal.responses.length

  return (
    <Dialog open={Boolean(activeAlarmModal)} onOpenChange={(open) => !open && dismissActiveAlarm()}>
      <DialogContent className="overflow-hidden border-2 border-primary/30 p-0 sm:max-w-md">
        <div className="relative flex flex-col items-center bg-gradient-to-b from-primary/15 via-primary/5 to-transparent p-6 text-center">
          <span className="relative mb-3 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 animate-bounce">
            <AlarmClock className="size-8" />
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive animate-ping" />
          </span>

          <Badge variant="outline" className="mb-2 border-primary/30 bg-card text-primary font-semibold">
            <Volume2 className="mr-1 size-3.5" />
            Alarm Bersama Aktif
          </Badge>

          <DialogHeader className="items-center">
            <DialogTitle className="text-xl font-bold">{activeAlarmModal.title}</DialogTitle>
            <DialogDescription className="text-sm text-foreground/80">
              {activeAlarmModal.note || 'Pengingat serentak untuk semua anggota room.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 font-mono text-2xl font-bold text-primary shadow-sm">
            <span>{activeAlarmModal.time} WIB</span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {offCount} dari {totalCount} anggota sudah mematikan alarm ini.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2">
            {!isTurnedOff ? (
              <Button
                size="lg"
                className="w-full bg-primary font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
                onClick={dismissActiveAlarm}
              >
                <BellOff data-icon="inline-start" />
                Matikan Alarm Sekarang
              </Button>
            ) : (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-success/15 py-3 text-sm font-semibold text-success">
                <CheckCircle2 className="size-4" />
                Alarm Kamu Sudah Dimatikan
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => {
                // Just close popup without changing status if wanted, or dismiss
                dismissActiveAlarm()
              }}
            >
              Tutup Pengingat
            </Button>
          </div>
        </div>

        {/* Live responses glance */}
        <div className="border-t bg-muted/40 p-4">
          <span className="text-xs font-semibold text-muted-foreground">
            Status Anggota Lain:
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeAlarmModal.responses.map((resp) => {
              const m = getMember(resp.memberId)
              if (!m) return null
              const isOff = resp.status === 'dimatikan'
              return (
                <div
                  key={resp.memberId}
                  className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${
                    isOff
                      ? 'border-success/30 bg-success/10 text-success font-medium'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  <MemberAvatar member={m} className="size-4" />
                  <span>{m.name.split(' ')[0]}</span>
                  {isOff && <CheckCircle2 className="size-3 text-success" />}
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
