

**File: `.claude/skills/demo-mode-setup/MOCK_DATA.md`**

```markdown
# Struktur Lengkap Mock Data — Umuman Demo Mode

> File ini adalah referensi lengkap untuk semua file di `src/lib/mock/`.
> Salin struktur data ini ke masing-masing file yang sesuai.
> Semua data menggunakan konteks budaya Indonesia.

---

## src/lib/mock/invitation.ts

```typescript
import type { Invitation } from '@/types/invitation'

export const mockInvitation: Invitation = {
  id: 'demo-inv-001',
  user_id: 'demo-user-001',
  slug: 'budi-dan-ani-demo',
  status: 'active',
  active_theme_id: 'demo-theme-001',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  invitation_details: {
    // ── Mempelai ──────────────────────────────────────────────
    groom_name: 'Budi Santoso',
    groom_full_name: 'Muhammad Budi Santoso, S.T.',
    groom_father: 'Bapak H. Santoso',
    groom_mother: 'Ibu Hj. Sri Lestari',
    groom_photo_url: '/uploads/demo/groom.jpg',
    groom_instagram: '@budi.santoso',

    bride_name: 'Ani Rahayu',
    bride_full_name: 'Ani Rahayu Putri, S.Pd.',
    bride_father: 'Bapak H. Rahmat Hidayat',
    bride_mother: 'Ibu Hj. Sari Dewi',
    bride_photo_url: '/uploads/demo/bride.jpg',
    bride_instagram: '@ani.rahayu',

    couple_photo_url: '/uploads/demo/couple.jpg',
    background_photo_url: '/uploads/demo/background.jpg',

    // ── Ayat / Quote ──────────────────────────────────────────
    quote_text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenang dan tenteram kepadanya.',
    quote_source: 'QS. Ar-Rum: 21',

    // ── Akad ──────────────────────────────────────────────────
    akad_date: '2026-06-14T08:00:00Z',
    akad_venue: 'Masjid Al-Ikhlas',
    akad_address: 'Jl. Mawar No. 5, Kramat Jati, Jakarta Timur 13510',
    akad_maps_url: 'https://maps.google.com/?q=-6.2744,106.8693',
    akad_dress_code: 'Syar\'i, warna putih dan krem',

    // ── Resepsi ───────────────────────────────────────────────
    reception_date: '2026-06-14T11:00:00Z',
    reception_end_date: '2026-06-14T15:00:00Z',
    reception_venue: 'Gedung Serbaguna Nusantara',
    reception_address: 'Jl. Anggrek Raya No. 12, Duren Sawit, Jakarta Timur 13470',
    reception_maps_url: 'https://maps.google.com/?q=-6.2200,106.9100',
    reception_dress_code: 'Formal, warna gold dan krem',

    // ── Dress Code ────────────────────────────────────────────
    dress_code_color_primary: '#D4A373',
    dress_code_color_secondary: '#CCD5AE',
    dress_code_description: 'Nuansa Gold dan Sage Green. Hindari warna putih dan hitam pekat.',

    // ── Kisah Cinta ───────────────────────────────────────────
    love_story: [
      {
        id: 'ls-001',
        title: 'Pertama Kali Bertemu',
        date: '2022-03-15',
        narasi: 'Kami pertama kali bertemu di sebuah seminar nasional teknologi di Jakarta. Budi secara tidak sengaja duduk di sebelah Ani, dan dari sanalah percakapan pertama kami dimulai.',
        photo_url: '/uploads/demo/gallery1.jpg',
        display_order: 1
      },
      {
        id: 'ls-002',
        title: 'Jadian',
        date: '2022-08-17',
        narasi: 'Di hari kemerdekaan Indonesia, Budi memberanikan diri mengungkapkan perasaannya. Dengan latar belakang langit sore Jakarta yang indah, Ani menerima dengan senyum yang tidak pernah Budi lupakan.',
        photo_url: '/uploads/demo/gallery2.jpg',
        display_order: 2
      },
      {
        id: 'ls-003',
        title: 'Lamaran',
        date: '2025-12-25',
        narasi: 'Di penghujung tahun, dikelilingi oleh keluarga tercinta, Budi resmi melamar Ani dengan sebuah cincin sederhana namun penuh makna. Ani menjawab iya dengan air mata bahagia.',
        photo_url: '/uploads/demo/gallery3.jpg',
        display_order: 3
      }
    ],

    // ── Galeri ────────────────────────────────────────────────
    gallery_photos: [
      { url: '/uploads/demo/gallery1.jpg', caption: 'Momen Pertama' },
      { url: '/uploads/demo/gallery2.jpg', caption: 'Saat Jadian' },
      { url: '/uploads/demo/gallery3.jpg', caption: 'Hari Lamaran' },
      { url: '/uploads/demo/couple.jpg', caption: 'Foto Bersama' },
      { url: '/uploads/demo/groom.jpg', caption: 'Si Dia' },
      { url: '/uploads/demo/bride.jpg', caption: 'Calon Istri' }
    ],

    // ── Amplop Digital / Love Gift ────────────────────────────
    gift_enabled: true,
    gift_address: 'Jl. Mawar No. 5, Kramat Jati, Jakarta Timur 13510',
    qris_url: null,
    bank_accounts: [
      {
        id: 'bank-001',
        bank_name: 'BCA',
        account_number: '1234567890',
        account_name: 'Budi Santoso',
        logo_url: null
      },
      {
        id: 'bank-002',
        bank_name: 'Mandiri',
        account_number: '0987654321',
        account_name: 'Ani Rahayu',
        logo_url: null
      }
    ],

    // ── RSVP ──────────────────────────────────────────────────
    rsvp_enabled: true,
    rsvp_deadline: '2026-06-07T23:59:59Z',

    // ── Musik ─────────────────────────────────────────────────
    music_url: null,
    music_title: 'Can\'t Help Falling in Love',
    music_artist: 'Elvis Presley'
  }
}
```

---

## src/lib/mock/themes.ts

```typescript
import type { Theme, ThemeAssetSlot } from '@/types/theme'

// ── Satu tema aktif (dipakai mockInvitation) ──────────────────────────────
export const mockTheme: Theme = {
  id: 'demo-theme-001',
  name: 'Jawa Klasik',
  slug: 'jawa-klasik',
  description: 'Tema berbudaya Jawa dengan ornamen batik kawung dan warna sogan yang elegan. Cocok untuk pernikahan adat Jawa maupun modern dengan sentuhan tradisional.',
  cultural_category: 'Jawa',
  status: 'active',
  thumbnail_url: '/uploads/demo/themes/jawa-klasik/thumbnail.jpg',
  music_url: null,
  video_url: null,
  colors: {
    primary: '#8B4513',
    secondary: '#D2691E',
    accent: '#DAA520',
    surface: '#FFF8DC',
    surface_card: '#FFFBF0',
    text_primary: '#3E1C00',
    text_secondary: '#795548',
    overlay_color: '#3E1C00',
    overlay_opacity: 0.35
  },
  typography: {
    font_heading: 'Dancing Script',
    font_subheading: 'Playfair Display',
    font_body: 'Lato',
    font_accent: 'Great Vibes'
  },
  animation_settings: {
    hero_animation: 'petals',
    intensity: 'medium',
    parallax: true,
    scroll_reveal: true,
    music_autoplay_after_open: true,
    video_intro: false
  },
  style_settings: {
    border_radius: 'ornate',
    shadow_style: 'soft',
    button_style: 'rounded',
    card_style: 'bordered',
    divider_style: 'ornamental'
  },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z'
}

// ── Asset slots untuk tema Jawa Klasik ───────────────────────────────────
export const mockThemeSlots: ThemeAssetSlot[] = [
  {
    id: 'slot-001',
    theme_id: 'demo-theme-001',
    slot_key: 'cover_background',
    slot_label: 'Background Cover',
    slot_description: 'Gambar full screen yang muncul pertama kali sebelum undangan dibuka',
    width_cm: 12,
    height_cm: 21,
    aspect_ratio: '9:16',
    asset_url: '/uploads/demo/themes/jawa-klasik/cover_bg.jpg',
    asset_type: 'image',
    display_order: 1
  },
  {
    id: 'slot-002',
    theme_id: 'demo-theme-001',
    slot_key: 'hero_background',
    slot_label: 'Background Hero',
    slot_description: 'Background utama setelah tombol buka undangan ditekan',
    width_cm: 12,
    height_cm: 21,
    aspect_ratio: '9:16',
    asset_url: '/uploads/demo/themes/jawa-klasik/hero_bg.jpg',
    asset_type: 'image',
    display_order: 2
  },
  {
    id: 'slot-003',
    theme_id: 'demo-theme-001',
    slot_key: 'hero_ornament_top',
    slot_label: 'Ornamen Atas Hero',
    slot_description: 'Ornamen dekoratif bagian atas hero, PNG transparan',
    width_cm: 12,
    height_cm: 4,
    aspect_ratio: '3:1',
    asset_url: '/uploads/demo/themes/jawa-klasik/ornament_top.png',
    asset_type: 'image',
    display_order: 3
  },
  {
    id: 'slot-004',
    theme_id: 'demo-theme-001',
    slot_key: 'hero_ornament_bottom',
    slot_label: 'Ornamen Bawah Hero',
    slot_description: 'Ornamen dekoratif bagian bawah hero, PNG transparan',
    width_cm: 12,
    height_cm: 4,
    aspect_ratio: '3:1',
    asset_url: '/uploads/demo/themes/jawa-klasik/ornament_bottom.png',
    asset_type: 'image',
    display_order: 4
  },
  {
    id: 'slot-005',
    theme_id: 'demo-theme-001',
    slot_key: 'couple_frame',
    slot_label: 'Frame Foto Couple',
    slot_description: 'Frame dekoratif untuk foto pasangan utama di cover, PNG transparan',
    width_cm: 8,
    height_cm: 8,
    aspect_ratio: '1:1',
    asset_url: '/uploads/demo/themes/jawa-klasik/couple_frame.png',
    asset_type: 'image',
    display_order: 5
  },
  {
    id: 'slot-006',
    theme_id: 'demo-theme-001',
    slot_key: 'groom_frame',
    slot_label: 'Frame Mempelai Pria',
    slot_description: 'Frame ornamental untuk foto mempelai pria, PNG transparan',
    width_cm: 5,
    height_cm: 5,
    aspect_ratio: '1:1',
    asset_url: '/uploads/demo/themes/jawa-klasik/groom_frame.png',
    asset_type: 'image',
    display_order: 6
  },
  {
    id: 'slot-007',
    theme_id: 'demo-theme-001',
    slot_key: 'bride_frame',
    slot_label: 'Frame Mempelai Wanita',
    slot_description: 'Frame ornamental untuk foto mempelai wanita, PNG transparan',
    width_cm: 5,
    height_cm: 5,
    aspect_ratio: '1:1',
    asset_url: '/uploads/demo/themes/jawa-klasik/bride_frame.png',
    asset_type: 'image',
    display_order: 7
  },
  {
    id: 'slot-008',
    theme_id: 'demo-theme-001',
    slot_key: 'event_background',
    slot_label: 'Background Acara',
    slot_description: 'Background section akad dan resepsi',
    width_cm: 12,
    height_cm: 10,
    aspect_ratio: '6:5',
    asset_url: '/uploads/demo/themes/jawa-klasik/event_bg.jpg',
    asset_type: 'image',
    display_order: 8
  },
  {
    id: 'slot-009',
    theme_id: 'demo-theme-001',
    slot_key: 'rsvp_background',
    slot_label: 'Background RSVP',
    slot_description: 'Background section form ucapan dan daftar tamu',
    width_cm: 10,
    height_cm: 8,
    aspect_ratio: '5:4',
    asset_url: '/uploads/demo/themes/jawa-klasik/rsvp_bg.jpg',
    asset_type: 'image',
    display_order: 9
  },
  {
    id: 'slot-010',
    theme_id: 'demo-theme-001',
    slot_key: 'theme_thumbnail',
    slot_label: 'Thumbnail Tema',
    slot_description: 'Preview tema di dashboard admin dan user',
    width_cm: 6,
    height_cm: 10.67,
    aspect_ratio: '9:16',
    asset_url: '/uploads/demo/themes/jawa-klasik/thumbnail.jpg',
    asset_type: 'image',
    display_order: 10
  }
]

// ── Daftar semua tema tersedia (untuk halaman pilih tema user) ────────────
export const mockThemeList: Theme[] = [
  mockTheme,
  {
    id: 'demo-theme-002',
    name: 'Sunda Pasundan',
    slug: 'sunda-pasundan',
    description: 'Tema berbudaya Sunda dengan motif anyaman dan warna hijau daun bambu yang segar.',
    cultural_category: 'Sunda',
    status: 'active',
    thumbnail_url: '/uploads/demo/themes/sunda-pasundan/thumbnail.jpg',
    music_url: null,
    video_url: null,
    colors: {
      primary: '#2D6A4F',
      secondary: '#52B788',
      accent: '#95D5B2',
      surface: '#F0FFF4',
      surface_card: '#E8F5E9',
      text_primary: '#1B4332',
      text_secondary: '#40916C',
      overlay_color: '#1B4332',
      overlay_opacity: 0.3
    },
    typography: {
      font_heading: 'Cormorant Garamond',
      font_subheading: 'Libre Baskerville',
      font_body: 'Source Sans Pro',
      font_accent: 'Pinyon Script'
    },
    animation_settings: {
      hero_animation: 'sparkles',
      intensity: 'low',
      parallax: true,
      scroll_reveal: true,
      music_autoplay_after_open: true,
      video_intro: false
    },
    style_settings: {
      border_radius: 'soft',
      shadow_style: 'soft',
      button_style: 'pill',
      card_style: 'flat',
      divider_style: 'simple'
    },
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z'
  },
  {
    id: 'demo-theme-003',
    name: 'Modern Minimalis',
    slug: 'modern-minimalis',
    description: 'Tema modern dan bersih dengan tipografi elegan. Cocok untuk pasangan yang menyukai tampilan kontemporer.',
    cultural_category: 'Modern',
    status: 'active',
    thumbnail_url: '/uploads/demo/themes/modern-minimalis/thumbnail.jpg',
    music_url: null,
    video_url: null,
    colors: {
      primary: '#1A1A2E',
      secondary: '#E94560',
      accent: '#F5A623',
      surface: '#FAFAFA',
      surface_card: '#FFFFFF',
      text_primary: '#1A1A2E',
      text_secondary: '#6B7280',
      overlay_color: '#1A1A2E',
      overlay_opacity: 0.5
    },
    typography: {
      font_heading: 'Montserrat',
      font_subheading: 'Raleway',
      font_body: 'Inter',
      font_accent: 'Alex Brush'
    },
    animation_settings: {
      hero_animation: 'confetti',
      intensity: 'low',
      parallax: false,
      scroll_reveal: true,
      music_autoplay_after_open: false,
      video_intro: false
    },
    style_settings: {
      border_radius: 'medium',
      shadow_style: 'medium',
      button_style: 'square',
      card_style: 'shadow',
      divider_style: 'line'
    },
    created_at: '2026-01-03T00:00:00Z',
    updated_at: '2026-01-03T00:00:00Z'
  }
]
```

---

## src/lib/mock/rsvp.ts

```typescript
import type { RsvpMessage } from '@/types/rsvp'

export const mockRsvpMessages: RsvpMessage[] = [
  {
    id: 'rsvp-001',
    invitation_id: 'demo-inv-001',
    name: 'Siti Nurhaliza',
    attendance_status: 'hadir',
    number_of_guests: 2,
    message: 'Selamat ya Budi dan Ani! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Kami sekeluarga siap hadir! 🌸',
    created_at: '2026-05-01T10:00:00Z',
    is_read: false
  },
  {
    id: 'rsvp-002',
    invitation_id: 'demo-inv-001',
    name: 'Ahmad Fauzi',
    attendance_status: 'tidak_hadir',
    number_of_guests: 0,
    message: 'Maaf sekali tidak bisa hadir di hari istimewa kalian. Semoga acara berjalan lancar dan penuh berkah. Selamat menempuh hidup baru! 🙏',
    created_at: '2026-05-02T09:30:00Z',
    is_read: true
  },
  {
    id: 'rsvp-003',
    invitation_id: 'demo-inv-001',
    name: 'Dewi Ratnasari',
    attendance_status: 'ragu',
    number_of_guests: 1,
    message: 'InsyaAllah hadir kalau tidak ada halangan ya. Peluk cium dari jauh untuk kedua mempelai! 💕',
    created_at: '2026-05-03T14:15:00Z',
    is_read: false
  },
  {
    id: 'rsvp-004',
    invitation_id: 'demo-inv-001',
    name: 'Rudi Hermawan',
    attendance_status: 'hadir',
    number_of_guests: 3,
    message: 'Alhamdulillah, akhirnya jadian juga kalian 😄 Selamat! Kami sekeluarga pasti hadir!',
    created_at: '2026-05-04T08:00:00Z',
    is_read: true
  },
  {
    id: 'rsvp-005',
    invitation_id: 'demo-inv-001',
    name: 'Fitri Handayani',
    attendance_status: 'hadir',
    number_of_guests: 2,
    message: 'Selamat untuk Kak Budi dan Kak Ani! Semoga pernikahan ini menjadi awal dari cerita indah yang panjang. Ditunggu undangan resepsinya! 🎊',
    created_at: '2026-05-05T11:30:00Z',
    is_read: false
  }
]

export const mockRsvpStats = {
  total_responses: 5,
  hadir: 3,
  tidak_hadir: 1,
  ragu: 1,
  total_guests_attending: 8
}
```

---

## src/lib/mock/user.ts

```typescript
import type { User } from '@/types/user'

export const mockUser: User = {
  id: 'demo-user-001',
  email: 'demo@umuman.id',
  role: 'user',
  full_name: 'Demo User',
  avatar_url: null,
  created_at: '2026-01-01T00:00:00Z'
}

export const mockAdminUser: User = {
  id: 'demo-admin-001',
  email: 'admin@umuman.id',
  role: 'admin',
  full_name: 'Admin Umuman',
  avatar_url: null,
  created_at: '2026-01-01T00:00:00Z'
}

export const mockSession = {
  user: mockUser,
  access_token: 'demo-access-token-user',
  expires_at: 9999999999
}

export const mockAdminSession = {
  user: mockAdminUser,
  access_token: 'demo-access-token-admin',
  expires_at: 9999999999
}

// Preferensi tema user untuk demo undangan
export const mockUserThemePreferences = [
  {
    id: 'pref-001',
    invitation_id: 'demo-inv-001',
    theme_id: 'demo-theme-001',
    sort_order: 1,
    is_enabled: true,
    is_primary: true,
    theme: {
      name: 'Jawa Klasik',
      slug: 'jawa-klasik',
      thumbnail_url: '/uploads/demo/themes/jawa-klasik/thumbnail.jpg',
      cultural_category: 'Jawa'
    }
  },
  {
    id: 'pref-002',
    invitation_id: 'demo-inv-001',
    theme_id: 'demo-theme-002',
    sort_order: 2,
    is_enabled: true,
    is_primary: false,
    theme: {
      name: 'Sunda Pasundan',
      slug: 'sunda-pasundan',
      thumbnail_url: '/uploads/demo/themes/sunda-pasundan/thumbnail.jpg',
      cultural_category: 'Sunda'
    }
  },
  {
    id: 'pref-003',
    invitation_id: 'demo-inv-001',
    theme_id: 'demo-theme-003',
    sort_order: 3,
    is_enabled: false,
    is_primary: false,
    theme: {
      name: 'Modern Minimalis',
      slug: 'modern-minimalis',
      thumbnail_url: '/uploads/demo/themes/modern-minimalis/thumbnail.jpg',
      cultural_category: 'Modern'
    }
  }
]
```

---

## src/lib/mock/index.ts

```typescript
// Re-export semua mock data dari satu entry point
// Gunakan: import { mockInvitation, mockTheme } from '@/lib/mock'

export { mockInvitation } from './invitation'

export {
  mockTheme,
  mockThemeSlots,
  mockThemeList
} from './themes'

export {
  mockRsvpMessages,
  mockRsvpStats
} from './rsvp'

export {
  mockUser,
  mockAdminUser,
  mockSession,
  mockAdminSession,
  mockUserThemePreferences
} from './user'
```

---

*MOCK_DATA.md — Demo Mode Setup*
*Bagian dari: `.claude/skills/demo-mode-setup/`*
```
