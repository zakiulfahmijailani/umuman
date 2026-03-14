
***

**File: `.claude/skills/demo-mode-setup/SKILL.md`**

```markdown
---
name: demo-mode-setup
description: Sets up demo mode for umuman using mock/hardcoded data instead of real Supabase database. Use when the user says "demo dulu", "tidak perlu database real", "pakai data dummy", "mock data saja", "tanpa Supabase", "mode demo", or asks to build/preview features without real DB connection. Also use when building new features that are not yet connected to Supabase.
---

# Demo Mode Setup — Umuman

> Gunakan skill ini ketika fitur baru sedang dibangun dan belum membutuhkan
> koneksi database Supabase real. Semua data berasal dari file mock lokal.
> Tidak ada fetch ke Supabase. Tidak ada migration yang perlu dijalankan.

---

## Konsep Utama

Demo mode = fitur berjalan **penuh secara visual** dengan data hardcoded.
Tujuannya adalah:
- Iterasi cepat tanpa setup DB
- Preview visual yang realistis
- Testing komponen tanpa dependency external
- Lovable → Local → Antigravity cycle bisa jalan tanpa Supabase aktif

---

## Struktur Folder Mock Data

Semua data mock disimpan di:
```
src/lib/mock/
├── invitation.ts       ← data undangan dummy lengkap
├── themes.ts           ← data tema dummy + asset slots + daftar tema
├── rsvp.ts             ← data ucapan dan RSVP tamu dummy
├── user.ts             ← mock session user dan admin
└── index.ts            ← re-export semua mock data
```

Lihat [MOCK_DATA.md](MOCK_DATA.md) untuk isi lengkap setiap file.

---

## Aturan Demo Mode

1. Semua data diambil dari `src/lib/mock/` — bukan dari Supabase
2. Komponen React tetap sama persis — hanya data source yang berbeda
3. Tidak ada `supabase.from()` atau `supabase.auth` call di halaman demo
4. File upload tetap bisa ke `public/uploads/` lokal
5. Auth bisa di-bypass dengan mock session dari `src/lib/mock/user.ts`
6. Semua halaman demo menggunakan route `/demo` atau query param `?mode=demo`
7. Demo mode TIDAK mempengaruhi halaman production yang sudah ada

---

## Environment Variable Demo Mode

Tambahkan ke `.env.local`:
```env
NEXT_PUBLIC_DEMO_MODE=true
```

Cara cek di kode:
```typescript
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
```

Gunakan flag ini untuk switch antara mock data dan Supabase query:
```typescript
import { mockInvitation } from '@/lib/mock'
import { getInvitationFromDB } from '@/lib/supabase/queries'

const invitation = isDemoMode
  ? mockInvitation
  : await getInvitationFromDB(slug)
```

---

## Halaman Demo yang Harus Dibuat

Setiap fitur baru yang diintegrasikan dari joy_knot
harus punya versi demo yang bisa diakses tanpa login dan tanpa DB.

| Fitur | Route Demo |
|---|---|
| Halaman undangan publik | `/invite/demo` |
| Preview tema — admin | `/dashboard/admin/themes/demo` |
| Pilih tema — user | `/dashboard/themes/demo` |
| Preview template pakem | `/preview/template` |

Semua route demo ini harus:
- Bisa diakses tanpa autentikasi
- Menggunakan data dari `src/lib/mock/`
- Menampilkan UI yang identik dengan versi production
- Tidak menulis apapun ke database

---

## Cara Pakai Mock Data di Komponen

### Di Server Component (page.tsx)
```typescript
// src/app/invite/demo/page.tsx
import { mockInvitation, mockTheme, mockThemeSlots } from '@/lib/mock'
import InvitationRenderer from '@/components/invitation/InvitationRenderer'

export default function DemoInvitationPage() {
  return (
    <InvitationRenderer
      invitation={mockInvitation}
      theme={mockTheme}
      slots={mockThemeSlots}
      isDemo={true}
    />
  )
}
```

### Di Client Component dengan state
```typescript
'use client'
import { mockRsvpMessages } from '@/lib/mock'
import { useState } from 'react'

export default function DemoRsvpSection() {
  const [messages, setMessages] = useState(mockRsvpMessages)

  const handleSubmit = (newMessage: typeof mockRsvpMessages) => {
    // Di demo mode: tambah ke state lokal saja, tidak simpan ke DB
    setMessages(prev => [newMessage, ...prev])
  }

  return (
    // render komponen...
  )
}
```

### Di halaman yang butuh mock auth
```typescript
// src/app/dashboard/themes/demo/page.tsx
import { mockSession } from '@/lib/mock'
import UserThemeSelector from '@/components/themes/UserThemeSelector'

export default function DemoThemeSelectorPage() {
  return (
    <UserThemeSelector
      user={mockSession.user}
      // data lainnya dari mock
    />
  )
}
```

---

## Cara Pakai Mock Data di API Route (jika perlu)

```typescript
// src/app/api/themes/route.ts
import { NextResponse } from 'next/server'
import { mockThemeList } from '@/lib/mock'

export async function GET(req: Request) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  if (isDemoMode) {
    return NextResponse.json({ data: mockThemeList, error: null })
  }

  // production: query dari Supabase
  // const supabase = createClient()
  // const { data } = await supabase.from('themes').select('*')
  // return NextResponse.json({ data, error: null })
}
```

---

## Aset Demo yang Harus Disiapkan

Buat folder berikut dan isi dengan gambar placeholder:
```
public/uploads/demo/
├── groom.jpg               ← foto pria placeholder
├── bride.jpg               ← foto wanita placeholder
├── couple.jpg              ← foto couple placeholder
├── background.jpg          ← background undangan placeholder
├── gallery1.jpg            ← foto galeri 1
├── gallery2.jpg            ← foto galeri 2
├── gallery3.jpg            ← foto galeri 3
└── themes/
    └── jawa-klasik/
        ├── thumbnail.jpg
        ├── cover_bg.jpg
        ├── hero_bg.jpg
        └── ornament_top.png
```

Gunakan gambar placeholder dari:
- `https://picsum.photos/` untuk foto (jangan fetch langsung, download dulu)
- Atau gunakan warna solid sebagai placeholder sementara

---

## Checklist Sebelum Demo Mode Dianggap Selesai

- [ ] File `src/lib/mock/index.ts` sudah mengeksport semua mock data
- [ ] File `src/lib/mock/invitation.ts` sudah lengkap dengan semua field
- [ ] File `src/lib/mock/themes.ts` sudah punya minimal 1 tema + slot assets
- [ ] File `src/lib/mock/rsvp.ts` sudah punya minimal 3 pesan contoh
- [ ] File `src/lib/mock/user.ts` sudah punya mock user dan mock admin
- [ ] Route `/invite/demo` bisa diakses dan render undangan lengkap
- [ ] Route `/dashboard/admin/themes/demo` bisa diakses dan tampil form tema
- [ ] Route `/dashboard/themes/demo` bisa diakses dan tampil pilih tema
- [ ] Semua UI teks dalam Bahasa Indonesia
- [ ] Tidak ada error TypeScript di semua file mock
- [ ] `npm run build` berhasil tanpa error
- [ ] Tidak ada perubahan pada halaman production yang sudah berjalan

---

## Transisi Demo → Production

Ketika fitur sudah visual-complete di demo mode dan siap dihubungkan ke Supabase:

1. Jalankan migration SQL dari skill `migrating-supabase-schema`
2. Buat query functions di `src/lib/supabase/queries/`
3. Ganti import mock data dengan query function yang sesuai
4. Set `NEXT_PUBLIC_DEMO_MODE=false` di `.env.local`
5. Test dengan koneksi Supabase real
6. Hapus import mock dari halaman production (bukan dari file mock-nya)

File mock di `src/lib/mock/` **tetap dipertahankan** untuk keperluan testing
dan development iterasi berikutnya.

---

*SKILL.md — Demo Mode Setup*
*Bagian dari: `.claude/skills/demo-mode-setup/`*
```

