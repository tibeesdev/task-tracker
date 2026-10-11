'use client'

import { useState } from 'react'
import {
  ListTodo,
  AlarmClock,
  Volume2,
  MessageSquare,
  Building2,
  ChevronDown,
  Plus,
  Crown,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
} from 'lucide-react'
import { useStore, taskProgress } from '@/lib/store'
import { MemberAvatar } from '@/components/member-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { RoomType } from '@/lib/types'

export function AppSidebar() {
  const {
    servers,
    rooms,
    activeServerId,
    activeRoomId,
    setActiveServer,
    setActiveRoom,
    role,
    setRole,
    currentUserId,
    getMember,
    tasks,
    alarms,
    voice,
    addServer,
  } = useStore()

  const [createOrgOpen, setCreateOrgOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)

  const currentServer = servers.find((s) => s.id === activeServerId) ?? servers[0]
  const isOwner = currentServer?.ownerId === currentUserId
  const currentUser = getMember(currentUserId)

  // Current active room
  const activeRoom = rooms.find((r) => r.id === activeRoomId)
  const activeType: RoomType = activeRoom?.type ?? 'tugas'

  // Metrics for Attention Indicators
  const serverRooms = rooms.filter((r) => r.serverId === activeServerId)
  const tugasRoom = serverRooms.find((r) => r.type === 'tugas')
  const jadwalRoom = serverRooms.find((r) => r.type === 'jadwal')
  const suaraRoom = serverRooms.find((r) => r.type === 'suara')
  const chatRoom = serverRooms.find((r) => r.type === 'chat')

  const serverTasks = tasks.filter((t) => t.roomId === tugasRoom?.id)
  const pendingReviewCount = serverTasks.reduce(
    (acc, t) => acc + t.todos.filter((td) => td.status === 'review').length,
    0,
  )
  const activeAlarmsCount = alarms.filter((a) => a.roomId === jadwalRoom?.id).length
  const voiceCount = voice[suaraRoom?.id ?? '']?.length ?? 0

  const handleSelectTab = (type: RoomType) => {
    const targetRoom = serverRooms.find((r) => r.type === type)
    if (targetRoom) {
      setActiveRoom(targetRoom.id)
    }
  }

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) return
    addServer(newOrgName.trim())
    setNewOrgName('')
    setCreateOrgOpen(false)
    toast.success(`Organisasi "${newOrgName.trim()}" berhasil dibuat! Kamu adalah Admin.`)
  }

  return (
    <>
      <aside className="flex h-full w-[270px] shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground select-none">
        {/* Organization / Workspace Header Dropdown */}
        <div className="relative border-b bg-card/60 p-3">
          <button
            type="button"
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="flex w-full items-center justify-between gap-2.5 rounded-lg border bg-card p-2.5 text-left shadow-2xs transition-all hover:bg-muted/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: currentServer?.color || 'oklch(0.42 0.16 260)' }}
              >
                {currentServer?.short || 'ORG'}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-bold text-foreground">
                  {currentServer?.name}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                  {isOwner ? (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                      <Crown className="size-2.5" /> Administrator
                    </span>
                  ) : (
                    'Organisasi Tim'
                  )}
                </span>
              </div>
            </div>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>

          {/* Org Selector Popover Menu */}
          {orgDropdownOpen && (
            <div className="absolute top-[68px] left-3 right-3 z-50 rounded-xl border bg-card p-1.5 shadow-xl">
              <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Pilih Organisasi / Divisi
              </div>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pt-1">
                {servers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveServer(s.id)
                      setOrgDropdownOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors',
                      s.id === activeServerId
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="truncate flex-1">{s.name}</span>
                    {s.ownerId === currentUserId && (
                      <span className="text-[10px] text-amber-600 font-semibold">Admin</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t mt-1.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOrgDropdownOpen(false)
                    setCreateOrgOpen(true)
                  }}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="size-3.5" />
                  Tambah Organisasi Baru
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Modules */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
          {/* SECTION 1: PILAR UTAMA (BOLD ATTENTION FOR JOBDESK & ALARM) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              <span>Pilar Utama Sistem</span>
              <span className="text-[9px] font-semibold text-primary uppercase">Prioritas</span>
            </div>

            {/* 1. Jobdesk & Tugas (PRIMARY FOCUS #1) */}
            <button
              type="button"
              onClick={() => handleSelectTab('tugas')}
              className={cn(
                'group relative flex items-start gap-3 rounded-xl border p-3 text-left transition-all',
                activeType === 'tugas'
                  ? 'border-primary/40 bg-card shadow-sm ring-1 ring-primary/20'
                  : 'border-transparent bg-transparent hover:bg-card hover:border-border text-muted-foreground hover:text-foreground',
              )}
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                  activeType === 'tugas'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary',
                )}
              >
                <ListTodo className="size-4.5" />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      'text-xs font-bold leading-tight',
                      activeType === 'tugas' ? 'text-foreground' : 'text-foreground/90',
                    )}
                  >
                    Jobdesk & Tugas
                  </span>
                  {pendingReviewCount > 0 && (
                    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                      {pendingReviewCount} ACC
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                  Pembagian tugas, bukti kerja & verifikasi ACC/Revisi.
                </span>
              </div>
            </button>

            {/* 2. Alarm & Jadwal Bersama (PRIMARY FOCUS #2) */}
            <button
              type="button"
              onClick={() => handleSelectTab('jadwal')}
              className={cn(
                'group relative flex items-start gap-3 rounded-xl border p-3 text-left transition-all',
                activeType === 'jadwal'
                  ? 'border-primary/40 bg-card shadow-sm ring-1 ring-primary/20'
                  : 'border-transparent bg-transparent hover:bg-card hover:border-border text-muted-foreground hover:text-foreground',
              )}
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                  activeType === 'jadwal'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary',
                )}
              >
                <AlarmClock className="size-4.5" />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      'text-xs font-bold leading-tight',
                      activeType === 'jadwal' ? 'text-foreground' : 'text-foreground/90',
                    )}
                  >
                    Alarm & Pengingat Tim
                  </span>
                  {activeAlarmsCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                      {activeAlarmsCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                  Jadwal serentak & pelacak siapa yang mematikan alarm.
                </span>
              </div>
            </button>
          </div>

          {/* SECTION 2: KOMUNIKASI & RAPAT TIM */}
          <div className="flex flex-col gap-1">
            <div className="px-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Komunikasi & Koordinasi
            </div>

            {/* Ruang Suara / Rapat */}
            <button
              type="button"
              onClick={() => handleSelectTab('suara')}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all text-left',
                activeType === 'suara'
                  ? 'bg-card text-foreground font-bold shadow-2xs border'
                  : 'text-muted-foreground hover:bg-card/70 hover:text-foreground',
              )}
            >
              <Volume2 className={cn('size-4', activeType === 'suara' && 'text-primary')} />
              <span className="truncate flex-1">Rapat Suara Tim</span>
              {voiceCount > 0 && (
                <span className="rounded-full bg-success/15 px-1.5 py-0.2 text-[10px] font-bold text-success flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  {voiceCount} online
                </span>
              )}
            </button>

            {/* Papan Informasi & Chat */}
            <button
              type="button"
              onClick={() => handleSelectTab('chat')}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all text-left',
                activeType === 'chat'
                  ? 'bg-card text-foreground font-bold shadow-2xs border'
                  : 'text-muted-foreground hover:bg-card/70 hover:text-foreground',
              )}
            >
              <MessageSquare className={cn('size-4', activeType === 'chat' && 'text-primary')} />
              <span className="truncate flex-1">Papan Informasi & Catatan</span>
            </button>
          </div>
        </div>

        {/* FOOTER: ROLE CONTROLLER & USER PROFILE */}
        <div className="border-t bg-card/60 p-3 flex flex-col gap-2.5">
          {/* Formal Role Switcher */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase px-1">
              Sudut Pandang Peran:
            </span>
            <div className="grid grid-cols-2 gap-1 rounded-lg border bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-bold transition-all',
                  role === 'admin'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Crown className="size-3 text-amber-500" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-bold transition-all',
                  role === 'member'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <UserCheck className="size-3 text-primary" />
                Anggota
              </button>
            </div>
          </div>

          {/* User profile card */}
          {currentUser && (
            <div className="flex items-center gap-2 rounded-lg border bg-card p-2 shadow-2xs">
              <MemberAvatar member={currentUser} className="size-7" showStatus />
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-bold text-foreground">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {role === 'admin' ? 'Akses: Pembuat & Reviewer' : 'Akses: Pelaksana Tugas'}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Modal Buat Organisasi / Server Baru */}
      <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="size-4" />
              </span>
              <DialogTitle className="text-base font-bold">
                Buat Ruang Organisasi / Proyek Baru
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Sebagai pembuat, kamu otomatis memiliki otoritas Administrator untuk mengelola jobdesk,
              menetapkan penanggung jawab, dan mengatur alarm bersama.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateOrg} className="space-y-4 pt-2">
            <Input
              placeholder="Contoh: BEM Fakultas Teknik, Kepanitiaan Seminar..."
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              autoFocus
              className="text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateOrgOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={!newOrgName.trim()} className="bg-primary text-primary-foreground font-bold">
                Buat Ruang Kerja
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
