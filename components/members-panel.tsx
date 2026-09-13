'use client'

import { useStore } from '@/lib/store'
import { MemberAvatar } from '@/components/member-avatar'

export function MembersPanel() {
  const { servers, activeServerId, getMember } = useStore()
  const server = servers.find((s) => s.id === activeServerId)
  if (!server) return null
  const list = server.memberIds.map(getMember).filter(Boolean)
  const online = list.filter((m) => m!.online)
  const offline = list.filter((m) => !m!.online)

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-l bg-sidebar xl:flex">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-sm font-semibold">Anggota</h2>
        <span className="ml-auto text-xs text-muted-foreground">{list.length} orang</span>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
        <Section title={`ONLINE — ${online.length}`}>
          {online.map((m) => (
            <MemberRow key={m!.id} name={m!.name} member={m!} />
          ))}
        </Section>
        {offline.length > 0 && (
          <Section title={`OFFLINE — ${offline.length}`}>
            {offline.map((m) => (
              <MemberRow key={m!.id} name={m!.name} member={m!} dim />
            ))}
          </Section>
        )}
      </div>
    </aside>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-2 text-[11px] font-bold tracking-wide text-muted-foreground">{title}</span>
      {children}
    </div>
  )
}

function MemberRow({
  name,
  member,
  dim,
}: {
  name: string
  member: Parameters<typeof MemberAvatar>[0]['member']
  dim?: boolean
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-sidebar-accent/50">
      <MemberAvatar member={member} className="size-7" showStatus />
      <span className={dim ? 'text-sm text-muted-foreground' : 'text-sm font-medium'}>{name}</span>
    </div>
  )
}
