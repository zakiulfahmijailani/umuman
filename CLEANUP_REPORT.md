# Laporan Perapian Kode (Code Cleanup & Refactoring) - Umuman Project

**Tanggal:** 2026-03-14

## 1. Status Checklist Task
✅ **TASK 1:** Audit Komponen Duplikat
✅ **TASK 2:** Pisahkan `demoData` dari `MasterInvitationRenderer`
✅ **TASK 3:** Buat Mapper untuk Konversi DB → TypeScript
✅ **TASK 4:** Tambah Error Boundary di Invitation Renderer
✅ **TASK 5:** Perkuat struktur `src/lib/` (validators & constants)

## 2. File yang Diubah
- `src/components/invitation/MasterInvitationRenderer.tsx` (Update tipe data `invitationData` dan bungkus dengan `InvitationErrorBoundary` per section)
- `src/app/admin/themes/[themeId]/preview/page.tsx` (Melempar prop eksplisit `invitationData` menggunakan `demoData` karena tidak ada fallback lagi)
- `src/components/invitation/RSVPForm.tsx` (Mengupdate logic validasi untuk menggunakan `rsvpSchema` dari folder `validators/`)

## 3. File yang Dibuat Baru
- `src/components/invitation/_AUDIT.md` (Hasil tracking grep dan list laporan penggunaan modul invitation components legacy)
- `src/types/invitation.ts` (Interface type definition map `InvitationData` yang dicerminkan dari property dummy `demoData.ts`)
- `src/lib/mappers/theme.mapper.ts` (Mapper dua arah antara `ThemeDbRow` standard snake_case dengan Custom TS Types `Theme` standard camelCase)
- `src/components/invitation/InvitationErrorBoundary.tsx` (Class component pembungkus render error react per-blok-fitur standar)
- `src/lib/validators/index.ts` (Fasilitas parsing schema zod schema form input)
- `src/lib/constants.ts` (Shared konstanta platform variable seperti limit upload, env default, dan metadata file max size)

## 4. File yang Diberi Tanda @deprecated
- `src/components/invitation/DigitalGiftSection.tsx`
- `src/components/invitation/MessageSection.tsx`

*(Kedua file tersebut setelah diaudit grep search secara menyeluruh ternyata sama sekali tidak diimport oleh file mana pun di project ini. Sangat direkomendasikan untuk dihapus pada siklus berikutnya.)*

## 5. Hal yang TIDAK Dikerjakan beserta Alasannya
- **Menghapus Base Component Lainnya (`HeroSection.tsx`, dll):** Semua base komponen lainnya tidak saya ubah/hapus melainkan dibiarkan utuh karena mereka *masih* digunakan (imported) oleh fallback template seperti `/invite/demo` atau `InvitationClientWrapper.tsx`. Hal ini sesuai dengan aturan *JANGAN hapus file yang masih di-import oleh file lain*.
- **Migrasi Zod Existing dari `RsvpSection.tsx` & `RSVPForm.tsx`:** Setelah diinspeksi, ternyata kedua file ini secara eksklusif menggunakan sistem conditional `if-else` reaktif React, belum mendefinisikan skema Zod internal (`const schema = z.object(...)`). Tapi Zod parser custom `rsvpSchema` baru sudah berhasil saya suntikkan secara sukses ke dalam handler submit `RSVPForm.tsx` dari `../lib/validators`.

## 6. Potensi Breaking Changes (Cek Manual Developer)
- Mulai sekarang semua halaman yang me-render `<MasterInvitationRenderer>` **mewajibkan adanya prop `invitationData`**. Fallback silent `|| demoData` yang dulu melayani halaman apabila prop empty sudah secara efektif dihapus, demi efisiensi compile size server chunk (mengeliminasi bocor bundle dummy ke target client).
  - Jika ada halaman dinamis user yang memanggil component ini sebelum DB siap, pastikan anda meneruskan fallback mock langsung di halaman tersebut.

## 7. Rekomendasi Langkah Selanjutnya
- Segera hapus komponen `@deprecated` (`DigitalGiftSection.tsx` dan `MessageSection.tsx`) agar project scope folder `invitation` lebih ringkas.
- Ganti logika `InvitationClientWrapper.tsx` dan tema `MinimalistWhite` etc., untuk langsung bergantung seutuhnya (full-reliant) ke Master Renderer dibandingkan terus menyangga komponen base lama jika ke depannya tema dinamis user sudah sepenuhnya mapan dengan Supabase active IDs.
- Pertimbangkan penggunaan Sentry atau middleware log tracking di komponen `InvitationErrorBoundary` untuk memandu developer dalam perbaikan production crash logs.
