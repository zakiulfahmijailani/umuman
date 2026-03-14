Berikut isi lengkap `SLOTS_SPEC.md`:

***

**File: `.claude/skills/managing-theme-assets/SLOTS_SPEC.md`**

```markdown
# Spesifikasi Lengkap 20 Slot Gambar Tema — Umuman

> File ini adalah sumber kebenaran tunggal untuk semua slot gambar tema.
> Gunakan sebagai referensi saat:
> - Membuat form upload admin
> - Membuat tabel theme_asset_slots di Supabase
> - Membuat seed data slot di script
> - Memvalidasi rasio upload
> - Membuat komponen preview

---

## Aturan Umum Slot

1. Setiap tema WAJIB punya semua 20 slot terdaftar di database
2. Slot boleh kosong (asset_url = null) kecuali slot wajib aktif
3. Sistem otomatis pakai fallback default jika slot kosong
4. Validasi rasio toleransi ±0.1 dari nilai target
5. Semua gambar maksimal 5 MB per file
6. Format yang diterima: JPG, PNG, WebP, SVG
7. PNG transparan WAJIB untuk slot tipe frame dan ornamen
8. Ukuran cm adalah standar desain — implementasi frontend pakai rasio

---

## Slot Wajib Terisi Agar Tema Bisa Diaktifkan

```
✅ cover_background
✅ hero_background
✅ theme_thumbnail
✅ event_background
✅ rsvp_background
✅ Minimal 1 dari: hero_ornament_top ATAU hero_ornament_bottom
```

Semua slot lain opsional — sistem pakai fallback jika kosong.

---

## Tabel Lengkap 20 Slot

### SLOT 1 — cover_background
| Field | Value |
|---|---|
| slot_key | `cover_background` |
| slot_label | Background Cover |
| slot_description | Gambar full screen pertama yang muncul sebelum tamu membuka undangan. Ini adalah kesan pertama tema. |
| width_cm | 12 |
| height_cm | 21 |
| aspect_ratio | 9:16 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ✅ Ya |
| fallback | Warna solid dari `colors.primary` |
| catatan | Dioptimalkan untuk mobile. Hindari detail kecil karena akan diperbesar penuh layar. |

---

### SLOT 2 — hero_background
| Field | Value |
|---|---|
| slot_key | `hero_background` |
| slot_label | Background Hero |
| slot_description | Background utama yang muncul setelah tamu menekan tombol buka undangan. Ini adalah halaman utama undangan. |
| width_cm | 12 |
| height_cm | 21 |
| aspect_ratio | 9:16 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ✅ Ya |
| fallback | Warna solid dari `colors.secondary` |
| catatan | Bisa berupa foto, ilustrasi, motif budaya, atau pola dekoratif. Pertimbangkan area tengah untuk teks nama mempelai. |

---

### SLOT 3 — hero_ornament_top
| Field | Value |
|---|---|
| slot_key | `hero_ornament_top` |
| slot_label | Ornamen Atas Hero |
| slot_description | Ornamen dekoratif yang ditampilkan di bagian atas halaman hero. Memberikan kesan bingkai atas undangan. |
| width_cm | 12 |
| height_cm | 4 |
| aspect_ratio | 3:1 |
| asset_type | image |
| transparent | ✅ Ya (PNG) |
| wajib aktif | ⚠️ Minimal 1 dari ornamen atas atau bawah |
| fallback | Tidak ada ornamen (section tetap tampil) |
| catatan | Motif khas budaya: batik, ukiran, bunga, sulur, wayang, dll. Latar harus transparan. |

---

### SLOT 4 — hero_ornament_bottom
| Field | Value |
|---|---|
| slot_key | `hero_ornament_bottom` |
| slot_label | Ornamen Bawah Hero |
| slot_description | Ornamen dekoratif di bagian bawah halaman hero. Sering dipakai sebagai transisi ke section berikutnya. |
| width_cm | 12 |
| height_cm | 4 |
| aspect_ratio | 3:1 |
| asset_type | image |
| transparent | ✅ Ya (PNG) |
| wajib aktif | ⚠️ Minimal 1 dari ornamen atas atau bawah |
| fallback | Tidak ada ornamen |
| catatan | Bisa berupa border ornamental, deretan bunga, atau motif geometris budaya. |

---

### SLOT 5 — couple_frame
| Field | Value |
|---|---|
| slot_key | `couple_frame` |
| slot_label | Frame Foto Couple |
| slot_description | Bingkai dekoratif yang mengelilingi foto pasangan utama di halaman cover. |
| width_cm | 8 |
| height_cm | 8 |
| aspect_ratio | 1:1 |
| asset_type | image |
| transparent | ✅ Ya (PNG) |
| wajib aktif | ❌ Opsional |
| fallback | Lingkaran biasa tanpa ornamen |
| catatan | Desain frame harus memberi ruang di tengah untuk foto. Area tengah sekitar 60% dari total ukuran. |

---

### SLOT 6 — groom_frame
| Field | Value |
|---|---|
| slot_key | `groom_frame` |
| slot_label | Frame Mempelai Pria |
| slot_description | Bingkai ornamental untuk foto mempelai pria di section mempelai. |
| width_cm | 5 |
| height_cm | 5 |
| aspect_ratio | 1:1 |
| asset_type | image |
| transparent | ✅ Ya (PNG) |
| wajib aktif | ❌ Opsional |
| fallback | Lingkaran dengan border warna `colors.primary` |
| catatan | Konsisten dengan bride_frame dalam gaya tapi boleh berbeda warna aksen. |

---

### SLOT 7 — bride_frame
| Field | Value |
|---|---|
| slot_key | `bride_frame` |
| slot_label | Frame Mempelai Wanita |
| slot_description | Bingkai ornamental untuk foto mempelai wanita di section mempelai. |
| width_cm | 5 |
| height_cm | 5 |
| aspect_ratio | 1:1 |
| asset_type | image |
| transparent | ✅ Ya (PNG) |
| wajib aktif | ❌ Opsional |
| fallback | Lingkaran dengan border warna `colors.secondary` |
| catatan | Pasangkan dengan groom_frame agar visual seimbang. |

---

### SLOT 8 — quote_background
| Field | Value |
|---|---|
| slot_key | `quote_background` |
| slot_label | Background Ayat / Quote |
| slot_description | Background panel untuk section ayat Al-Quran atau quote pernikahan. |
| width_cm | 10 |
| height_cm | 6 |
| aspect_ratio | 5:3 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Warna solid `colors.surface` dengan border `colors.accent` |
| catatan | Pastikan ada overlay gelap/terang agar teks ayat tetap terbaca. Hindari gambar terlalu ramai. |

---

### SLOT 9 — love_story_background
| Field | Value |
|---|---|
| slot_key | `love_story_background` |
| slot_label | Background Kisah Cinta |
| slot_description | Background default untuk item-item di timeline kisah cinta. |
| width_cm | 10 |
| height_cm | 8 |
| aspect_ratio | 5:4 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Warna solid `colors.surface_card` |
| catatan | Dipakai sebagai background card tiap item kisah cinta jika item tidak punya foto sendiri. |

---

### SLOT 10 — countdown_background
| Field | Value |
|---|---|
| slot_key | `countdown_background` |
| slot_label | Background Countdown |
| slot_description | Background section hitung mundur menuju hari pernikahan. |
| width_cm | 12 |
| height_cm | 7 |
| aspect_ratio | 12:7 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Gradient dari `colors.primary` ke `colors.secondary` |
| catatan | Angka countdown harus tetap terbaca. Pakai overlay gelap jika gambar terlalu terang. |

---

### SLOT 11 — event_background
| Field | Value |
|---|---|
| slot_key | `event_background` |
| slot_label | Background Acara |
| slot_description | Background utama section akad dan resepsi. |
| width_cm | 12 |
| height_cm | 10 |
| aspect_ratio | 6:5 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ✅ Ya |
| fallback | Warna solid `colors.surface` |
| catatan | Section ini punya banyak teks. Pastikan kontras cukup. Bisa juga motif subtle/watermark. |

---

### SLOT 12 — akad_card
| Field | Value |
|---|---|
| slot_key | `akad_card` |
| slot_label | Card Akad |
| slot_description | Background card detail informasi akad nikah. |
| width_cm | 9 |
| height_cm | 6 |
| aspect_ratio | 3:2 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Warna solid `colors.surface_card` dengan border `colors.primary` |
| catatan | Ukuran lebih kecil dari event_background. Cocok untuk motif detail atau tekstur kertas. |

---

### SLOT 13 — reception_card
| Field | Value |
|---|---|
| slot_key | `reception_card` |
| slot_label | Card Resepsi |
| slot_description | Background card detail informasi resepsi. |
| width_cm | 9 |
| height_cm | 6 |
| aspect_ratio | 3:2 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Warna solid `colors.surface_card` dengan border `colors.secondary` |
| catatan | Sebaiknya konsisten dengan akad_card tapi boleh variasi warna aksen. |

---

### SLOT 14 — dresscode_background
| Field | Value |
|---|---|
| slot_key | `dresscode_background` |
| slot_label | Background Dress Code |
| slot_description | Background area informasi dress code dan palet warna yang disarankan untuk tamu. |
| width_cm | 8 |
| height_cm | 4 |
| aspect_ratio | 2:1 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Warna solid dari `invitation.dress_code_color_primary` |
| catatan | Section ini menampilkan swatch warna dress code. Background sebaiknya netral. |

---

### SLOT 15 — gallery_frame
| Field | Value |
|---|---|
| slot_key | `gallery_frame` |
| slot_label | Frame Galeri |
| slot_description | Overlay / bingkai dekoratif yang diterapkan pada setiap foto di carousel galeri. |
| width_cm | 10 |
| height_cm | 10 |
| aspect_ratio | 1:1 |
| asset_type | image |
| transparent | ✅ Ya (PNG) |
| wajib aktif | ❌ Opsional |
| fallback | Tidak ada frame, foto tampil polos |
| catatan | Frame di-overlay di atas foto galeri. Pastikan area tengah transparan agar foto terlihat. |

---

### SLOT 16 — love_gift_background
| Field | Value |
|---|---|
| slot_key | `love_gift_background` |
| slot_label | Background Amplop Digital |
| slot_description | Background section amplop digital dan rekening bank. |
| width_cm | 10 |
| height_cm | 8 |
| aspect_ratio | 5:4 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Gradient lembut dari `colors.accent` |
| catatan | Bisa ilustrasi amplop, bunga, atau motif dekoratif. Teks rekening harus terbaca jelas. |

---

### SLOT 17 — rsvp_background
| Field | Value |
|---|---|
| slot_key | `rsvp_background` |
| slot_label | Background RSVP & Ucapan |
| slot_description | Background section form konfirmasi kehadiran dan daftar ucapan tamu. |
| width_cm | 10 |
| height_cm | 8 |
| aspect_ratio | 5:4 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ✅ Ya |
| fallback | Warna solid `colors.surface` |
| catatan | Section ini punya form input dan list ucapan. Background sebaiknya terang dan tidak terlalu ramai. |

---

### SLOT 18 — sticky_nav_background
| Field | Value |
|---|---|
| slot_key | `sticky_nav_background` |
| slot_label | Background Sticky Nav |
| slot_description | Background navbar navigasi yang menempel di bawah layar saat scroll. |
| width_cm | 12 |
| height_cm | 2.5 |
| aspect_ratio | 24:5 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ❌ Opsional |
| fallback | Warna solid `colors.primary` dengan opacity 0.95 |
| catatan | Area sangat tipis. Gunakan motif horizontal subtle atau tekstur. Hindari detail vertikal. |

---

### SLOT 19 — floating_particles
| Field | Value |
|---|---|
| slot_key | `floating_particles` |
| slot_label | Partikel Animasi Melayang |
| slot_description | Kumpulan aset kecil yang dianimasikan melayang di seluruh halaman undangan. Bisa berupa kelopak bunga, daun, bintang, atau motif kecil khas budaya. |
| width_cm | 2 per aset |
| height_cm | 2 per aset |
| aspect_ratio | 1:1 |
| asset_type | image |
| transparent | ✅ Ya (PNG) |
| jumlah aset | Maksimal 6 aset berbeda |
| wajib aktif | ❌ Opsional |
| fallback | Tidak ada partikel animasi |
| storage | Disimpan sebagai array URL di `theme_asset_slots` dengan slot_key: `floating_particle_1` sampai `floating_particle_6` |
| catatan | Ukuran kecil dan sederhana. Semakin sederhana bentuknya, semakin ringan animasinya. |

---

### SLOT 20 — theme_thumbnail
| Field | Value |
|---|---|
| slot_key | `theme_thumbnail` |
| slot_label | Thumbnail Tema |
| slot_description | Gambar preview tema yang ditampilkan di dashboard admin (list tema) dan dashboard user (pilih tema). |
| width_cm | 6 |
| height_cm | 10.67 |
| aspect_ratio | 9:16 |
| asset_type | image |
| transparent | ❌ Tidak |
| wajib aktif | ✅ Ya |
| fallback | Tidak ada fallback — thumbnail wajib ada sebelum tema bisa diaktifkan |
| catatan | Ini adalah "wajah" tema. Buat semenarik mungkin. Bisa screenshot dari preview tema atau desain khusus. |

---

## Ringkasan Slot Per Kategori

### Wajib Terisi (5 + minimal 1 ornamen)
| slot_key | Rasio | Ukuran cm |
|---|---|---|
| cover_background | 9:16 | 12 × 21 |
| hero_background | 9:16 | 12 × 21 |
| theme_thumbnail | 9:16 | 6 × 10.67 |
| event_background | 6:5 | 12 × 10 |
| rsvp_background | 5:4 | 10 × 8 |
| hero_ornament_top *(min 1)* | 3:1 | 12 × 4 |
| hero_ornament_bottom *(min 1)* | 3:1 | 12 × 4 |

### Frame & Ornamen (PNG transparan)
| slot_key | Rasio | Ukuran cm |
|---|---|---|
| hero_ornament_top | 3:1 | 12 × 4 |
| hero_ornament_bottom | 3:1 | 12 × 4 |
| couple_frame | 1:1 | 8 × 8 |
| groom_frame | 1:1 | 5 × 5 |
| bride_frame | 1:1 | 5 × 5 |
| gallery_frame | 1:1 | 10 × 10 |
| floating_particles | 1:1 | 2 × 2 (×6) |

### Background Section (opsional)
| slot_key | Rasio | Ukuran cm |
|---|---|---|
| quote_background | 5:3 | 10 × 6 |
| love_story_background | 5:4 | 10 × 8 |
| countdown_background | 12:7 | 12 × 7 |
| akad_card | 3:2 | 9 × 6 |
| reception_card | 3:2 | 9 × 6 |
| dresscode_background | 2:1 | 8 × 4 |
| love_gift_background | 5:4 | 10 × 8 |
| sticky_nav_background | 24:5 | 12 × 2.5 |

---

## Seed SQL untuk theme_asset_slots

Gunakan query ini sebagai template untuk insert slot default
ketika admin membuat tema baru:

```sql
-- Fungsi untuk insert semua slot default saat tema baru dibuat
-- Panggil dengan theme_id yang baru dibuat

INSERT INTO theme_asset_slots
  (theme_id, slot_key, slot_label, slot_description, width_cm, height_cm, aspect_ratio, asset_type, display_order)
VALUES
  (:theme_id, 'cover_background',      'Background Cover',          'Gambar full screen pertama sebelum undangan dibuka',              12,    21,    '9:16',  'image', 1),
  (:theme_id, 'hero_background',       'Background Hero',           'Background utama setelah tombol buka undangan ditekan',           12,    21,    '9:16',  'image', 2),
  (:theme_id, 'hero_ornament_top',     'Ornamen Atas Hero',         'Ornamen dekoratif bagian atas hero, PNG transparan',             12,    4,     '3:1',   'image', 3),
  (:theme_id, 'hero_ornament_bottom',  'Ornamen Bawah Hero',        'Ornamen dekoratif bagian bawah hero, PNG transparan',            12,    4,     '3:1',   'image', 4),
  (:theme_id, 'couple_frame',          'Frame Foto Couple',         'Frame dekoratif untuk foto pasangan utama, PNG transparan',      8,     8,     '1:1',   'image', 5),
  (:theme_id, 'groom_frame',           'Frame Mempelai Pria',       'Frame ornamental untuk foto pria, PNG transparan',               5,     5,     '1:1',   'image', 6),
  (:theme_id, 'bride_frame',           'Frame Mempelai Wanita',     'Frame ornamental untuk foto wanita, PNG transparan',             5,     5,     '1:1',   'image', 7),
  (:theme_id, 'quote_background',      'Background Ayat / Quote',   'Background panel untuk section ayat atau quote',                 10,    6,     '5:3',   'image', 8),
  (:theme_id, 'love_story_background', 'Background Kisah Cinta',    'Background default item timeline kisah cinta',                   10,    8,     '5:4',   'image', 9),
  (:theme_id, 'countdown_background',  'Background Countdown',      'Background section hitung mundur hari H',                        12,    7,     '12:7',  'image', 10),
  (:theme_id, 'event_background',      'Background Acara',          'Background section akad dan resepsi',                            12,    10,    '6:5',   'image', 11),
  (:theme_id, 'akad_card',             'Card Akad',                 'Background card detail informasi akad',                          9,     6,     '3:2',   'image', 12),
  (:theme_id, 'reception_card',        'Card Resepsi',              'Background card detail informasi resepsi',                       9,     6,     '3:2',   'image', 13),
  (:theme_id, 'dresscode_background',  'Background Dress Code',     'Background area informasi dress code',                           8,     4,     '2:1',   'image', 14),
  (:theme_id, 'gallery_frame',         'Frame Galeri',              'Overlay bingkai dekoratif pada foto galeri, PNG transparan',     10,    10,    '1:1',   'image', 15),
  (:theme_id, 'love_gift_background',  'Background Amplop Digital', 'Background section amplop digital dan rekening bank',            10,    8,     '5:4',   'image', 16),
  (:theme_id, 'rsvp_background',       'Background RSVP & Ucapan',  'Background form konfirmasi dan daftar ucapan tamu',              10,    8,     '5:4',   'image', 17),
  (:theme_id, 'sticky_nav_background', 'Background Sticky Nav',     'Background navbar navigasi bawah layar',                         12,    2.5,   '24:5',  'image', 18),
  (:theme_id, 'floating_particle_1',   'Partikel Animasi 1',        'Aset kecil animasi melayang, PNG transparan',                    2,     2,     '1:1',   'image', 19),
  (:theme_id, 'floating_particle_2',   'Partikel Animasi 2',        'Aset kecil animasi melayang, PNG transparan',                    2,     2,     '1:1',   'image', 20),
  (:theme_id, 'floating_particle_3',   'Partikel Animasi 3',        'Aset kecil animasi melayang, PNG transparan',                    2,     2,     '1:1',   'image', 21),
  (:theme_id, 'floating_particle_4',   'Partikel Animasi 4',        'Aset kecil animasi melayang, PNG transparan',                    2,     2,     '1:1',   'image', 22),
  (:theme_id, 'floating_particle_5',   'Partikel Animasi 5',        'Aset kecil animasi melayang, PNG transparan',                    2,     2,     '1:1',   'image', 23),
  (:theme_id, 'floating_particle_6',   'Partikel Animasi 6',        'Aset kecil animasi melayang, PNG transparan',                    2,     2,     '1:1',   'image', 24),
  (:theme_id, 'theme_thumbnail',       'Thumbnail Tema',            'Preview tema di dashboard admin dan user',                       6,     10.67, '9:16',  'image', 25);
```

---

*SLOTS_SPEC.md — Managing Theme Assets*
*Bagian dari: `.claude/skills/managing-theme-assets/`*
```

***
