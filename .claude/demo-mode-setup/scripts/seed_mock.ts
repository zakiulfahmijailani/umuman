/// <reference types="node" />

/**
 * seed_mock.ts — Umuman Demo Mode Setup
 * Bagian dari: .claude/skills/demo-mode-setup/scripts/
 *
 * Fungsi:
 * Membuat struktur folder dan file placeholder aset demo
 * di public/uploads/demo/ agar halaman demo bisa render
 * tanpa error gambar tidak ditemukan.
 *
 * Cara jalankan:
 *   cd C:\project_umuman\umuman
 *   npx ts-node .claude/skills/demo-mode-setup/scripts/seed_mock.ts
 *
 * Atau dengan tsx:
 *   npx tsx .claude/skills/demo-mode-setup/scripts/seed_mock.ts
 *
 * Output:
 * - Folder public/uploads/demo/ beserta subfolder tema
 * - File SVG placeholder untuk setiap slot gambar
 * - File src/lib/mock/ jika belum ada
 * - Laporan seed_result.txt
 */

import fs from 'node:fs'
import path from 'node:path'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ROOT = path.resolve(process.cwd())
const PUBLIC_UPLOADS = path.join(ROOT, 'public', 'uploads', 'demo')
const MOCK_LIB = path.join(ROOT, 'src', 'lib', 'mock')

// ─── STRUKTUR FOLDER YANG AKAN DIBUAT ────────────────────────────────────────
const FOLDERS = [
    'public/uploads/demo',
    'public/uploads/demo/themes',
    'public/uploads/demo/themes/jawa-klasik',
    'public/uploads/demo/themes/sunda-pasundan',
    'public/uploads/demo/themes/modern-minimalis',
    'public/uploads/themes/images',
    'public/uploads/themes/music',
    'public/uploads/themes/videos',
    'public/uploads/invitations',
    'src/lib/mock',
]

// ─── PLACEHOLDER IMAGES ───────────────────────────────────────────────────────
// Setiap item = { path, label, width, height, bgColor, textColor }
const PLACEHOLDER_IMAGES = [
    // ── Foto mempelai ──
    {
        filePath: 'public/uploads/demo/groom.jpg',
        label: 'Foto Pria',
        width: 400,
        height: 400,
        bgColor: '#8B4513',
        textColor: '#FFF8DC'
    },
    {
        filePath: 'public/uploads/demo/bride.jpg',
        label: 'Foto Wanita',
        width: 400,
        height: 400,
        bgColor: '#D2691E',
        textColor: '#FFF8DC'
    },
    {
        filePath: 'public/uploads/demo/couple.jpg',
        label: 'Foto Couple',
        width: 800,
        height: 800,
        bgColor: '#DAA520',
        textColor: '#3E1C00'
    },
    {
        filePath: 'public/uploads/demo/background.jpg',
        label: 'Background',
        width: 1080,
        height: 1920,
        bgColor: '#3E1C00',
        textColor: '#FFF8DC'
    },

    // ── Galeri ──
    {
        filePath: 'public/uploads/demo/gallery1.jpg',
        label: 'Galeri 1',
        width: 800,
        height: 600,
        bgColor: '#795548',
        textColor: '#FFF8DC'
    },
    {
        filePath: 'public/uploads/demo/gallery2.jpg',
        label: 'Galeri 2',
        width: 800,
        height: 600,
        bgColor: '#8D6E63',
        textColor: '#FFF8DC'
    },
    {
        filePath: 'public/uploads/demo/gallery3.jpg',
        label: 'Galeri 3',
        width: 800,
        height: 600,
        bgColor: '#A1887F',
        textColor: '#FFF8DC'
    },

    // ── Tema Jawa Klasik ──
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/thumbnail.jpg',
        label: 'Jawa Klasik\nThumbnail',
        width: 540,
        height: 960,
        bgColor: '#8B4513',
        textColor: '#FFF8DC'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/cover_bg.jpg',
        label: 'Jawa Klasik\nCover BG',
        width: 1080,
        height: 1920,
        bgColor: '#3E1C00',
        textColor: '#DAA520'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/hero_bg.jpg',
        label: 'Jawa Klasik\nHero BG',
        width: 1080,
        height: 1920,
        bgColor: '#5D1A00',
        textColor: '#DAA520'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/ornament_top.png',
        label: 'Ornamen Atas',
        width: 1080,
        height: 360,
        bgColor: 'transparent',
        textColor: '#DAA520'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/ornament_bottom.png',
        label: 'Ornamen Bawah',
        width: 1080,
        height: 360,
        bgColor: 'transparent',
        textColor: '#DAA520'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/couple_frame.png',
        label: 'Frame Couple',
        width: 400,
        height: 400,
        bgColor: 'transparent',
        textColor: '#DAA520'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/groom_frame.png',
        label: 'Frame Pria',
        width: 300,
        height: 300,
        bgColor: 'transparent',
        textColor: '#8B4513'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/bride_frame.png',
        label: 'Frame Wanita',
        width: 300,
        height: 300,
        bgColor: 'transparent',
        textColor: '#8B4513'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/event_bg.jpg',
        label: 'Jawa Klasik\nBG Acara',
        width: 1080,
        height: 900,
        bgColor: '#4A1000',
        textColor: '#DAA520'
    },
    {
        filePath: 'public/uploads/demo/themes/jawa-klasik/rsvp_bg.jpg',
        label: 'Jawa Klasik\nBG RSVP',
        width: 1080,
        height: 864,
        bgColor: '#2E0A00',
        textColor: '#FFF8DC'
    },

    // ── Tema Sunda Pasundan ──
    {
        filePath: 'public/uploads/demo/themes/sunda-pasundan/thumbnail.jpg',
        label: 'Sunda Pasundan\nThumbnail',
        width: 540,
        height: 960,
        bgColor: '#2D6A4F',
        textColor: '#F0FFF4'
    },

    // ── Tema Modern Minimalis ──
    {
        filePath: 'public/uploads/demo/themes/modern-minimalis/thumbnail.jpg',
        label: 'Modern Minimalis\nThumbnail',
        width: 540,
        height: 960,
        bgColor: '#1A1A2E',
        textColor: '#FAFAFA'
    },
]

// ─── HELPER: Buat SVG placeholder ─────────────────────────────────────────────
function createSvgPlaceholder(
    width: number,
    height: number,
    label: string,
    bgColor: string,
    textColor: string
): string {
    const isTransparent = bgColor === 'transparent'
    const bgRect = isTransparent
        ? `< rect width = "${width}" height = "${height}" fill = "none" stroke = "${textColor}" stroke - width="4" stroke - dasharray="12,6" /> `
        : `< rect width = "${width}" height = "${height}" fill = "${bgColor}" /> `

    const lines = label.split('\n')
    const lineHeight = 28
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2

    const textElements = lines
        .map(
            (line, i) =>
                `< text
x = "${width / 2}"
y = "${startY + i * lineHeight}"
font - family="Arial, sans-serif"
font - size="22"
font - weight="bold"
fill = "${textColor}"
text - anchor="middle"
dominant - baseline="middle"
    > ${line} </text>`
        )
        .join('\n')

    const dimensionText = `${width} × ${height} px`

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
>
  ${bgRect}
  ${textElements}
  <text
    x="${width / 2}"
    y="${startY + lines.length * lineHeight + 10}"
    font-family="Arial, sans-serif"
    font-size="16"
    fill="${textColor}"
    text-anchor="middle"
    dominant-baseline="middle"
    opacity="0.7"
  >${dimensionText}</text>
  <text
    x="${width / 2}"
    y="${height - 20}"
    font-family="Arial, sans-serif"
    font-size="14"
    fill="${textColor}"
    text-anchor="middle"
    dominant-baseline="middle"
    opacity="0.5"
  >umuman — demo placeholder</text>
</svg>`
}

// ─── HELPER: Tulis file (buat folder jika belum ada) ─────────────────────────
function writeFile(relativePath: string, content: string): void {
    const fullPath = path.join(ROOT, relativePath)
    const dir = path.dirname(fullPath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(fullPath, content, 'utf-8')
}

// ─── HELPER: Buat folder ──────────────────────────────────────────────────────
function ensureFolder(relativePath: string): void {
    const fullPath = path.join(ROOT, relativePath)
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
        console.log(`  📁 Dibuat: ${relativePath}`)
    } else {
        console.log(`  ✅ Sudah ada: ${relativePath}`)
    }
}

// ─── TEMPLATE FILE MOCK ───────────────────────────────────────────────────────
// Buat file index.ts mock jika belum ada
const MOCK_INDEX_CONTENT = `// src/lib/mock/index.ts
// Auto-generated oleh seed_mock.ts
// Re-export semua mock data dari satu entry point

export { mockInvitation } from './invitation'
export { mockTheme, mockThemeSlots, mockThemeList } from './themes'
export { mockRsvpMessages, mockRsvpStats } from './rsvp'
export {
  mockUser,
  mockAdminUser,
  mockSession,
  mockAdminSession,
  mockUserThemePreferences
} from './user'
`

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function seed() {
    const log: string[] = []
    const timestamp = new Date().toISOString()

    console.log('\n' + '='.repeat(60))
    console.log('  UMUMAN — SEED MOCK DATA')
    console.log(`  ${timestamp}`)
    console.log('='.repeat(60) + '\n')

    // ── Step 1: Buat semua folder ──────────────────────────────────────────
    console.log('[1] Membuat struktur folder...')
    log.push('[1] FOLDER')
    for (const folder of FOLDERS) {
        ensureFolder(folder)
        log.push(`  ${folder}`)
    }

    // ── Step 2: Buat placeholder images ───────────────────────────────────
    console.log('\n[2] Membuat placeholder images (SVG)...')
    log.push('\n[2] PLACEHOLDER IMAGES')

    let createdCount = 0
    let skippedCount = 0

    for (const img of PLACEHOLDER_IMAGES) {
        const fullPath = path.join(ROOT, img.filePath)

        if (fs.existsSync(fullPath)) {
            console.log(`  ⏭  Skip (sudah ada): ${img.filePath}`)
            log.push(`  SKIP: ${img.filePath}`)
            skippedCount++
            continue
        }

        const svg = createSvgPlaceholder(
            img.width,
            img.height,
            img.label,
            img.bgColor,
            img.textColor
        )

        // SVG bisa langsung dipakai sebagai .jpg/.png oleh browser untuk demo
        // (browser toleran, akan render sebagai gambar)
        // Untuk production, ganti dengan gambar real
        writeFile(img.filePath, svg)
        console.log(`  ✅ Dibuat: ${img.filePath} (${img.width}×${img.height})`)
        log.push(`  CREATED: ${img.filePath} — ${img.width}×${img.height}`)
        createdCount++
    }

    // ── Step 3: Buat src/lib/mock/index.ts jika belum ada ─────────────────
    console.log('\n[3] Mengecek src/lib/mock/index.ts...')
    log.push('\n[3] MOCK INDEX FILE')

    const mockIndexPath = path.join(ROOT, 'src', 'lib', 'mock', 'index.ts')
    if (!fs.existsSync(mockIndexPath)) {
        writeFile('src/lib/mock/index.ts', MOCK_INDEX_CONTENT)
        console.log('  ✅ Dibuat: src/lib/mock/index.ts')
        log.push('  CREATED: src/lib/mock/index.ts')
    } else {
        console.log('  ✅ Sudah ada: src/lib/mock/index.ts')
        log.push('  EXISTS: src/lib/mock/index.ts')
    }

    // ── Step 4: Buat .env.local dengan DEMO_MODE jika belum ada ───────────
    console.log('\n[4] Mengecek .env.local...')
    log.push('\n[4] ENV LOCAL')

    const envPath = path.join(ROOT, '.env.local')
    const demoModeKey = 'NEXT_PUBLIC_DEMO_MODE'

    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8')
        if (!envContent.includes(demoModeKey)) {
            fs.appendFileSync(envPath, `\n# Demo Mode\n${demoModeKey}=true\n`)
            console.log('  ✅ Ditambahkan NEXT_PUBLIC_DEMO_MODE=true ke .env.local')
            log.push('  APPENDED: NEXT_PUBLIC_DEMO_MODE=true')
        } else {
            console.log('  ✅ NEXT_PUBLIC_DEMO_MODE sudah ada di .env.local')
            log.push('  EXISTS: NEXT_PUBLIC_DEMO_MODE di .env.local')
        }
    } else {
        writeFile(
            '.env.local',
            `# Auto-generated oleh seed_mock.ts\n# Demo Mode\n${demoModeKey}=true\n`
        )
        console.log('  ✅ Dibuat .env.local dengan NEXT_PUBLIC_DEMO_MODE=true')
        log.push('  CREATED: .env.local')
    }

    // ── Step 5: Tulis laporan ──────────────────────────────────────────────
    const reportPath = path.join(ROOT, 'seed_result.txt')
    const report = [
        '='.repeat(60),
        '  UMUMAN — SEED MOCK RESULT',
        `  ${timestamp}`,
        '='.repeat(60),
        '',
        ...log,
        '',
        '─'.repeat(60),
        'RINGKASAN',
        '─'.repeat(60),
        `  Placeholder dibuat : ${createdCount}`,
        `  Di-skip (sudah ada): ${skippedCount}`,
        `  Total diproses      : ${PLACEHOLDER_IMAGES.length}`,
        '',
        'LANGKAH SELANJUTNYA:',
        '  1. Jalankan: npm run dev',
        '  2. Buka: http://localhost:3000/invite/demo',
        '  3. Buka: http://localhost:3000/dashboard/admin/themes/demo',
        '  4. Buka: http://localhost:3000/dashboard/themes/demo',
        '  5. Ganti placeholder dengan gambar real saat siap production',
        '  6. Set NEXT_PUBLIC_DEMO_MODE=false di .env.local untuk mode production',
        '',
        'CATATAN:',
        '  File placeholder berupa SVG yang disimpan dengan ekstensi .jpg/.png.',
        '  Browser akan tetap me-render SVG sebagai gambar untuk keperluan demo.',
        '  Ganti dengan gambar real (JPEG/PNG) sebelum production deploy.',
        '='.repeat(60),
    ].join('\n')

    fs.writeFileSync(reportPath, report, 'utf-8')

    // ── Summary ────────────────────────────────────────────────────────────
    console.log('\n' + '='.repeat(60))
    console.log('  SELESAI')
    console.log('─'.repeat(60))
    console.log(`  Placeholder dibuat : ${createdCount}`)
    console.log(`  Di-skip            : ${skippedCount}`)
    console.log(`  Laporan            : seed_result.txt`)
    console.log('─'.repeat(60))
    console.log('  Jalankan: npm run dev')
    console.log('  Buka: http://localhost:3000/invite/demo')
    console.log('='.repeat(60) + '\n')
}

seed().catch((err) => {
    console.error('❌ Seed gagal:', err)
    process.exit(1)
})
