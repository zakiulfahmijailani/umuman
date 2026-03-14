

***

**File: `.claude/skills/migrating-supabase-schema/SCHEMA_REF.md`**

```markdown
# Referensi Schema Database — Umuman

> File ini adalah dokumentasi lengkap semua tabel yang sudah ada
> di database Supabase umuman.
>
> WAJIB dibaca sebelum membuat migration baru.
> Jangan buat tabel yang sudah ada di sini.
> Update file ini setiap kali migration baru berhasil dijalankan.

---

## Status Terakhir Diperbarui

```
Tanggal : 14 Maret 2026
Versi   : v1.0 — Theme Engine Initial Schema
```

---

## Daftar Tabel

| Tabel | Status | Migration File | Keterangan |
|---|---|---|---|
| `auth.users` | ✅ Exists | Supabase built-in | Tabel auth bawaan Supabase |
| `profiles` | ✅ Exists | `*_create_profiles_table.sql` | Profil user extend dari auth.users |
| `invitations` | ✅ Exists | `*_create_invitations_table.sql` | Data undangan milik user |
| `invitation_details` | ✅ Exists | `*_create_invitation_details_table.sql` | Detail konten undangan (mempelai, acara, dll) |
| `rsvp_messages` | ✅ Exists | `*_create_rsvp_messages_table.sql` | Ucapan dan konfirmasi kehadiran tamu |
| `themes` | ✅ Exists | `20260314170000_create_themes_table.sql` | Master tema undangan |
| `theme_asset_slots` | ✅ Exists | `20260314170100_create_theme_asset_slots_table.sql` | Slot gambar per tema |
| `invitation_theme_preferences` | ✅ Exists | `20260314170200_create_invitation_theme_preferences_table.sql` | Preferensi tema per undangan user |

---

## Detail Setiap Tabel

---

### auth.users *(Supabase Built-in)*

Tabel autentikasi bawaan Supabase. Jangan dimodifikasi.

```
Kolom utama yang relevan:
  id          UUID    ← dipakai sebagai FK di semua tabel user
  email       TEXT
  created_at  TIMESTAMPTZ
```

---

### profiles

Extends `auth.users`. Dibuat otomatis via trigger saat user register.

```sql
CREATE TABLE profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  role          TEXT        NOT NULL DEFAULT 'user'
                            CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**RLS:**
- User dapat melihat dan mengubah profil sendiri
- Admin dapat melihat semua profil

**Catatan penting:**
- Kolom `role` digunakan oleh SEMUA RLS policy admin di seluruh schema
- Jangan ubah nama tabel atau kolom `role` tanpa update semua policy

---

### invitations

Tabel utama undangan. Satu user bisa punya banyak undangan.

```sql
CREATE TABLE invitations (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug              TEXT        NOT NULL UNIQUE,
  status            TEXT        NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft', 'active', 'expired', 'archived')),
  active_theme_id   UUID        REFERENCES themes(id) ON DELETE SET NULL,  -- ← ditambah migration 20260314170300
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Kolom yang sudah ada:**
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → auth.users |
| `slug` | TEXT | URL identifier undangan |
| `status` | TEXT | draft, active, expired, archived |
| `active_theme_id` | UUID | FK → themes *(ditambah 14 Mar 2026)* |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**RLS:**
- User dapat CRUD undangan miliknya sendiri
- Admin dapat akses semua undangan
- Public dapat SELECT undangan dengan status `active` (untuk halaman publik)

**Index yang ada:**
- `idx_invitations_user_id`
- `idx_invitations_slug`
- `idx_invitations_status`
- `idx_invitations_active_theme_id` *(ditambah 14 Mar 2026)*

---

### invitation_details

Detail konten undangan. One-to-one dengan `invitations`.

```sql
CREATE TABLE invitation_details (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id           UUID        NOT NULL UNIQUE
                                      REFERENCES invitations(id) ON DELETE CASCADE,
  -- Mempelai Pria
  groom_name              TEXT,
  groom_full_name         TEXT,
  groom_father            TEXT,
  groom_mother            TEXT,
  groom_photo_url         TEXT,
  groom_instagram         TEXT,
  -- Mempelai Wanita
  bride_name              TEXT,
  bride_full_name         TEXT,
  bride_father            TEXT,
  bride_mother            TEXT,
  bride_photo_url         TEXT,
  bride_instagram         TEXT,
  -- Foto
  couple_photo_url        TEXT,
  background_photo_url    TEXT,
  -- Ayat / Quote
  quote_text              TEXT,
  quote_source            TEXT,
  -- Akad
  akad_date               TIMESTAMPTZ,
  akad_venue              TEXT,
  akad_address            TEXT,
  akad_maps_url           TEXT,
  akad_dress_code         TEXT,
  -- Resepsi
  reception_date          TIMESTAMPTZ,
  reception_end_date      TIMESTAMPTZ,
  reception_venue         TEXT,
  reception_address       TEXT,
  reception_maps_url      TEXT,
  reception_dress_code    TEXT,
  -- Dress Code
  dress_code_color_primary    TEXT,
  dress_code_color_secondary  TEXT,
  dress_code_description      TEXT,
  -- Kisah Cinta (JSONB array)
  love_story              JSONB       NOT NULL DEFAULT '[]',
  -- Galeri (JSONB array)
  gallery_photos          JSONB       NOT NULL DEFAULT '[]',
  -- Amplop Digital
  gift_enabled            BOOLEAN     NOT NULL DEFAULT false,
  gift_address            TEXT,
  qris_url                TEXT,
  bank_accounts           JSONB       NOT NULL DEFAULT '[]',
  -- RSVP
  rsvp_enabled            BOOLEAN     NOT NULL DEFAULT true,
  rsvp_deadline           TIMESTAMPTZ,
  -- Musik
  music_url               TEXT,
  music_title             TEXT,
  music_artist            TEXT,
  -- Timestamps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Struktur JSONB `love_story`:**
```json
[
  {
    "id": "uuid",
    "title": "Pertama Kali Bertemu",
    "date": "2022-03-15",
    "narasi": "...",
    "photo_url": "/uploads/...",
    "display_order": 1
  }
]
```

**Struktur JSONB `gallery_photos`:**
```json
[
  { "url": "/uploads/...", "caption": "..." }
]
```

**Struktur JSONB `bank_accounts`:**
```json
[
  {
    "id": "uuid",
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "Nama Pemilik",
    "logo_url": null
  }
]
```

**RLS:**
- User dapat CRUD details undangan miliknya sendiri
- Admin dapat akses semua details
- Public dapat SELECT details dari undangan yang active

**Index yang ada:**
- `idx_invitation_details_invitation_id`

---

### rsvp_messages

Pesan RSVP dari tamu undangan.

```sql
CREATE TABLE rsvp_messages (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id     UUID        NOT NULL
                                REFERENCES invitations(id) ON DELETE CASCADE,
  name              TEXT        NOT NULL,
  attendance_status TEXT        NOT NULL DEFAULT 'ragu'
                                CHECK (attendance_status IN ('hadir', 'tidak_hadir', 'ragu')),
  number_of_guests  INTEGER     NOT NULL DEFAULT 1,
  message           TEXT,
  is_read           BOOLEAN     NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Kolom yang ada:**
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `invitation_id` | UUID | FK → invitations |
| `name` | TEXT | Nama tamu |
| `attendance_status` | TEXT | hadir, tidak_hadir, ragu |
| `number_of_guests` | INTEGER | Jumlah tamu yang hadir |
| `message` | TEXT | Pesan ucapan |
| `is_read` | BOOLEAN | Sudah dibaca oleh pemilik undangan |
| `created_at` | TIMESTAMPTZ | |

**RLS:**
- Public dapat INSERT (tamu tidak perlu login untuk RSVP)
- Owner undangan dapat SELECT dan UPDATE (is_read) pesan milik undangannya
- Admin dapat akses semua

**Index yang ada:**
- `idx_rsvp_messages_invitation_id`
- `idx_rsvp_messages_attendance_status`
- `idx_rsvp_messages_is_read`

---

### themes

Tabel master tema undangan. *(Ditambah 14 Maret 2026)*

```sql
CREATE TABLE themes (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  slug                TEXT        NOT NULL UNIQUE,
  description         TEXT,
  cultural_category   TEXT        NOT NULL DEFAULT 'Modern',
  status              TEXT        NOT NULL DEFAULT 'draft'
                                  CHECK (status IN ('draft', 'active', 'archived')),
  thumbnail_url       TEXT,
  music_url           TEXT,
  video_url           TEXT,
  colors              JSONB       NOT NULL DEFAULT '{}',
  typography          JSONB       NOT NULL DEFAULT '{}',
  animation_settings  JSONB       NOT NULL DEFAULT '{}',
  style_settings      JSONB       NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Struktur JSONB `colors`:**
```json
{
  "primary": "#8B4513",
  "secondary": "#D2691E",
  "accent": "#DAA520",
  "surface": "#FFF8DC",
  "surface_card": "#FFFBF0",
  "text_primary": "#3E1C00",
  "text_secondary": "#795548",
  "overlay_color": "#3E1C00",
  "overlay_opacity": 0.35
}
```

**Struktur JSONB `typography`:**
```json
{
  "font_heading": "Dancing Script",
  "font_subheading": "Playfair Display",
  "font_body": "Lato",
  "font_accent": "Great Vibes"
}
```

**Struktur JSONB `animation_settings`:**
```json
{
  "hero_animation": "petals",
  "intensity": "medium",
  "parallax": true,
  "scroll_reveal": true,
  "music_autoplay_after_open": true,
  "video_intro": false
}
```

**Nilai valid `hero_animation`:** `petals`, `sparkles`, `confetti`, `fireflies`, `leaves`, `snow`, `bubbles`, `none`

**Nilai valid `intensity`:** `low`, `medium`, `high`

**Struktur JSONB `style_settings`:**
```json
{
  "border_radius": "soft",
  "shadow_style": "soft",
  "button_style": "rounded",
  "card_style": "bordered",
  "divider_style": "simple"
}
```

**RLS:**
- User dapat SELECT tema dengan status `active`
- Admin dapat CRUD semua tema

**Index yang ada:**
- `idx_themes_slug`
- `idx_themes_status`
- `idx_themes_cultural_category`

---

### theme_asset_slots

Slot gambar per tema. *(Ditambah 14 Maret 2026)*

```sql
CREATE TABLE theme_asset_slots (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id          UUID        NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  slot_key          TEXT        NOT NULL,
  slot_label        TEXT        NOT NULL,
  slot_description  TEXT,
  width_cm          NUMERIC(6,2),
  height_cm         NUMERIC(6,2),
  aspect_ratio      TEXT,
  asset_url         TEXT,
  asset_type        TEXT        NOT NULL DEFAULT 'image'
                                CHECK (asset_type IN ('image', 'audio', 'video')),
  display_order     INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (theme_id, slot_key)
);
```

**Total slot per tema:** 25 slot standar
**Referensi slot lengkap:** lihat `managing-theme-assets/SLOTS_SPEC.md`

**RLS:**
- User dapat SELECT slot dari tema active
- Admin dapat CRUD semua slot

**Index yang ada:**
- `idx_theme_asset_slots_theme_id`
- `idx_theme_asset_slots_slot_key`
- `idx_theme_asset_slots_display_order`

---

### invitation_theme_preferences

Preferensi tema per undangan milik user. *(Ditambah 14 Maret 2026)*

```sql
CREATE TABLE invitation_theme_preferences (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id   UUID        NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  theme_id        UUID        NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  is_enabled      BOOLEAN     NOT NULL DEFAULT true,
  is_primary      BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (invitation_id, theme_id)
);
```

**Business rules:**
- Satu invitation hanya boleh punya satu `is_primary = true`
- Dikenforce via trigger `enforce_single_primary_theme`
- `is_enabled = false` artinya tema dinonaktifkan sementara tapi tidak dihapus
- `sort_order` menentukan urutan tampil di UI pilih tema

**RLS:**
- User dapat CRUD preferensi undangan miliknya sendiri
- Admin dapat akses semua preferensi

**Index yang ada:**
- `idx_itp_invitation_id`
- `idx_itp_theme_id`
- `idx_itp_sort_order`
- `idx_itp_is_primary` *(partial index where is_primary = true)*

---

## Relasi Antar Tabel

```
auth.users
    │
    ├── profiles (1:1)
    │
    └── invitations (1:N)
            │
            ├── invitation_details (1:1)
            │
            ├── rsvp_messages (1:N)
            │
            └── invitation_theme_preferences (1:N)
                        │
                        └── themes (N:1)
                                │
                                └── theme_asset_slots (1:N)

invitations.active_theme_id ──────────────→ themes (N:1)
```

---

## Fungsi & Trigger yang Ada

| Nama | Tipe | Dipakai di Tabel |
|---|---|---|
| `update_updated_at_column()` | FUNCTION | Semua tabel yang punya `updated_at` |
| `enforce_single_primary_theme()` | FUNCTION | invitation_theme_preferences |
| `trigger_profiles_updated_at` | TRIGGER | profiles |
| `trigger_invitations_updated_at` | TRIGGER | invitations |
| `trigger_invitation_details_updated_at` | TRIGGER | invitation_details |
| `trigger_themes_updated_at` | TRIGGER | themes |
| `trigger_theme_asset_slots_updated_at` | TRIGGER | theme_asset_slots |
| `trigger_invitation_theme_preferences_updated_at` | TRIGGER | invitation_theme_preferences |
| `trigger_enforce_single_primary_theme` | TRIGGER | invitation_theme_preferences |

---

## Konvensi Schema

### Naming
- Tabel: `snake_case` plural (contoh: `rsvp_messages`, `theme_asset_slots`)
- Kolom: `snake_case` (contoh: `created_at`, `active_theme_id`)
- Index: `idx_[nama_tabel]_[kolom]` (contoh: `idx_themes_slug`)
- Trigger: `trigger_[nama_tabel]_[fungsi]`
- Policy: Kalimat deskriptif Bahasa Indonesia (contoh: `"User dapat melihat tema aktif"`)

### Tipe Data
- ID: `UUID` dengan `DEFAULT gen_random_uuid()`
- Timestamps: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- Status enum: `TEXT` dengan `CHECK` constraint
- Data fleksibel: `JSONB NOT NULL DEFAULT '{}'`
- Angka desimal: `NUMERIC(6,2)` bukan `FLOAT`

### RLS Pattern
Setiap tabel baru WAJIB:
1. `ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;`
2. Policy SELECT untuk user (data milik sendiri)
3. Policy INSERT untuk user (dengan `WITH CHECK`)
4. Policy UPDATE untuk user
5. Policy DELETE untuk user
6. Policy ALL untuk admin (via `profiles.role = 'admin'`)

### JSONB Pattern
Gunakan JSONB untuk:
- Data array yang tidak perlu di-query per item (gallery_photos, love_story)
- Konfigurasi fleksibel yang bisa berubah bentuk (colors, typography, settings)
- Data yang selalu dibaca sebagai satu unit

Jangan gunakan JSONB untuk:
- Data yang perlu di-filter atau di-join (gunakan tabel terpisah)
- Data yang perlu diindeks per field

---

## Tabel yang BELUM ADA (Roadmap)

Tabel-tabel ini belum dibuat dan akan dibutuhkan di iterasi berikutnya:

| Tabel | Keterangan | Priority |
|---|---|---|
| `invitation_visitors` | Log kunjungan tamu ke halaman undangan | Medium |
| `notifications` | Notifikasi untuk pemilik undangan (RSVP baru, dll) | Medium |
| `subscription_plans` | Paket langganan premium | Low |
| `user_subscriptions` | Langganan aktif per user | Low |
| `coupon_codes` | Kode diskon | Low |
| `audit_logs` | Log aktivitas admin | Low |

Buat migration untuk tabel-tabel di atas hanya saat fitur tersebut
akan mulai dikerjakan. Jangan buat migration prematur.

---

## Cara Update File Ini

Setiap kali migration baru berhasil dijalankan di Supabase:

1. Tambahkan tabel baru ke **Daftar Tabel** di bagian atas
2. Tambahkan detail tabel baru di bagian **Detail Setiap Tabel**
3. Update **Relasi Antar Tabel** jika ada FK baru
4. Tambahkan fungsi/trigger baru ke **Fungsi & Trigger yang Ada**
5. Update **Status Terakhir Diperbarui** di bagian atas
6. Pindahkan tabel dari **Roadmap** ke daftar aktif jika sudah dibuat

---

*SCHEMA_REF.md — Migrating Supabase Schema*
*Bagian dari: `.claude/skills/migrating-supabase-schema/`*
```

