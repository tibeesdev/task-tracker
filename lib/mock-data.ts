import type { Member, Server, Room, Task, Alarm, VoiceParticipant, ChatMessage } from './types'

export const CURRENT_USER_ID = 'u-you'

export const members: Member[] = [
  { id: 'u-you', name: 'Andi Wijaya', initials: 'AW', color: 'oklch(0.56 0.2 285)', online: true },
  { id: 'u-nadia', name: 'Nadia Putri', initials: 'NP', color: 'oklch(0.65 0.18 20)', online: true },
  { id: 'u-bagas', name: 'Bagas Pratama', initials: 'BP', color: 'oklch(0.63 0.16 155)', online: true },
  { id: 'u-sari', name: 'Sari Wulandari', initials: 'SW', color: 'oklch(0.7 0.15 60)', online: false },
  { id: 'u-dimas', name: 'Dimas Anggara', initials: 'DA', color: 'oklch(0.62 0.15 245)', online: true },
  { id: 'u-rina', name: 'Rina Kusuma', initials: 'RK', color: 'oklch(0.6 0.19 330)', online: false },
  { id: 'u-fajar', name: 'Fajar Nugroho', initials: 'FN', color: 'oklch(0.6 0.14 200)', online: true },
]

export const servers: Server[] = [
  {
    id: 's-produk',
    name: 'Tim Produk',
    short: 'TP',
    color: 'oklch(0.56 0.2 285)',
    ownerId: 'u-you',
    memberIds: ['u-you', 'u-nadia', 'u-bagas', 'u-sari', 'u-dimas', 'u-rina', 'u-fajar'],
  },
  {
    id: 's-wisuda',
    name: 'Panitia Wisuda',
    short: 'PW',
    color: 'oklch(0.65 0.18 20)',
    ownerId: 'u-you',
    memberIds: ['u-you', 'u-nadia', 'u-dimas', 'u-fajar'],
  },
  {
    id: 's-kelas',
    name: 'Kelas Desain',
    short: 'KD',
    color: 'oklch(0.63 0.16 155)',
    ownerId: 'u-you',
    memberIds: ['u-you', 'u-bagas', 'u-sari', 'u-rina'],
  },
]

export const rooms: Room[] = [
  { id: 'r-produk-chat', serverId: 's-produk', name: 'obrolan-umum', type: 'chat' },
  { id: 'r-produk-chat2', serverId: 's-produk', name: 'random', type: 'chat' },
  { id: 'r-produk-tugas', serverId: 's-produk', name: 'Tugas Sprint', type: 'tugas' },
  { id: 'r-produk-tugas2', serverId: 's-produk', name: 'Rilis Aplikasi', type: 'tugas' },
  { id: 'r-produk-jadwal', serverId: 's-produk', name: 'Jadwal & Alarm', type: 'jadwal' },
  { id: 'r-produk-suara', serverId: 's-produk', name: 'Ruang Diskusi', type: 'suara' },
  { id: 'r-produk-suara2', serverId: 's-produk', name: 'Nongkrong', type: 'suara' },

  { id: 'r-wisuda-chat', serverId: 's-wisuda', name: 'obrolan-umum', type: 'chat' },
  { id: 'r-wisuda-tugas', serverId: 's-wisuda', name: 'Persiapan Acara', type: 'tugas' },
  { id: 'r-wisuda-jadwal', serverId: 's-wisuda', name: 'Jadwal Gladi', type: 'jadwal' },
  { id: 'r-wisuda-suara', serverId: 's-wisuda', name: 'Koordinasi', type: 'suara' },

  { id: 'r-kelas-chat', serverId: 's-kelas', name: 'obrolan-umum', type: 'chat' },
  { id: 'r-kelas-tugas', serverId: 's-kelas', name: 'Tugas Mingguan', type: 'tugas' },
  { id: 'r-kelas-jadwal', serverId: 's-kelas', name: 'Deadline', type: 'jadwal' },
  { id: 'r-kelas-suara', serverId: 's-kelas', name: 'Studio', type: 'suara' },
]

const now = new Date()
const iso = (daysFromNow: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}

export const tasks: Task[] = [
  {
    id: 't-1',
    roomId: 'r-produk-tugas',
    title: 'Redesain Halaman Beranda',
    description:
      'Perbarui tampilan beranda agar lebih modern dan mudah dipahami pengguna baru.',
    dueDate: iso(4),
    todos: [
      {
        id: 'td-1',
        title: 'Buat wireframe versi baru',
        assigneeIds: ['u-nadia'],
        status: 'selesai',
        proof: {
          kind: 'image',
          fileName: 'wireframe-beranda.png',
          note: 'Wireframe final untuk 3 section utama.',
          uploadedAt: iso(-2),
          uploadedBy: 'u-nadia',
        },
        reviewNote: 'Bagus, lanjut ke desain visual.',
      },
      {
        id: 'td-2',
        title: 'Desain visual hi-fi',
        assigneeIds: ['u-nadia', 'u-rina'],
        status: 'review',
        proof: {
          kind: 'image',
          fileName: 'desain-hifi.png',
          note: 'Sudah sesuai wireframe, cek warna ya.',
          uploadedAt: iso(0),
          uploadedBy: 'u-nadia',
        },
      },
      {
        id: 'td-3',
        title: 'Implementasi kode front-end',
        assigneeIds: ['u-you', 'u-bagas'],
        status: 'dikerjakan',
      },
      {
        id: 'td-4',
        title: 'Uji coba di perangkat mobile',
        assigneeIds: ['u-dimas'],
        status: 'todo',
      },
    ],
  },
  {
    id: 't-2',
    roomId: 'r-produk-tugas',
    title: 'Riset Pengguna Q3',
    description: 'Wawancara 5 pengguna untuk memahami kebutuhan fitur baru.',
    dueDate: iso(8),
    todos: [
      {
        id: 'td-5',
        title: 'Susun daftar pertanyaan',
        assigneeIds: ['u-sari'],
        status: 'selesai',
        proof: {
          kind: 'file',
          fileName: 'daftar-pertanyaan.pdf',
          uploadedAt: iso(-1),
          uploadedBy: 'u-sari',
        },
        reviewNote: 'Oke lengkap.',
      },
      {
        id: 'td-6',
        title: 'Jadwalkan wawancara',
        assigneeIds: ['u-you'],
        status: 'revisi',
        proof: {
          kind: 'file',
          fileName: 'jadwal-wawancara.xlsx',
          uploadedAt: iso(0),
          uploadedBy: 'u-you',
        },
        reviewNote: 'Tolong tambahkan zona waktu tiap narasumber.',
      },
      {
        id: 'td-7',
        title: 'Rekap hasil wawancara',
        assigneeIds: ['u-sari', 'u-fajar'],
        status: 'todo',
      },
    ],
  },
  {
    id: 't-3',
    roomId: 'r-wisuda-tugas',
    title: 'Dekorasi Panggung',
    description: 'Siapkan dekorasi panggung sesuai tema "Cerah Ceria".',
    dueDate: iso(2),
    todos: [
      { id: 'td-8', title: 'Beli bahan dekorasi', assigneeIds: ['u-dimas'], status: 'dikerjakan' },
      { id: 'td-9', title: 'Pasang backdrop', assigneeIds: ['u-fajar'], status: 'todo' },
      {
        id: 'td-10',
        title: 'Cek pencahayaan',
        assigneeIds: ['u-nadia'],
        status: 'review',
        proof: {
          kind: 'image',
          fileName: 'cek-lampu.png',
          uploadedAt: iso(0),
          uploadedBy: 'u-nadia',
        },
      },
    ],
  },
  {
    id: 't-4',
    roomId: 'r-kelas-tugas',
    title: 'Poster Kampanye Sosial',
    description: 'Buat poster ajakan hemat energi untuk tugas mingguan.',
    dueDate: iso(5),
    todos: [
      { id: 'td-11', title: 'Kumpulkan referensi', assigneeIds: ['u-rina'], status: 'selesai',
        proof: { kind: 'image', fileName: 'moodboard.png', uploadedAt: iso(-1), uploadedBy: 'u-rina' },
        reviewNote: 'Referensinya kaya, mantap.' },
      { id: 'td-12', title: 'Desain draf pertama', assigneeIds: ['u-bagas'], status: 'dikerjakan' },
      { id: 'td-13', title: 'Finalisasi & ekspor', assigneeIds: ['u-you'], status: 'todo' },
    ],
  },
]

export const alarms: Alarm[] = [
  {
    id: 'a-1',
    roomId: 'r-produk-jadwal',
    title: 'Daily Standup',
    note: 'Kumpul singkat 15 menit, siapkan update harianmu.',
    time: '09:00',
    date: iso(0),
    repeat: 'harian',
    responses: [
      { memberId: 'u-you', status: 'aktif' },
      { memberId: 'u-nadia', status: 'dimatikan', updatedAt: '08:55' },
      { memberId: 'u-bagas', status: 'dimatikan', updatedAt: '08:58' },
      { memberId: 'u-sari', status: 'aktif' },
      { memberId: 'u-dimas', status: 'dimatikan', updatedAt: '09:01' },
      { memberId: 'u-rina', status: 'aktif' },
      { memberId: 'u-fajar', status: 'aktif' },
    ],
  },
  {
    id: 'a-2',
    roomId: 'r-produk-jadwal',
    title: 'Demo Sprint ke Klien',
    note: 'Presentasi hasil sprint. Pastikan sudah standby 10 menit sebelumnya.',
    time: '14:30',
    date: iso(3),
    repeat: 'sekali',
    responses: [
      { memberId: 'u-you', status: 'aktif' },
      { memberId: 'u-nadia', status: 'aktif' },
      { memberId: 'u-bagas', status: 'aktif' },
      { memberId: 'u-sari', status: 'aktif' },
      { memberId: 'u-dimas', status: 'aktif' },
    ],
  },
  {
    id: 'a-3',
    roomId: 'r-wisuda-jadwal',
    title: 'Gladi Bersih',
    note: 'Semua panitia wajib hadir di aula.',
    time: '16:00',
    date: iso(1),
    repeat: 'sekali',
    responses: [
      { memberId: 'u-you', status: 'aktif' },
      { memberId: 'u-nadia', status: 'aktif' },
      { memberId: 'u-dimas', status: 'dimatikan', updatedAt: 'kemarin' },
      { memberId: 'u-fajar', status: 'aktif' },
    ],
  },
  {
    id: 'a-4',
    roomId: 'r-kelas-jadwal',
    title: 'Batas Kumpul Tugas',
    note: 'Deadline unggah poster ke portal kelas.',
    time: '23:59',
    date: iso(5),
    repeat: 'mingguan',
    responses: [
      { memberId: 'u-you', status: 'aktif' },
      { memberId: 'u-bagas', status: 'aktif' },
      { memberId: 'u-sari', status: 'aktif' },
      { memberId: 'u-rina', status: 'aktif' },
    ],
  },
]

export const initialVoice: Record<string, VoiceParticipant[]> = {
  'r-produk-suara': [
    { memberId: 'u-nadia', muted: false, speaking: true },
    { memberId: 'u-bagas', muted: true, speaking: false },
    { memberId: 'u-dimas', muted: false, speaking: false },
  ],
  'r-wisuda-suara': [{ memberId: 'u-fajar', muted: false, speaking: false }],
}

export const messages: ChatMessage[] = [
  { id: 'm-1', roomId: 'r-produk-chat', senderId: 'u-nadia', text: 'Pagi semuanya! Jangan lupa standup jam 9 ya.', createdAt: '08:45' },
  { id: 'm-2', roomId: 'r-produk-chat', senderId: 'u-bagas', text: 'Siap, aku lagi otw. Sekalian bawa kopi 😄', createdAt: '08:47' },
  { id: 'm-3', roomId: 'r-produk-chat', senderId: 'u-dimas', text: 'Wireframe beranda udah aku review, keren sih Nad.', createdAt: '08:52' },
  { id: 'm-4', roomId: 'r-produk-chat', senderId: 'u-nadia', text: 'Makasih Dimas! Nanti aku lanjut ke desain hi-fi.', createdAt: '08:53' },
  { id: 'm-5', roomId: 'r-produk-chat', senderId: 'u-you', text: 'Mantap tim, aku mulai garap front-end-nya siang ini.', createdAt: '09:10' },
  { id: 'm-6', roomId: 'r-produk-chat2', senderId: 'u-fajar', text: 'Ada yang nonton pertandingan tadi malam?', createdAt: '10:02' },
  { id: 'm-7', roomId: 'r-produk-chat2', senderId: 'u-rina', text: 'Aku! Seru banget menit-menit akhir.', createdAt: '10:05' },
  { id: 'm-8', roomId: 'r-wisuda-chat', senderId: 'u-nadia', text: 'Teman-teman, budget dekorasi sudah disetujui ya.', createdAt: '11:20' },
  { id: 'm-9', roomId: 'r-wisuda-chat', senderId: 'u-dimas', text: 'Oke, aku belanja bahan besok pagi.', createdAt: '11:25' },
  { id: 'm-10', roomId: 'r-kelas-chat', senderId: 'u-bagas', text: 'Poster kampanye punya kalian udah sampai mana?', createdAt: '13:15' },
  { id: 'm-11', roomId: 'r-kelas-chat', senderId: 'u-rina', text: 'Baru kumpulin referensi, nanti sore lanjut desain.', createdAt: '13:18' },
]
