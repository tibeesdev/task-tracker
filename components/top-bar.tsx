'use client'

import {
  ListTodo,
  AlarmClock,
  Volume2,
  MessageSquare,
  type LucideIcon,
  Crown,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { RoomType } from '@/lib/types'

const titles: Record<RoomType, { label: string; desc: string; icon: LucideIcon }> = {
  tugas: {
    label: 'Papan Jobdesk & Akuntabilitas Tugas',
    desc: 'Sistem pembagian tugas, unggah bukti pengerjaan, dan verifikasi ACC / Revisi Admin.',
    icon: ListTodo,
  },
  jadwal: {
    label: 'Jadwal & Sistem Alarm Pengingat Bersama',
    desc: 'Alarm dan jadwal serentak untuk seluruh anggota dengan pelacak respons pemadaman.',
    icon: AlarmClock,
  },
  suara: {
    label: 'Ruang Rapat Suara Tim',
    desc: 'Koordinasi audio langsung untuk sinkronisasi keputusan dan diskusi formal.',
    icon: Volume2,
  },
  chat: {
    label: 'Papan Komunikasi & Pengumuman',
    desc: 'Saluran informasi dan koordinasi tertulis antar anggota organisasi.',
    icon: MessageSquare,
  },
}

export function TopBar() {
  const { rooms, activeRoomId, servers, activeServerId, role } = useStore()
  const currentServer = servers.find((s) => s.id === activeServerId)
  const room = rooms.find((r) => r.id === activeRoomId)

  const meta = titles[room?.type ?? 'tugas']
  const Icon = meta.icon

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-card px-5 shadow-2xs">
      {/* Breadcrumb & Section Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span className="truncate">{currentServer?.name || 'Organisasi'}</span>
            <ChevronRight className="size-3 shrink-0" />
            <span className="font-bold text-foreground truncate">{meta.label}</span>
          </div>
          <span className="hidden md:block truncate text-[11px] text-muted-foreground">
            {meta.desc}
          </span>
        </div>
      </div>

      {/* Right Controls: Role Badge */}
      <div className="flex shrink-0 items-center gap-3">
        <div className={cn(
          'hidden sm:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs',
          role === 'admin'
            ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/40'
            : 'bg-primary/5 border-primary/20',
        )}>
          {role === 'admin' ? (
            <>
              <Crown className="size-3.5 text-amber-500" />
              <span className="font-bold text-amber-700 dark:text-amber-300">Otoritas: Admin</span>
            </>
          ) : (
            <>
              <ShieldCheck className="size-3.5 text-primary" />
              <span className="font-bold text-foreground">Otoritas: Anggota</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
