'use client'

import { StoreProvider } from '@/lib/store'
import { ServerRail } from '@/components/server-rail'
import { RoomSidebar } from '@/components/room-sidebar'
import { Workspace } from '@/components/workspace'

export default function Page() {
  return (
    <StoreProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <ServerRail />
        <RoomSidebar />
        <Workspace />
      </div>
    </StoreProvider>
  )
}
