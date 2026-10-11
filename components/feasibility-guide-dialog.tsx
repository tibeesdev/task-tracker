'use client'

import { useState } from 'react'
import {
  HelpCircle,
  Crown,
  UserCheck,
  CheckCircle2,
  AlarmClock,
  Volume2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export function FeasibilityGuideDialog() {
  const [open, setOpen] = useState(false)

  const steps = [
    {
      num: 1,
      role: 'Admin',
      icon: Crown,
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300',
      title: 'Tetapkan Jobdesk & Penanggung Jawab',
      desc: 'Sebagai Admin/Pembuat Organisasi, pilih menu "Jobdesk & Tugas" di bilah kiri, lalu buat jobdesk baru. Buka jobdesk tersebut untuk menetapkan anggota penanggung jawab.',
    },
    {
      num: 2,
      role: 'Anggota',
      icon: UserCheck,
      badgeColor: 'bg-primary/10 text-primary border-primary/20',
      title: 'Kerjakan Jobdesk & Lampirkan Bukti',
      desc: 'Ubah sudut pandang ke peran "Anggota" di bilah kiri bawah. Buka jobdesk yang ditugaskan kepadamu, pilih "Mulai Kerjakan", lalu lampirkan foto/dokumen bukti penyelesaian (tersedia opsi sampel cepat).',
    },
    {
      num: 3,
      role: 'Admin',
      icon: CheckCircle2,
      badgeColor: 'bg-success/10 text-success border-success/30',
      title: 'Validasi Formal (ACC atau Revisi)',
      desc: 'Kembali ke peran "Admin". Buka item yang menunggu persetujuan, periksa bukti foto, lalu klik "Setujui (ACC)" untuk menaikkan progres resmi atau "Minta Revisi" beserta catatan evaluasi.',
    },
    {
      num: 4,
      role: 'Semua',
      icon: AlarmClock,
      badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200',
      title: 'Alarm Serentak & Pelacak Respons Tim',
      desc: 'Pilih menu "Alarm & Pengingat Tim". Klik "Uji Bunyikan" untuk menyimulasikan alarm berdering serentak di layar tim, lalu tekan "Matikan Alarm" dan amati tabel tracker mencatat siapa saja yang sudah mematikan alarm.',
    },
    {
      num: 5,
      role: 'Semua',
      icon: Volume2,
      badgeColor: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200',
      title: 'Rapat Suara Tim Formal',
      desc: 'Pilih "Rapat Suara Tim" untuk koordinasi cepat antar pengurus organisasi dengan indikator status mikrofon dan pembicara aktif.',
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 text-xs font-bold h-8 rounded-full"
      >
        <HelpCircle className="size-3.5" />
        <span className="hidden sm:inline">Panduan Pengujian Kelayakan</span>
        <span className="sm:hidden">Panduan</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4.5" />
              </span>
              <DialogTitle className="text-base font-bold">
                Panduan Pengujian Sistem Organisasi TaskTrack
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Sistem berfokus pada 2 pilar utama: <strong>Jobdesk (Akuntabilitas Kerja)</strong> dan <strong>Alarm (Kedisiplinan Waktu)</strong>. Ikuti langkah pengujian berikut:
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-2">
            {steps.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.num}
                  className="flex items-start gap-3 rounded-xl border bg-card p-3.5 shadow-2xs hover:border-primary/40 transition-all"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                    {s.num}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">{s.title}</span>
                      <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${s.badgeColor}`}>
                        {s.role}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground border">
            <span>Ubah peran Admin / Anggota di panel kiri bawah untuk menguji kedua sudut pandang.</span>
            <Button size="sm" onClick={() => setOpen(false)} className="bg-primary text-primary-foreground font-bold">
              Mulai Evaluasi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
