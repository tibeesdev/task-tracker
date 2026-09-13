import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ruang Kerja — Kolaborasi Tim',
  description:
    'Aplikasi kolaborasi tim: buat server & room, kelola tugas dengan to-do list dan bukti pekerjaan, atur alarm & jadwal bersama, dan diskusi lewat voice chat.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="light">
      <body className="antialiased">
        <TooltipProvider delay={200}>{children}</TooltipProvider>
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
