'use client'

import { useState } from 'react'
import { Crown, UserCheck, ArrowRight, ShieldCheck, ListTodo, AlarmClock, Volume2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AccountPreset = {
  id: string
  name: string
  initials: string
  color: string
  role: 'admin' | 'member'
  title: string
  description: string
  password: string // placeholder credential
}

export const ACCOUNT_PRESETS: AccountPreset[] = [
  {
    id: 'u-you',
    name: 'Andi Wijaya',
    initials: 'AW',
    color: 'oklch(0.56 0.2 285)',
    role: 'admin',
    title: 'Administrator',
    description: 'Kelola tugas, tetapkan jobdesk, review bukti kerja, dan atur alarm bersama.',
    password: 'admin123',
  },
  {
    id: 'u-nadia',
    name: 'Nadia Putri',
    initials: 'NP',
    color: 'oklch(0.65 0.18 20)',
    role: 'member',
    title: 'Anggota Tim',
    description: 'Lihat tugas yang diberikan, kerjakan jobdesk, dan unggah bukti penyelesaian.',
    password: 'member123',
  },
]

interface LoginPageProps {
  onLogin: (accountId: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedAccount, setSelectedAccount] = useState<AccountPreset | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) return

    setLoading(true)
    setError('')

    setTimeout(() => {
      if (password === selectedAccount.password) {
        onLogin(selectedAccount.id)
      } else {
        setError('Kata sandi salah. Coba lagi.')
        setLoading(false)
      }
    }, 600)
  }

  const handleSelectAccount = (account: AccountPreset) => {
    setSelectedAccount(account)
    setPassword('')
    setError('')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left: Branding Panel */}
      <div
        className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-10 text-white"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.42 0.16 260) 0%, oklch(0.38 0.18 275) 50%, oklch(0.35 0.2 290) 100%)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <ListTodo className="size-5" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">TaskTrack</div>
            <div className="text-xs text-white/70 font-medium">Sistem Manajemen Tugas Tim</div>
          </div>
        </div>

        {/* Feature List */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-black leading-tight mb-2">
              Koordinasi Tim,<br />Lebih Terstruktur.
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              Platform formal untuk pembagian jobdesk, verifikasi kerja, dan sinkronisasi jadwal tim secara transparan.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: ListTodo, label: 'Jobdesk & Bukti Kerja', desc: 'Tugaskan, kerjakan, dan verifikasi ACC/Revisi' },
              { icon: AlarmClock, label: 'Alarm & Pengingat Bersama', desc: 'Jadwal serentak dengan pelacak respons' },
              { icon: Volume2, label: 'Rapat Suara Tim', desc: 'Diskusi langsung, keputusan cepat' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">{label}</div>
                  <div className="text-[11px] text-white/65">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-[11px] text-white/50">
          © 2025 TaskTrack · Versi Demo Prototipe
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div
              className="flex size-8 items-center justify-center rounded-lg text-white"
              style={{ background: 'oklch(0.42 0.16 260)' }}
            >
              <ListTodo className="size-4" />
            </div>
            <span className="text-base font-black text-foreground">TaskTrack</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Masuk ke Akun Anda</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Pilih akun di bawah untuk melanjutkan. Setiap akun memiliki peran dan akses berbeda.
            </p>
          </div>

          {/* Account Selector */}
          <div className="mb-6 flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">
              Pilih Akun
            </label>

            {ACCOUNT_PRESETS.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => handleSelectAccount(account)}
                className={cn(
                  'group flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200',
                  selectedAccount?.id === account.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30',
                )}
              >
                {/* Avatar */}
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm"
                  style={{ backgroundColor: account.color }}
                >
                  {account.initials}
                </div>

                {/* Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-foreground">{account.name}</span>
                    <span
                      className={cn(
                        'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                        account.role === 'admin'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-primary/10 text-primary',
                      )}
                    >
                      {account.role === 'admin' ? (
                        <Crown className="size-2.5" />
                      ) : (
                        <UserCheck className="size-2.5" />
                      )}
                      {account.title}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                    {account.description}
                  </p>
                  {/* Placeholder credentials hint */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <Lock className="size-2.5 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground/70 font-mono">
                      Kata sandi: <span className="font-bold text-muted-foreground">{account.password}</span>
                    </span>
                  </div>
                </div>

                {/* Selected indicator */}
                <div
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    selectedAccount?.id === account.id
                      ? 'border-primary bg-primary'
                      : 'border-border bg-background',
                  )}
                >
                  {selectedAccount?.id === account.id && (
                    <div className="size-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Password & Submit */}
          {selectedAccount && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Masukkan kata sandi..."
                  autoFocus
                  className={cn(
                    'w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all',
                    'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    error ? 'border-destructive ring-1 ring-destructive/30' : 'border-input',
                  )}
                />
                {error && (
                  <p className="text-xs text-destructive font-medium px-0.5">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!password || loading}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all',
                  'bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
                  loading && 'animate-pulse',
                )}
              >
                {loading ? (
                  'Memverifikasi...'
                ) : (
                  <>
                    Masuk sebagai {selectedAccount.name}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {!selectedAccount && (
            <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-center">
              <ShieldCheck className="mx-auto size-6 text-muted-foreground/50 mb-1.5" />
              <p className="text-xs text-muted-foreground">
                Pilih salah satu akun di atas untuk melanjutkan.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
            Ini adalah prototipe demo · Data tidak tersimpan di server
          </p>
        </div>
      </div>
    </div>
  )
}
