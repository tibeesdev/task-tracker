'use client'

import { Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

export function ServerRail() {
  const { servers, activeServerId, setActiveServer } = useStore()

  return (
    <nav
      aria-label="Daftar server"
      className="flex h-full w-[76px] shrink-0 flex-col items-center gap-3 bg-sidebar-accent/40 py-4"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
        RK
      </div>
      <Separator className="w-8" />
      <div className="flex flex-1 flex-col items-center gap-3">
        {servers.map((s) => {
          const active = s.id === activeServerId
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
                    'absolute -left-4 w-1.5 rounded-r-full bg-primary transition-all',
                    active ? 'h-8' : 'h-0 group-hover:h-4',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'flex size-12 items-center justify-center rounded-2xl text-sm font-bold text-white transition-all',
                    active ? 'rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-sidebar-accent/40' : 'hover:rounded-xl',
                  )}
                  style={{ backgroundColor: s.color }}
                >
                  {s.short}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">{s.name}</TooltipContent>
            </Tooltip>
          )
        })}
        <Tooltip>
          <TooltipTrigger
            onClick={() => toast.info('Membuat server baru (demo tampilan).')}
            className="flex size-12 items-center justify-center rounded-2xl bg-card text-success transition-all hover:rounded-xl hover:bg-success/10"
            aria-label="Buat server baru"
          >
            <Plus className="size-5" />
          </TooltipTrigger>
          <TooltipContent side="right">Buat server baru</TooltipContent>
        </Tooltip>
      </div>
    </nav>
  )
}
