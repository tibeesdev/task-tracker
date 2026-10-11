'use client'

import { useState } from 'react'
import { StoreProvider } from '@/lib/store'
import { AppSidebar } from '@/components/app-sidebar'
import { Workspace } from '@/components/workspace'
import { LoginPage } from '@/components/login-page'

export default function Page() {
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null)

  if (!loggedInUserId) {
    return <LoginPage onLogin={(id) => setLoggedInUserId(id)} />
  }

  return (
    <StoreProvider initialUserId={loggedInUserId}>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground antialiased">
        <AppSidebar onLogout={() => setLoggedInUserId(null)} />
        <Workspace />
      </div>
    </StoreProvider>
  )
}
