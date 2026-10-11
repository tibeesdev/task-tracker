'use client'

import { StoreProvider } from '@/lib/store'
import { AppSidebar } from '@/components/app-sidebar'
import { Workspace } from '@/components/workspace'

export default function Page() {
  return (
    <StoreProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground antialiased">
        <AppSidebar />
        <Workspace />
      </div>
    </StoreProvider>
  )
}
