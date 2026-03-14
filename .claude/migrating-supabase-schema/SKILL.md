

***

**File: `.claude/skills/migrating-supabase-schema/SKILL.md`**

```markdown
---
name: migrating-supabase-schema
description: Creates safe Supabase migration SQL files for the umuman project. Use when the user says "buat migration", "tambah tabel", "update schema", "bikin SQL", "ada tabel baru", "tambah kolom", "buat RLS", "setup database", or when integrating new features that require new tables or schema changes. Always creates NEW migration files, never modifies existing ones. Always includes RLS policies.
---

# Migrating Supabase Schema — Umuman

> Gunakan skill ini setiap kali ada kebutuhan perubahan database.
> Baca SCHEMA_REF.md sebelum membuat migration baru untuk menghindari duplikasi.

---

## Prinsip Wajib

1. **JANGAN edit migration yang sudah ada** — selalu buat file baru
2. **SELALU sertakan RLS policy** di setiap tabel baru
3. **JANGAN disable RLS** dalam kondisi apapun
4. **JANGAN jalankan SQL langsung** — simpan file, serahkan ke user
5. **Cek SCHEMA_REF.md** sebelum buat tabel baru agar tidak duplikasi
6. **Gunakan `IF NOT EXISTS`** di semua CREATE TABLE dan CREATE INDEX
7. **Sertakan rollback** di setiap migration

---

## Lokasi File Migration

```
C:\project_umuman\umuman\supabase\migrations\
```

## Format Nama File

```
YYYYMMDDHHMMSS_nama_singkat_snake_case.sql
```

Contoh:
```
20260314170000_create_themes_table.sql
20260314170100_create_theme_asset_slots_table.sql
20260314170200_create_invitation_theme_preferences_table.sql
20260314170300_add_active_theme_id_to_invitations.sql
```

---

## Referensi Schema Existing

Baca [SCHEMA_REF.md](SCHEMA_REF.md) sebelum membuat migration.
Tabel yang sudah ada tidak boleh dibuat ulang.

---

## Template Migration Standar

```sql
-- ============================================================
-- Migration: YYYYMMDDHHMMSS_nama_fitur.sql
-- Dibuat   : DD MMMM YYYY
-- Tujuan   : [jelaskan tujuan migration secara singkat]
-- Koneksi  : [sebutkan relasi ke tabel lain jika ada]
-- ============================================================

-- ── TABEL BARU ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nama_tabel (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- kolom FK
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  -- kolom data
  name            TEXT        NOT NULL,
  description     TEXT,
  status          TEXT        NOT NULL DEFAULT 'draft'
                              CHECK (status IN ('draft', 'active', 'archived')),
  -- kolom JSONB untuk data fleksibel
  settings        JSONB       NOT NULL DEFAULT '{}',
  -- timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── KOMENTAR TABEL ───────────────────────────────────────────────────────
COMMENT ON TABLE nama_tabel IS '[deskripsi tabel]';
COMMENT ON COLUMN nama_tabel.status IS 'draft | active | archived';

-- ── AUTO UPDATE updated_at ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_nama_tabel_updated_at
  BEFORE UPDATE ON nama_tabel
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────
ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa akses data miliknya sendiri
CREATE POLICY "User dapat melihat data sendiri"
ON nama_tabel FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "User dapat membuat data sendiri"
ON nama_tabel FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "User dapat mengubah data sendiri"
ON nama_tabel FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "User dapat menghapus data sendiri"
ON nama_tabel FOR DELETE
USING (user_id = auth.uid());

-- Policy khusus admin
CREATE POLICY "Admin dapat akses semua data"
ON nama_tabel FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ── INDEX PERFORMA ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_nama_tabel_user_id
  ON nama_tabel(user_id);

CREATE INDEX IF NOT EXISTS idx_nama_tabel_status
  ON nama_tabel(status);

-- ── ROLLBACK (simpan sebagai komentar untuk referensi) ────────────────────
-- DROP TABLE IF EXISTS nama_tabel CASCADE;
-- DROP TRIGGER IF EXISTS trigger_nama_tabel_updated_at ON nama_tabel;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
```

---

## Migration Lengkap: Fitur Theme Engine Umuman

Berikut adalah 4 file migration yang perlu dibuat untuk fitur theme engine.
Jalankan secara berurutan di Supabase SQL Editor.

---

### Migration 1 — Tabel themes

**File: `20260314170000_create_themes_table.sql`**

```sql
-- ============================================================
-- Migration: 20260314170000_create_themes_table.sql
-- Dibuat   : 14 Maret 2026
-- Tujuan   : Membuat tabel master tema undangan
-- ============================================================

CREATE TABLE IF NOT EXISTS themes (
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
  colors              JSONB       NOT NULL DEFAULT '{
    "primary": "#8B4513",
    "secondary": "#D2691E",
    "accent": "#DAA520",
    "surface": "#FFF8DC",
    "surface_card": "#FFFBF0",
    "text_primary": "#3E1C00",
    "text_secondary": "#795548",
    "overlay_color": "#3E1C00",
    "overlay_opacity": 0.35
  }',
  typography          JSONB       NOT NULL DEFAULT '{
    "font_heading": "Dancing Script",
    "font_subheading": "Playfair Display",
    "font_body": "Lato",
    "font_accent": "Great Vibes"
  }',
  animation_settings  JSONB       NOT NULL DEFAULT '{
    "hero_animation": "petals",
    "intensity": "medium",
    "parallax": true,
    "scroll_reveal": true,
    "music_autoplay_after_open": true,
    "video_intro": false
  }',
  style_settings      JSONB       NOT NULL DEFAULT '{
    "border_radius": "soft",
    "shadow_style": "soft",
    "button_style": "rounded",
    "card_style": "bordered",
    "divider_style": "simple"
  }',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE themes IS 'Tabel master tema undangan pernikahan. Hanya admin yang bisa membuat dan mengedit tema.';
COMMENT ON COLUMN themes.slug IS 'URL-safe identifier unik. Contoh: jawa-klasik, sunda-pasundan';
COMMENT ON COLUMN themes.cultural_category IS 'Kategori budaya: Jawa, Sunda, Minang, Bali, Betawi, Bugis, Melayu, Modern, Islami, dll';
COMMENT ON COLUMN themes.status IS 'draft = belum aktif, active = tersedia untuk user, archived = tidak tampil';
COMMENT ON COLUMN themes.colors IS 'Konfigurasi palet warna tema dalam format JSONB';
COMMENT ON COLUMN themes.typography IS 'Konfigurasi font tema dalam format JSONB';
COMMENT ON COLUMN themes.animation_settings IS 'Konfigurasi animasi tema: hero_animation, intensity, parallax, dll';
COMMENT ON COLUMN themes.style_settings IS 'Konfigurasi style visual: border_radius, shadow_style, button_style, dll';

-- ── AUTO UPDATE updated_at ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_themes_updated_at
  BEFORE UPDATE ON themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Semua user yang login bisa melihat tema aktif
CREATE POLICY "Semua user dapat melihat tema aktif"
ON themes FOR SELECT
USING (
  status = 'active'
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Hanya admin yang bisa membuat tema
CREATE POLICY "Hanya admin dapat membuat tema"
ON themes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Hanya admin yang bisa mengubah tema
CREATE POLICY "Hanya admin dapat mengubah tema"
ON themes FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Hanya admin yang bisa menghapus tema
CREATE POLICY "Hanya admin dapat menghapus tema"
ON themes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ── INDEX ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_themes_slug
  ON themes(slug);

CREATE INDEX IF NOT EXISTS idx_themes_status
  ON themes(status);

CREATE INDEX IF NOT EXISTS idx_themes_cultural_category
  ON themes(cultural_category);

-- ── ROLLBACK ───────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS themes CASCADE;
-- DROP TRIGGER IF EXISTS trigger_themes_updated_at ON themes;

-- ============================================================
-- END: 20260314170000_create_themes_table.sql
-- ============================================================
```

---

### Migration 2 — Tabel theme_asset_slots

**File: `20260314170100_create_theme_asset_slots_table.sql`**

```sql
-- ============================================================
-- Migration: 20260314170100_create_theme_asset_slots_table.sql
-- Dibuat   : 14 Maret 2026
-- Tujuan   : Membuat tabel slot gambar per tema
-- Koneksi  : FK ke themes(id)
-- ============================================================

CREATE TABLE IF NOT EXISTS theme_asset_slots (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id            UUID        NOT NULL
                                  REFERENCES themes(id) ON DELETE CASCADE,
  slot_key            TEXT        NOT NULL,
  slot_label          TEXT        NOT NULL,
  slot_description    TEXT,
  width_cm            NUMERIC(6,2),
  height_cm           NUMERIC(6,2),
  aspect_ratio        TEXT,
  asset_url           TEXT,
  asset_type          TEXT        NOT NULL DEFAULT 'image'
                                  CHECK (asset_type IN ('image', 'audio', 'video')),
  display_order       INTEGER     NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (theme_id, slot_key)
);

COMMENT ON TABLE theme_asset_slots IS 'Slot aset visual per tema. Setiap tema punya 25 slot standar.';
COMMENT ON COLUMN theme_asset_slots.slot_key IS 'Identifier unik slot dalam tema. Contoh: cover_background, hero_ornament_top';
COMMENT ON COLUMN theme_asset_slots.aspect_ratio IS 'Rasio target slot. Contoh: 9:16, 3:1, 1:1';
COMMENT ON COLUMN theme_asset_slots.asset_url IS 'URL file aset. Null jika slot belum terisi.';

CREATE TRIGGER trigger_theme_asset_slots_updated_at
  BEFORE UPDATE ON theme_asset_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────
ALTER TABLE theme_asset_slots ENABLE ROW LEVEL SECURITY;

-- User bisa melihat slot dari tema aktif
CREATE POLICY "User dapat melihat slot tema aktif"
ON theme_asset_slots FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM themes
    WHERE themes.id = theme_asset_slots.theme_id
    AND (
      themes.status = 'active'
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

-- Hanya admin yang bisa insert/update/delete slot
CREATE POLICY "Hanya admin dapat mengelola slot tema"
ON theme_asset_slots FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Hanya admin dapat mengubah slot tema"
ON theme_asset_slots FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Hanya admin dapat menghapus slot tema"
ON theme_asset_slots FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ── INDEX ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_theme_asset_slots_theme_id
  ON theme_asset_slots(theme_id);

CREATE INDEX IF NOT EXISTS idx_theme_asset_slots_slot_key
  ON theme_asset_slots(slot_key);

CREATE INDEX IF NOT EXISTS idx_theme_asset_slots_display_order
  ON theme_asset_slots(theme_id, display_order);

-- ── ROLLBACK ───────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS theme_asset_slots CASCADE;

-- ============================================================
-- END: 20260314170100_create_theme_asset_slots_table.sql
-- ============================================================
```

---

### Migration 3 — Tabel invitation_theme_preferences

**File: `20260314170200_create_invitation_theme_preferences_table.sql`**

```sql
-- ============================================================
-- Migration: 20260314170200_create_invitation_theme_preferences_table.sql
-- Dibuat   : 14 Maret 2026
-- Tujuan   : Menyimpan preferensi tema per undangan milik user
-- Koneksi  : FK ke invitations(id) dan themes(id)
-- ============================================================

CREATE TABLE IF NOT EXISTS invitation_theme_preferences (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id   UUID        NOT NULL
                              REFERENCES invitations(id) ON DELETE CASCADE,
  theme_id        UUID        NOT NULL
                              REFERENCES themes(id) ON DELETE CASCADE,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  is_enabled      BOOLEAN     NOT NULL DEFAULT true,
  is_primary      BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (invitation_id, theme_id)
);

COMMENT ON TABLE invitation_theme_preferences IS 'Preferensi tema per undangan. User bisa pilih, urutkan, dan on/off tema.';
COMMENT ON COLUMN invitation_theme_preferences.sort_order IS 'Urutan tampilan tema. Semakin kecil angka, semakin prioritas.';
COMMENT ON COLUMN invitation_theme_preferences.is_enabled IS 'True jika tema ini aktif dalam daftar pilihan user.';
COMMENT ON COLUMN invitation_theme_preferences.is_primary IS 'True jika ini tema utama yang dipakai invitation page. Hanya satu per invitation.';

CREATE TRIGGER trigger_invitation_theme_preferences_updated_at
  BEFORE UPDATE ON invitation_theme_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── CONSTRAINT: hanya satu primary per invitation ─────────────────────────
-- Enforced di application layer dan trigger berikut:
CREATE OR REPLACE FUNCTION enforce_single_primary_theme()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE invitation_theme_preferences
    SET is_primary = false
    WHERE invitation_id = NEW.invitation_id
      AND id != NEW.id
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_enforce_single_primary_theme
  BEFORE INSERT OR UPDATE ON invitation_theme_preferences
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION enforce_single_primary_theme();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────
ALTER TABLE invitation_theme_preferences ENABLE ROW LEVEL SECURITY;

-- User hanya bisa akses preferensi undangan miliknya
CREATE POLICY "User dapat melihat preferensi tema undangan sendiri"
ON invitation_theme_preferences FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = invitation_theme_preferences.invitation_id
    AND invitations.user_id = auth.uid()
  )
);

CREATE POLICY "User dapat membuat preferensi tema untuk undangan sendiri"
ON invitation_theme_preferences FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = invitation_theme_preferences.invitation_id
    AND invitations.user_id = auth.uid()
  )
);

CREATE POLICY "User dapat mengubah preferensi tema undangan sendiri"
ON invitation_theme_preferences FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = invitation_theme_preferences.invitation_id
    AND invitations.user_id = auth.uid()
  )
);

CREATE POLICY "User dapat menghapus preferensi tema undangan sendiri"
ON invitation_theme_preferences FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = invitation_theme_preferences.invitation_id
    AND invitations.user_id = auth.uid()
  )
);

-- Admin bisa akses semua preferensi
CREATE POLICY "Admin dapat akses semua preferensi tema"
ON invitation_theme_preferences FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ── INDEX ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_itp_invitation_id
  ON invitation_theme_preferences(invitation_id);

CREATE INDEX IF NOT EXISTS idx_itp_theme_id
  ON invitation_theme_preferences(theme_id);

CREATE INDEX IF NOT EXISTS idx_itp_sort_order
  ON invitation_theme_preferences(invitation_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_itp_is_primary
  ON invitation_theme_preferences(invitation_id, is_primary)
  WHERE is_primary = true;

-- ── ROLLBACK ───────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS invitation_theme_preferences CASCADE;
-- DROP FUNCTION IF EXISTS enforce_single_primary_theme CASCADE;

-- ============================================================
-- END: 20260314170200_create_invitation_theme_preferences_table.sql
-- ============================================================
```

---

### Migration 4 — Tambah active_theme_id ke invitations

**File: `20260314170300_add_active_theme_id_to_invitations.sql`**

```sql
-- ============================================================
-- Migration: 20260314170300_add_active_theme_id_to_invitations.sql
-- Dibuat   : 14 Maret 2026
-- Tujuan   : Menambah kolom active_theme_id ke tabel invitations
--            agar invitation page bisa langsung query tema aktif
-- Koneksi  : FK ke themes(id)
-- ============================================================

-- Cek apakah kolom sudah ada sebelum menambahkan
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'invitations'
    AND column_name = 'active_theme_id'
  ) THEN
    ALTER TABLE invitations
    ADD COLUMN active_theme_id UUID
    REFERENCES themes(id) ON DELETE SET NULL;

    COMMENT ON COLUMN invitations.active_theme_id IS
      'FK ke tema aktif yang dipakai invitation page saat ini. '
      'Null berarti pakai default theme.';

    CREATE INDEX IF NOT EXISTS idx_invitations_active_theme_id
      ON invitations(active_theme_id);

    RAISE NOTICE 'Kolom active_theme_id berhasil ditambahkan ke tabel invitations.';
  ELSE
    RAISE NOTICE 'Kolom active_theme_id sudah ada di tabel invitations. Dilewati.';
  END IF;
END $$;

-- ── ROLLBACK ───────────────────────────────────────────────────────────────
-- ALTER TABLE invitations DROP COLUMN IF EXISTS active_theme_id;
-- DROP INDEX IF EXISTS idx_invitations_active_theme_id;

-- ============================================================
-- END: 20260314170300_add_active_theme_id_to_invitations.sql
-- ============================================================
```

---

## Urutan Eksekusi Migration

Jalankan di Supabase SQL Editor dengan urutan ini:

```
1. 20260314170000_create_themes_table.sql
2. 20260314170100_create_theme_asset_slots_table.sql
3. 20260314170200_create_invitation_theme_preferences_table.sql
4. 20260314170300_add_active_theme_id_to_invitations.sql
```

**Untuk demo mode: migration ini TIDAK perlu dijalankan.**
Data berasal dari `src/lib/mock/` — lihat skill `demo-mode-setup`.

---

## Cara Verifikasi Setelah Migration

Jalankan query ini di Supabase SQL Editor untuk verifikasi:

```sql
-- Cek semua tabel theme engine sudah ada
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'themes',
  'theme_asset_slots',
  'invitation_theme_preferences'
)
ORDER BY table_name;

-- Cek RLS aktif di semua tabel baru
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'themes',
  'theme_asset_slots',
  'invitation_theme_preferences'
);

-- Cek kolom active_theme_id sudah ada di invitations
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'invitations'
AND column_name = 'active_theme_id';

-- Cek semua policies
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN (
  'themes',
  'theme_asset_slots',
  'invitation_theme_preferences'
)
ORDER BY tablename, policyname;
```

---

## Checklist Sebelum Migration Dianggap Selesai

- [ ] SCHEMA_REF.md sudah dibaca — tidak ada duplikasi tabel
- [ ] Semua 4 file migration sudah dibuat di folder `supabase/migrations/`
- [ ] Nama file menggunakan format timestamp yang benar
- [ ] Semua tabel punya `ENABLE ROW LEVEL SECURITY`
- [ ] Semua tabel punya policy untuk user dan admin
- [ ] Semua tabel punya trigger `updated_at`
- [ ] Semua migration punya rollback statement di komentar
- [ ] Migration dijalankan berurutan di Supabase SQL Editor
- [ ] Verifikasi query sudah dijalankan dan semua tabel muncul
- [ ] Tidak ada error saat migration

---

*SKILL.md — Migrating Supabase Schema*
*Bagian dari: `.claude/skills/migrating-supabase-schema/`*
```

***
