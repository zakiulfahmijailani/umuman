# Audit Report: Base Invitation Components

Date: 2026-03-14

## Active Components (Still Imported)
These base components are still being imported in the project:
- `BottomNavbar.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `CountdownSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `CoupleSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `CoverSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `EventSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `GallerySection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `Guestbook.tsx` (in various Theme files: `RusticBoho`, `SundaneseElegance`, `ModernBold`, `MinimalistWhite`, `GardenRomance`, `ClassicJavanese`)
- `HeroSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `LoveGiftSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `LoveStorySection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `QuoteSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)
- `RSVPForm.tsx` (in various Theme files: `RusticBoho`, `SundaneseElegance`, `ModernBold`, `MinimalistWhite`, `GardenRomance`, `ClassicJavanese`)
- `RsvpSection.tsx` (in `InvitationClientWrapper.tsx`, `demo/page.tsx`)

## Unused Components (Marked @deprecated)
These base components are NOT imported anywhere in the project. They have been flagged with a `@deprecated` annotation.
- `DigitalGiftSection.tsx`
- `MessageSection.tsx`

## Recommendations
Do not delete the active components yet because they are still acting as the default rendered components for standard non-themed pages (e.g. `InvitationClientWrapper.tsx` and `/invite/demo`). Consider migrating `InvitationClientWrapper` to only use `MasterInvitationRenderer` and the `themed/` components in a future cycle. The `@deprecated` components can be safely deleted.
