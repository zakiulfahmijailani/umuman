Berikut isi lengkap `SKILL.md` untuk `managing-theme-assets`:

***

**File: `.claude/skills/managing-theme-assets/SKILL.md`**

```markdown
---
name: managing-theme-assets
description: Manages theme asset slots for the umuman invitation template engine. Use when the user asks about uploading theme images, validating asset ratios, managing image slots, creating new themes, working with theme_asset_slots, or says "upload gambar tema", "slot gambar", "validasi rasio", "buat tema baru", "kelola aset tema", "tema belum lengkap", or "slot belum terisi". Covers all 20 standard image slots with cm dimensions and aspect ratios.
---

# Managing Theme Assets — Umuman

> Gunakan skill ini untuk semua pekerjaan yang berkaitan dengan
> aset visual tema undangan: upload, validasi, slot management,
> dan pengecekan kelengkapan tema sebelum diaktifkan.

---

## Konsep Utama

Setiap tema di umuman punya **20 slot gambar pakem** yang tetap.
Admin upload aset ke masing-masing slot.
Sistem otomatis render undangan menggunakan aset dari slot tersebut.

Keuntungan pendekatan ini:
- Struktur template tidak berubah
- 1000 tema berbeda cukup dengan upload aset berbeda
- Validasi konsisten di semua tema
- Fallback otomatis jika slot kosong

---

## Referensi Slot Lengkap

Lihat [SLOTS_SPEC.md](SLOTS_SPEC.md) untuk tabel lengkap
semua 20 slot beserta ukuran cm, rasio, dan keterangan fungsi.

---

## Alur Upload Aset Tema

```
Admin buka form edit tema
        ↓
Pilih slot gambar
        ↓
Pilih file dari komputer
        ↓
Frontend validasi rasio + ukuran file
        ↓
Kalau valid → POST /api/upload
        ↓
File disimpan ke public/uploads/themes/images/
        ↓
URL dikembalikan → simpan ke theme_asset_slots.asset_url
        ↓
Preview slot diperbarui
```

---

## Struktur Folder Upload Lokal

```
public/uploads/
├── themes/
│   ├── images/       ← semua gambar slot tema
│   ├── music/        ← musik default tema
│   └── videos/       ← video intro opsional tema
├── invitations/      ← foto dari user (groom, bride, couple, gallery)
└── demo/             ← aset placeholder untuk demo mode
```

---

## API Upload

Semua upload aset tema dikirim ke endpoint berikut:

```typescript
POST /api/upload

// Request: multipart/form-data
{
  file: File,
  type: 'themes' | 'invitations' | 'demo',
  slot_key?: string,    // opsional, untuk logging
  theme_id?: string     // opsional, untuk organisasi folder
}

// Response envelope
{
  data: {
    url: string,        // '/uploads/themes/images/filename.ext'
    filename: string,
    size: number,
    mime_type: string
  } | null,
  error: {
    code: string,
    message: string
  } | null
}
```

---

## Validasi Rasio Gambar di Frontend

Gunakan fungsi ini sebelum upload ke server:

```typescript
// src/lib/validators/theme-asset-validator.ts

export interface SlotSpec {
  slot_key: string
  slot_label: string
  width_cm: number
  height_cm: number
  aspect_ratio: string
  tolerance?: number   // default 0.1
}

/**
 * Validasi rasio gambar sebelum upload
 * Mengembalikan true jika rasio dalam toleransi
 */
export function validateImageRatio(
  file: File,
  targetRatio: string,
  tolerance = 0.1
): Promise<{ valid: boolean; actual: string; target: string }> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const [w, h] = targetRatio.split(':').map(Number)
      const target = w / h
      const actual = img.width / img.height
      const valid = Math.abs(target - actual) <= tolerance
      const actualStr = `${img.width}:${img.height}`
      resolve({ valid, actual: actualStr, target: targetRatio })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ valid: false, actual: 'error', target: targetRatio })
    }

    img.src = url
  })
}

/**
 * Validasi ukuran file maksimal
 */
export function validateFileSize(
  file: File,
  maxMB = 5
): { valid: boolean; sizeMB: number; maxMB: number } {
  const sizeMB = file.size / (1024 * 1024)
  return { valid: sizeMB <= maxMB, sizeMB: +sizeMB.toFixed(2), maxMB }
}

/**
 * Validasi tipe file gambar
 */
export function validateImageType(file: File): {
  valid: boolean
  type: string
} {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  return { valid: allowed.includes(file.type), type: file.type }
}

/**
 * Validasi durasi audio (maks 2 menit)
 */
export function validateAudioDuration(
  file: File,
  maxSeconds = 120
): Promise<{ valid: boolean; duration: number; maxSeconds: number }> {
  return new Promise((resolve) => {
    const audio = document.createElement('audio')
    const url = URL.createObjectURL(file)

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: audio.duration <= maxSeconds,
        duration: +audio.duration.toFixed(1),
        maxSeconds
      })
    }

    audio.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ valid: false, duration: 0, maxSeconds })
    }

    audio.src = url
  })
}

/**
 * Validasi durasi video (maks 1 menit)
 */
export function validateVideoDuration(
  file: File,
  maxSeconds = 60
): Promise<{ valid: boolean; duration: number; maxSeconds: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: video.duration <= maxSeconds,
        duration: +video.duration.toFixed(1),
        maxSeconds
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ valid: false, duration: 0, maxSeconds })
    }

    video.src = url
  })
}

/**
 * Validasi lengkap untuk slot gambar tema
 * Jalankan semua validasi sekaligus
 */
export async function validateThemeAsset(
  file: File,
  slot: SlotSpec
): Promise<{
  valid: boolean
  errors: string[]
  warnings: string[]
}> {
  const errors: string[] = []
  const warnings: string[] = []

  // Cek tipe file
  const typeCheck = validateImageType(file)
  if (!typeCheck.valid) {
    errors.push(
      `Tipe file tidak didukung: ${typeCheck.type}. Gunakan JPG, PNG, WebP, atau SVG.`
    )
    return { valid: false, errors, warnings }
  }

  // Cek ukuran file
  const sizeCheck = validateFileSize(file, 5)
  if (!sizeCheck.valid) {
    errors.push(
      `Ukuran file terlalu besar: ${sizeCheck.sizeMB} MB. Maksimal ${sizeCheck.maxMB} MB.`
    )
  }

  // Cek rasio
  const ratioCheck = await validateImageRatio(file, slot.aspect_ratio, slot.tolerance ?? 0.1)
  if (!ratioCheck.valid) {
    warnings.push(
      `Rasio gambar tidak sesuai rekomendasi. ` +
      `Target: ${ratioCheck.target}, ` +
      `Aktual: ${ratioCheck.actual}. ` +
      `Gambar akan di-crop center otomatis.`
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
```

---

## Komponen Upload Slot di Form Admin

Gunakan pola ini untuk setiap slot gambar di form edit tema:

```typescript
'use client'
// src/components/admin/themes/ThemeAssetSlotUploader.tsx

import { useState, useRef } from 'react'
import { validateThemeAsset } from '@/lib/validators/theme-asset-validator'
import type { SlotSpec } from '@/lib/validators/theme-asset-validator'

interface Props {
  slot: SlotSpec
  currentUrl?: string | null
  onUploadSuccess: (url: string, slotKey: string) => void
}

export default function ThemeAssetSlotUploader({
  slot,
  currentUrl,
  onUploadSuccess
}: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.
    if (!file) return

    setErrors([])
    setWarnings([])

    // Validasi
    const validation = await validateThemeAsset(file, slot)
    if (validation.errors.length > 0) {
      setErrors(validation.errors)
      return
    }
    if (validation.warnings.length > 0) {
      setWarnings(validation.warnings)
    }

    // Upload
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'themes')
      formData.append('slot_key', slot.slot_key)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const { data, error } = await res.json()

      if (error || !data?.url) {
        setErrors([error?.message ?? 'Upload gagal. Coba lagi.'])
        return
      }

      setPreview(data.url)
      onUploadSuccess(data.url, slot.slot_key)
    } catch {
      setErrors(['Terjadi kesalahan saat upload. Periksa koneksi internet.'])
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header slot */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm">{slot.slot_label}</p>
          <p className="text-xs text-muted-foreground">
            {slot.width_cm} × {slot.height_cm} cm · Rasio {slot.aspect_ratio}
          </p>
        </div>
        {preview && (
          <span className="text-xs text-green-600 font-medium">✓ Terisi</span>
        )}
        {!preview && (
          <span className="text-xs text-amber-500 font-medium">Kosong</span>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative w-full aspect-video rounded overflow-hidden bg-muted">
          <img
            src={preview}
            alt={slot.slot_label}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-dashed border-2 rounded-md py-3 text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
      >
        {uploading
          ? 'Mengupload...'
          : preview
          ? 'Ganti Gambar'
          : 'Upload Gambar'}
      </button>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="rounded-md bg-destructive/10 p-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-destructive">{err}</p>
          ))}
        </div>
      )}

      {/* Warning messages */}
      {warnings.length > 0 && (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 space-y-1">
          {warnings.map((warn, i) => (
            <p key={i} className="text-xs text-amber-700">{warn}</p>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Cek Kelengkapan Slot Sebelum Tema Diaktifkan

```typescript
// src/lib/validators/theme-completeness.ts

const REQUIRED_SLOTS_FOR_ACTIVE = [
  'cover_background',
  'hero_background',
  'theme_thumbnail',
  'event_background',
  'rsvp_background'
]

const REQUIRED_ORNAMENT_ONE_OF = [
  'hero_ornament_top',
  'hero_ornament_bottom'
]

export interface CompletenessResult {
  can_activate: boolean
  missing_required: string[]
  missing_ornament: boolean
  filled_slots: number
  total_slots: number
  completion_percentage: number
}

export function checkThemeCompleteness(
  slots: Array<{ slot_key: string; asset_url: string | null }>
): CompletenessResult {
  const filledKeys = new Set(
    slots.filter(s => s.asset_url).map(s => s.slot_key)
  )

  const missingRequired = REQUIRED_SLOTS_FOR_ACTIVE.filter(
    key => !filledKeys.has(key)
  )

  const hasOrnament = REQUIRED_ORNAMENT_ONE_OF.some(
    key => filledKeys.has(key)
  )

  const canActivate = missingRequired.length === 0 && hasOrnament

  return {
    can_activate: canActivate,
    missing_required: missingRequired,
    missing_ornament: !hasOrnament,
    filled_slots: filledKeys.size,
    total_slots: slots.length,
    completion_percentage: Math.round((filledKeys.size / slots.length) * 100)
  }
}
```

---

## Checklist Integrasi Skill Ini

- [ ] File `src/lib/validators/theme-asset-validator.ts` sudah dibuat
- [ ] File `src/lib/validators/theme-completeness.ts` sudah dibuat
- [ ] Komponen `ThemeAssetSlotUploader` sudah dibuat
- [ ] API route `POST /api/upload` sudah menangani type `themes`
- [ ] Folder `public/uploads/themes/images/` sudah ada
- [ ] Folder `public/uploads/themes/music/` sudah ada
- [ ] Folder `public/uploads/themes/videos/` sudah ada
- [ ] Semua 20 slot dari SLOTS_SPEC.md sudah ada di form admin
- [ ] Validasi rasio berjalan dan menampilkan warning yang benar
- [ ] Validasi ukuran file berjalan
- [ ] Cek kelengkapan tema berjalan sebelum tombol Aktifkan ditekan
- [ ] `npm run build` berhasil tanpa error

---

*SKILL.md — Managing Theme Assets*
*Bagian dari: `.claude/skills/managing-theme-assets/`*
```

***
