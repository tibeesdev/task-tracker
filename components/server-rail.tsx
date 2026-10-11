'use client'

import { useState } from 'react'
import { Plus, Crown, Sparkles } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

export function ServerRail() {
  const { servers, activeServerId, setActiveServer, addServer, currentUserId } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addServer(name.trim())
    setName('')
    setDialogOpen(false)
    toast.success('Server berhasil dibuat! Kamu otomatis menjadi Admin.')
  }

  return (
    <nav
      aria-label="Daftar server"
      className="flex h-full w-[76px] shrink-0 flex-col items-center gap-3 border-r bg-sidebar-accent/30 py-3.5"
    >
      {/* Brand Icon TaskTrack */}
      <Tooltip>
        <TooltipTrigger
          render={
            <div className="flex size-12 cursor-pointer items-center justify-center rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-105" />
          }
        >
          TT
        </TooltipTrigger>
        <TooltipContent side="right">TaskTrack</TooltipContent>
      </Tooltip>

      <Separator className="w-8" />

      {/* Servers list */}
      <div className="flex flex-1 flex-col items-center gap-3">
        {servers.map((s) => {
          const active = s.id === activeServerId
          const isOwner = s.ownerId === currentUserId
          return (
            <Tooltip key={s.id}>
              <TooltipTrigger
                onClick={() => setActiveServer(s.id)}
                className="group relative flex items-center justify-center"
                aria-label={s.name}
                aria-current={active ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'absolute -left-3.5 w-1.5 rounded-r-full bg-primary transition-all',
                    active ? 'h-8' : 'h-0 group-hover:h-4',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'relative flex size-12 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-xs transition-all',
                    active
                      ? 'rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-sidebar-accent/40'
                      : 'hover:rounded-xl hover:shadow-md',
                  )}
                  style={{ backgroundColor: s.color }}
                >
                  {s.short}
                  {isOwner && (
                    <span
                      className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[9px] text-amber-950 shadow-xs"
                      title="Admin / Pembuat Server"
                    >
                      👑
                    </span>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                {s.name} {isOwner ? '(Server Milikmu - Admin)' : ''}
              </TooltipContent>
            </Tooltip>
          )
        })}

        {/* Create new server */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => setDialogOpen(true)}
              className="flex size-12 items-center justify-center rounded-2xl border border-dashed border-success/40 bg-card text-success transition-all hover:rounded-xl hover:bg-success/15 hover:border-success shadow-2xs"
              aria-label="Buat server baru"
            >
              <Plus className="size-5" />
            </TooltipTrigger>
            <TooltipContent side="right">Buat server baru</TooltipContent>
          </Tooltip>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-4" />
                </span>
                <DialogTitle>Buat Server Baru</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Sebagai orang pertama yang membuat server ini, kamu otomatis akan menjadi{' '}
                <strong className="text-foreground font-semibold">Admin / Pembuat</strong> yang berhak
                membuat room, menambah tugas, dan mereview to-do list anggota.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <Input
                placeholder="Nama server (contoh: Tim Proyek Akhir)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={!name.trim()} className="bg-primary text-primary-foreground font-semibold">
                  Buat Server Sekarang
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  )
}
