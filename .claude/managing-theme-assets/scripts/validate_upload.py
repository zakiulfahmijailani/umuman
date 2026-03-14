
r"""
validate_upload.py — Umuman Managing Theme Assets
Bagian dari: .claude/skills/managing-theme-assets/scripts/

Fungsi:
Memvalidasi file aset tema sebelum diupload ke sistem.
Mengecek rasio gambar, ukuran file, tipe file, dan transparansi PNG.
Bisa dijalankan manual oleh agent atau developer.

Cara jalankan:
    cd C:\project_umuman\umuman

    # Validasi satu file terhadap slot tertentu:
    python .claude/skills/managing-theme-assets/scripts/validate_upload.py \
        --file path/to/image.jpg \
        --slot cover_background

    # Validasi semua file dalam satu folder tema:
    python .claude/skills/managing-theme-assets/scripts/validate_upload.py \
        --folder path/to/theme-folder/ \
        --theme jawa-klasik

    # Lihat daftar semua slot dan spesifikasinya:
    python .claude/skills/managing-theme-assets/scripts/validate_upload.py \
        --list-slots

Output:
    - Hasil validasi di terminal
    - File validate_result.txt di root umuman
"""

import os
import sys
import argparse
import struct
import zlib
from datetime import datetime
from pathlib import Path

# ─── SPESIFIKASI SEMUA SLOT ────────────────────────────────────────────────────
SLOT_SPECS = {
    'cover_background': {
        'label': 'Background Cover',
        'width_cm': 12, 'height_cm': 21,
        'aspect_ratio': (9, 16),
        'transparent': False,
        'required': True,
        'max_mb': 5,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'hero_background': {
        'label': 'Background Hero',
        'width_cm': 12, 'height_cm': 21,
        'aspect_ratio': (9, 16),
        'transparent': False,
        'required': True,
        'max_mb': 5,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'hero_ornament_top': {
        'label': 'Ornamen Atas Hero',
        'width_cm': 12, 'height_cm': 4,
        'aspect_ratio': (3, 1),
        'transparent': True,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['png', 'svg'],
    },
    'hero_ornament_bottom': {
        'label': 'Ornamen Bawah Hero',
        'width_cm': 12, 'height_cm': 4,
        'aspect_ratio': (3, 1),
        'transparent': True,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['png', 'svg'],
    },
    'couple_frame': {
        'label': 'Frame Foto Couple',
        'width_cm': 8, 'height_cm': 8,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['png', 'svg'],
    },
    'groom_frame': {
        'label': 'Frame Mempelai Pria',
        'width_cm': 5, 'height_cm': 5,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 2,
        'allowed_types': ['png', 'svg'],
    },
    'bride_frame': {
        'label': 'Frame Mempelai Wanita',
        'width_cm': 5, 'height_cm': 5,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 2,
        'allowed_types': ['png', 'svg'],
    },
    'quote_background': {
        'label': 'Background Ayat / Quote',
        'width_cm': 10, 'height_cm': 6,
        'aspect_ratio': (5, 3),
        'transparent': False,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'love_story_background': {
        'label': 'Background Kisah Cinta',
        'width_cm': 10, 'height_cm': 8,
        'aspect_ratio': (5, 4),
        'transparent': False,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'countdown_background': {
        'label': 'Background Countdown',
        'width_cm': 12, 'height_cm': 7,
        'aspect_ratio': (12, 7),
        'transparent': False,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'event_background': {
        'label': 'Background Acara',
        'width_cm': 12, 'height_cm': 10,
        'aspect_ratio': (6, 5),
        'transparent': False,
        'required': True,
        'max_mb': 5,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'akad_card': {
        'label': 'Card Akad',
        'width_cm': 9, 'height_cm': 6,
        'aspect_ratio': (3, 2),
        'transparent': False,
        'required': False,
        'max_mb': 2,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'reception_card': {
        'label': 'Card Resepsi',
        'width_cm': 9, 'height_cm': 6,
        'aspect_ratio': (3, 2),
        'transparent': False,
        'required': False,
        'max_mb': 2,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'dresscode_background': {
        'label': 'Background Dress Code',
        'width_cm': 8, 'height_cm': 4,
        'aspect_ratio': (2, 1),
        'transparent': False,
        'required': False,
        'max_mb': 2,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'gallery_frame': {
        'label': 'Frame Galeri',
        'width_cm': 10, 'height_cm': 10,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['png', 'svg'],
    },
    'love_gift_background': {
        'label': 'Background Amplop Digital',
        'width_cm': 10, 'height_cm': 8,
        'aspect_ratio': (5, 4),
        'transparent': False,
        'required': False,
        'max_mb': 3,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'rsvp_background': {
        'label': 'Background RSVP & Ucapan',
        'width_cm': 10, 'height_cm': 8,
        'aspect_ratio': (5, 4),
        'transparent': False,
        'required': True,
        'max_mb': 3,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'sticky_nav_background': {
        'label': 'Background Sticky Nav',
        'width_cm': 12, 'height_cm': 2.5,
        'aspect_ratio': (24, 5),
        'transparent': False,
        'required': False,
        'max_mb': 1,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
    'floating_particle_1': {
        'label': 'Partikel Animasi 1',
        'width_cm': 2, 'height_cm': 2,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 0.5,
        'allowed_types': ['png', 'svg'],
    },
    'floating_particle_2': {
        'label': 'Partikel Animasi 2',
        'width_cm': 2, 'height_cm': 2,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 0.5,
        'allowed_types': ['png', 'svg'],
    },
    'floating_particle_3': {
        'label': 'Partikel Animasi 3',
        'width_cm': 2, 'height_cm': 2,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 0.5,
        'allowed_types': ['png', 'svg'],
    },
    'floating_particle_4': {
        'label': 'Partikel Animasi 4',
        'width_cm': 2, 'height_cm': 2,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 0.5,
        'allowed_types': ['png', 'svg'],
    },
    'floating_particle_5': {
        'label': 'Partikel Animasi 5',
        'width_cm': 2, 'height_cm': 2,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 0.5,
        'allowed_types': ['png', 'svg'],
    },
    'floating_particle_6': {
        'label': 'Partikel Animasi 6',
        'width_cm': 2, 'height_cm': 2,
        'aspect_ratio': (1, 1),
        'transparent': True,
        'required': False,
        'max_mb': 0.5,
        'allowed_types': ['png', 'svg'],
    },
    'theme_thumbnail': {
        'label': 'Thumbnail Tema',
        'width_cm': 6, 'height_cm': 10.67,
        'aspect_ratio': (9, 16),
        'transparent': False,
        'required': True,
        'max_mb': 2,
        'allowed_types': ['jpg', 'jpeg', 'png', 'webp'],
    },
}

RATIO_TOLERANCE = 0.1


# ─── HELPERS: BACA DIMENSI GAMBAR TANPA LIBRARY EXTERNAL ──────────────────────

def get_image_dimensions(filepath: str):
    """
    Baca dimensi gambar dari header file tanpa library PIL/Pillow.
    Support: JPEG, PNG, WebP, GIF, SVG
    Returns: (width, height) atau (None, None)
    """
    ext = Path(filepath).suffix.lower()

    try:
        with open(filepath, 'rb') as f:
            data = f.read(26)

        # ── PNG ──────────────────────────────────────────────────────────────
        if ext == '.png' and data[:8] == b'\x89PNG\r\n\x1a\n':
            w, h = struct.unpack('>II', data[16:24])
            return w, h

        # ── JPEG ─────────────────────────────────────────────────────────────
        if ext in ('.jpg', '.jpeg') and data[:2] == b'\xff\xd8':
            with open(filepath, 'rb') as f:
                f.read(2)
                while True:
                    marker = f.read(2)
                    if len(marker) < 2:
                        break
                    if marker[0] != 0xFF:
                        break
                    if marker[1] in (0xC0, 0xC1, 0xC2):
                        f.read(3)
                        h, w = struct.unpack('>HH', f.read(4))
                        return w, h
                    else:
                        length = struct.unpack('>H', f.read(2))[0]
                        f.read(length - 2)
            return None, None

        # ── WebP ─────────────────────────────────────────────────────────────
        if ext == '.webp' and data[:4] == b'RIFF' and data[8:12] == b'WEBP':
            with open(filepath, 'rb') as f:
                f.seek(12)
                chunk = f.read(4)
                if chunk == b'VP8 ':
                    f.read(4)
                    f.read(3)
                    w = struct.unpack('<H', f.read(2))[0] & 0x3FFF
                    h = struct.unpack('<H', f.read(2))[0] & 0x3FFF
                    return w, h
                elif chunk == b'VP8L':
                    f.read(4)
                    f.read(1)
                    b = struct.unpack('<I', f.read(4))[0]
                    w = (b & 0x3FFF) + 1
                    h = ((b >> 14) & 0x3FFF) + 1
                    return w, h
            return None, None

        # ── SVG ───────────────────────────────────────────────────────────────
        if ext == '.svg':
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(2000)
            import re
            w_match = re.search(r'width=["\'](\d+(?:\.\d+)?)', content)
            h_match = re.search(r'height=["\'](\d+(?:\.\d+)?)', content)
            if w_match and h_match:
                return float(w_match.group(1)), float(h_match.group(1))
            vb_match = re.search(r'viewBox=["\'][\d.]+ [\d.]+ ([\d.]+) ([\d.]+)', content)
            if vb_match:
                return float(vb_match.group(1)), float(vb_match.group(2))
            return None, None

    except Exception:
        pass

    return None, None


def check_png_has_alpha(filepath: str) -> bool:
    """Cek apakah PNG punya alpha channel (transparan)."""
    try:
        with open(filepath, 'rb') as f:
            data = f.read(26)
        if data[:8] != b'\x89PNG\r\n\x1a\n':
            return False
        color_type = data[25]
        # color_type 4 = Grayscale+Alpha, 6 = RGBA
        return color_type in (4, 6)
    except Exception:
        return False


def get_file_size_mb(filepath: str) -> float:
    """Kembalikan ukuran file dalam MB."""
    try:
        return os.path.getsize(filepath) / (1024 * 1024)
    except Exception:
        return 0.0


def get_file_ext(filepath: str) -> str:
    """Kembalikan ekstensi file tanpa titik, lowercase."""
    return Path(filepath).suffix.lower().lstrip('.')


# ─── VALIDASI SATU FILE ────────────────────────────────────────────────────────

def validate_file(filepath: str, slot_key: str) -> dict:
    """
    Validasi satu file terhadap spesifikasi slot.
    Returns dict hasil validasi lengkap.
    """
    result = {
        'file': filepath,
        'slot_key': slot_key,
        'slot_label': '',
        'valid': True,
        'errors': [],
        'warnings': [],
        'info': {}
    }

    # Cek slot exists
    if slot_key not in SLOT_SPECS:
        result['valid'] = False
        result['errors'].append(
            f"Slot '{slot_key}' tidak dikenal. "
            f"Jalankan --list-slots untuk melihat semua slot."
        )
        return result

    spec = SLOT_SPECS[slot_key]
    result['slot_label'] = spec['label']

    # Cek file exists
    if not os.path.exists(filepath):
        result['valid'] = False
        result['errors'].append(f"File tidak ditemukan: {filepath}")
        return result

    ext = get_file_ext(filepath)
    size_mb = get_file_size_mb(filepath)
    width, height = get_image_dimensions(filepath)

    result['info'] = {
        'extension': ext,
        'size_mb': round(size_mb, 2),
        'width_px': width,
        'height_px': height,
    }

    # ── Cek tipe file ─────────────────────────────────────────────────────
    if ext not in spec['allowed_types']:
        result['valid'] = False
        result['errors'].append(
            f"Tipe file tidak didukung: .{ext}. "
            f"Slot ini menerima: {', '.join('.' + t for t in spec['allowed_types'])}"
        )

    # ── Cek ukuran file ───────────────────────────────────────────────────
    if size_mb > spec['max_mb']:
        result['valid'] = False
        result['errors'].append(
            f"Ukuran file terlalu besar: {size_mb:.2f} MB. "
            f"Maksimal untuk slot ini: {spec['max_mb']} MB."
        )
    elif size_mb > spec['max_mb'] * 0.8:
        result['warnings'].append(
            f"Ukuran file mendekati batas: {size_mb:.2f} MB "
            f"(batas: {spec['max_mb']} MB). Pertimbangkan kompresi."
        )

    # ── Cek transparansi PNG ──────────────────────────────────────────────
    if spec['transparent'] and ext == 'png':
        has_alpha = check_png_has_alpha(filepath)
        if not has_alpha:
            result['warnings'].append(
                f"Slot ini sebaiknya menggunakan PNG dengan alpha channel (transparan), "
                f"tapi file ini tidak punya alpha. "
                f"Pastikan latar belakang gambar transparan."
            )
    elif spec['transparent'] and ext not in ('png', 'svg'):
        result['errors'].append(
            f"Slot ini membutuhkan gambar transparan. "
            f"Gunakan PNG atau SVG dengan alpha channel."
        )

    # ── Cek rasio ─────────────────────────────────────────────────────────
    if width and height:
        target_w, target_h = spec['aspect_ratio']
        target_ratio = target_w / target_h
        actual_ratio = width / height
        ratio_diff = abs(target_ratio - actual_ratio)

        result['info']['aspect_ratio_target'] = f"{target_w}:{target_h}"
        result['info']['aspect_ratio_actual'] = f"{width}:{height} ({actual_ratio:.3f})"

        if ratio_diff > RATIO_TOLERANCE:
            result['warnings'].append(
                f"Rasio gambar tidak sesuai rekomendasi. "
                f"Target: {target_w}:{target_h} ({target_ratio:.3f}), "
                f"Aktual: {width}:{height} ({actual_ratio:.3f}). "
                f"Selisih: {ratio_diff:.3f} (toleransi: {RATIO_TOLERANCE}). "
                f"Gambar akan di-crop center otomatis saat dipakai."
            )
        else:
            result['info']['ratio_status'] = '✅ Sesuai'
    else:
        result['warnings'].append(
            "Tidak bisa membaca dimensi gambar. "
            "Pastikan file tidak korup."
        )

    # ── Rekomendasi dimensi piksel ────────────────────────────────────────
    # Standar: 96 DPI → 1 cm = ~37.8 px
    # Untuk layar HiDPI: 1 cm = ~75.6 px (2x)
    dpi_96 = 37.8
    rec_w = round(spec['width_cm'] * dpi_96 * 2)   # 2x untuk HiDPI
    rec_h = round(spec['height_cm'] * dpi_96 * 2)
    result['info']['recommended_px'] = f"{rec_w} × {rec_h} px (HiDPI 2x)"

    return result


# ─── VALIDASI FOLDER TEMA ──────────────────────────────────────────────────────

def validate_theme_folder(folder_path: str, theme_name: str) -> list:
    """
    Validasi semua file dalam folder tema.
    Mencoba mencocokkan nama file dengan slot_key.
    """
    results = []

    if not os.path.exists(folder_path):
        print(f"❌ Folder tidak ditemukan: {folder_path}")
        return results

    files = os.listdir(folder_path)

    for filename in files:
        filepath = os.path.join(folder_path, filename)
        if not os.path.isfile(filepath):
            continue

        # Coba cocokkan nama file dengan slot_key
        stem = Path(filename).stem.lower().replace('-', '_')
        matched_slot = None

        # Coba exact match dulu
        if stem in SLOT_SPECS:
            matched_slot = stem

        # Coba partial match
        if not matched_slot:
            for slot_key in SLOT_SPECS:
                if slot_key in stem or stem in slot_key:
                    matched_slot = slot_key
                    break

        if matched_slot:
            result = validate_file(filepath, matched_slot)
            results.append(result)
        else:
            results.append({
                'file': filepath,
                'slot_key': '(tidak dikenal)',
                'slot_label': '(tidak dikenal)',
                'valid': None,
                'errors': [],
                'warnings': [f"Nama file '{filename}' tidak cocok dengan slot manapun. Diabaikan."],
                'info': {}
            })

    return results


# ─── PRINT HELPERS ────────────────────────────────────────────────────────────

def print_result(result: dict):
    status = '✅ VALID' if result['valid'] else '❌ TIDAK VALID'
    if result['valid'] is None:
        status = '⏭  SKIP'

    print(f"\n  {status} — {Path(result['file']).name}")
    print(f"  Slot  : {result['slot_key']} ({result['slot_label']})")

    if result['info']:
        info = result['info']
        if 'extension' in info:
            print(f"  Tipe  : .{info['extension']}  |  Ukuran: {info.get('size_mb', '?')} MB")
        if info.get('width_px'):
            print(f"  Px    : {info['width_px']} × {info['height_px']}")
        if info.get('recommended_px'):
            print(f"  Rec   : {info['recommended_px']}")
        if info.get('aspect_ratio_actual'):
            print(f"  Rasio : {info['aspect_ratio_actual']} → target {info.get('aspect_ratio_target', '?')}")

    for err in result['errors']:
        print(f"  ⛔ {err}")
    for warn in result['warnings']:
        print(f"  ⚠️  {warn}")


def print_slots_list():
    print('\n' + '=' * 70)
    print('  DAFTAR SEMUA SLOT TEMA — UMUMAN')
    print('=' * 70)
    print(f"  {'SLOT KEY':<30} {'RASIO':<8} {'CM':<16} {'WAJIB':<8} {'TRANSPARAN'}")
    print('─' * 70)
    for key, spec in SLOT_SPECS.items():
        ratio = f"{spec['aspect_ratio'][0]}:{spec['aspect_ratio'][1]}"
        cm = f"{spec['width_cm']}×{spec['height_cm']}"
        required = '✅ Ya' if spec['required'] else '  -'
        transparent = '✅ Ya' if spec['transparent'] else '  -'
        print(f"  {key:<30} {ratio:<8} {cm:<16} {required:<8} {transparent}")
    print('─' * 70)
    print(f"  Total: {len(SLOT_SPECS)} slot\n")


# ─── GENERATE REPORT ──────────────────────────────────────────────────────────

def generate_report(results: list, output_file: str, mode: str, target: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines = [
        '=' * 70,
        '  UMUMAN — VALIDATE UPLOAD RESULT',
        f'  Dibuat  : {timestamp}',
        f'  Mode    : {mode}',
        f'  Target  : {target}',
        '=' * 70,
    ]

    total = len(results)
    valid = sum(1 for r in results if r['valid'] is True)
    invalid = sum(1 for r in results if r['valid'] is False)
    skipped = sum(1 for r in results if r['valid'] is None)
    has_warnings = sum(1 for r in results if r['warnings'])

    lines.append(f"\nTotal file   : {total}")
    lines.append(f"Valid        : {valid}")
    lines.append(f"Tidak valid  : {invalid}")
    lines.append(f"Ada warning  : {has_warnings}")
    lines.append(f"Di-skip      : {skipped}")
    lines.append('')

    for r in results:
        status = 'VALID' if r['valid'] else 'INVALID' if r['valid'] is False else 'SKIP'
        lines.append(f"\n[{status}] {Path(r['file']).name}")
        lines.append(f"  Slot  : {r['slot_key']} — {r['slot_label']}")
        if r['info']:
            for k, v in r['info'].items():
                lines.append(f"  {k:<25}: {v}")
        for err in r['errors']:
            lines.append(f"  ERROR   : {err}")
        for warn in r['warnings']:
            lines.append(f"  WARNING : {warn}")

    lines.append('\n' + '=' * 70)
    lines.append('  REKOMENDASI')
    lines.append('─' * 70)
    if invalid > 0:
        lines.append('  ⛔ Ada file yang tidak valid. Perbaiki sebelum upload ke sistem.')
    if has_warnings > 0:
        lines.append('  ⚠️  Ada file dengan warning. Review sebelum upload.')
    if invalid == 0 and has_warnings == 0:
        lines.append('  ✅ Semua file siap diupload ke sistem.')
    lines.append('=' * 70)

    report = '\n'.join(lines)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)
    return report


# ─── MAIN ─────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Validasi file aset tema umuman sebelum diupload.'
    )
    parser.add_argument('--file', help='Path ke file yang divalidasi')
    parser.add_argument('--slot', help='Slot key target (lihat --list-slots)')
    parser.add_argument('--folder', help='Path ke folder tema untuk validasi batch')
    parser.add_argument('--theme', default='unknown', help='Nama tema (untuk laporan)')
    parser.add_argument('--output', default='validate_result.txt', help='Nama file output')
    parser.add_argument('--list-slots', action='store_true', help='Tampilkan semua slot')

    args = parser.parse_args()

    # ── List slots ────────────────────────────────────────────────────────
    if args.list_slots:
        print_slots_list()
        sys.exit(0)

    results = []

    # ── Validasi satu file ────────────────────────────────────────────────
    if args.file and args.slot:
        print(f"\n{'=' * 60}")
        print(f"  VALIDASI FILE: {args.file}")
        print(f"  SLOT: {args.slot}")
        print(f"{'=' * 60}")
        result = validate_file(args.file, args.slot)
        results.append(result)
        print_result(result)
        mode = 'single-file'
        target = args.file

    # ── Validasi folder ───────────────────────────────────────────────────
    elif args.folder:
        print(f"\n{'=' * 60}")
        print(f"  VALIDASI FOLDER TEMA: {args.folder}")
        print(f"  TEMA: {args.theme}")
        print(f"{'=' * 60}")
        results = validate_theme_folder(args.folder, args.theme)
        for r in results:
            print_result(r)
        mode = 'folder'
        target = args.folder

    else:
        parser.print_help()
        print('\nContoh penggunaan:')
        print('  python validate_upload.py --file cover.jpg --slot cover_background')
        print('  python validate_upload.py --folder ./themes/jawa-klasik/ --theme jawa-klasik')
        print('  python validate_upload.py --list-slots')
        sys.exit(1)

    # ── Summary ───────────────────────────────────────────────────────────
    valid_count = sum(1 for r in results if r['valid'] is True)
    invalid_count = sum(1 for r in results if r['valid'] is False)

    print(f"\n{'─' * 60}")
    print(f"  Total  : {len(results)}")
    print(f"  ✅ Valid    : {valid_count}")
    print(f"  ❌ Invalid  : {invalid_count}")
    print(f"  Laporan: {args.output}")
    print(f"{'─' * 60}\n")

    generate_report(results, args.output, mode, target)

    # Exit code 1 jika ada file tidak valid
    sys.exit(1 if invalid_count > 0 else 0)
