import type { Theme, ThemeAssetSlot } from "@/types/theme";

export interface ThemeDbRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cultural_category: string;
  status: 'draft' | 'active' | 'archived';
  thumbnail_url: string | null;
  music_url: string | null;
  video_url: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    surface_card: string;
    text_primary: string;
    text_secondary: string;
    overlay_color: string;
    overlay_opacity: number;
  };
  typography: {
    font_heading: string;
    font_subheading: string;
    font_body: string;
    font_accent: string;
  };
  animation_settings: {
    hero_animation: string;
    intensity: string;
    parallax: boolean;
    scroll_reveal: boolean;
    music_autoplay_after_open: boolean;
    video_intro: boolean;
  };
  style_settings: {
    border_radius: string;
    shadow_style: string;
    button_style: string;
    card_style: string;
    divider_style: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ThemeAssetSlotDbRow {
  id: string;
  theme_id: string;
  slot_key: string;
  slot_label: string;
  slot_description: string | null;
  width_cm: number | null;
  height_cm: number | null;
  aspect_ratio: string | null;
  asset_url: string | null;
  asset_type: 'image' | 'audio' | 'video';
  display_order: number;
}

export function mapThemeFromDb(row: ThemeDbRow, slots: ThemeAssetSlotDbRow[] = []): Theme {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    culturalCategory: row.cultural_category as Theme['culturalCategory'],
    status: row.status as Theme['status'],
    thumbnailUrl: row.thumbnail_url,
    musicUrl: row.music_url,
    videoUrl: row.video_url,
    colors: {
      primary: row.colors.primary,
      secondary: row.colors.secondary,
      accent: row.colors.accent,
      surface: row.colors.surface,
      textPrimary: row.colors.text_primary,
      textSecondary: row.colors.text_secondary,
    },
    typography: {
      headingFont: row.typography.font_heading,
      bodyFont: row.typography.font_body,
    },
    animationSettings: {
      heroAnimation: row.animation_settings.hero_animation as Theme['animationSettings']['heroAnimation'],
      intensity: row.animation_settings.intensity as Theme['animationSettings']['intensity'],
      parallax: row.animation_settings.parallax,
      scrollReveal: row.animation_settings.scroll_reveal,
      musicAutoplay: row.animation_settings.music_autoplay_after_open,
      videoIntro: row.animation_settings.video_intro,
    },
    styleSettings: {
      borderRadius: row.style_settings.border_radius as Theme['styleSettings']['borderRadius'],
      shadow: row.style_settings.shadow_style as Theme['styleSettings']['shadow'],
    },
    assetSlots: slots.map(mapThemeAssetSlotFromDb),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapThemeToDb(theme: Partial<Theme>): Partial<ThemeDbRow> {
  const dbRow: Partial<ThemeDbRow> = { ...theme } as any;

  if (theme.culturalCategory !== undefined) dbRow.cultural_category = theme.culturalCategory;
  if (theme.thumbnailUrl !== undefined) dbRow.thumbnail_url = theme.thumbnailUrl;
  if (theme.musicUrl !== undefined) dbRow.music_url = theme.musicUrl;
  if (theme.videoUrl !== undefined) dbRow.video_url = theme.videoUrl;

  if (theme.colors) {
    dbRow.colors = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      surface: theme.colors.surface,
      surface_card: theme.colors.surface, // fallback
      text_primary: theme.colors.textPrimary,
      text_secondary: theme.colors.textSecondary,
      overlay_color: '#000000', // fallback
      overlay_opacity: 0.5, // fallback
    };
  }

  if (theme.typography) {
    dbRow.typography = {
      font_heading: theme.typography.headingFont,
      font_subheading: theme.typography.headingFont, // fallback
      font_body: theme.typography.bodyFont,
      font_accent: theme.typography.headingFont, // fallback
    };
  }

  if (theme.animationSettings) {
    dbRow.animation_settings = {
      hero_animation: theme.animationSettings.heroAnimation,
      intensity: theme.animationSettings.intensity,
      parallax: theme.animationSettings.parallax,
      scroll_reveal: theme.animationSettings.scrollReveal,
      music_autoplay_after_open: theme.animationSettings.musicAutoplay,
      video_intro: theme.animationSettings.videoIntro,
    };
  }

  if (theme.styleSettings) {
    dbRow.style_settings = {
      border_radius: theme.styleSettings.borderRadius,
      shadow_style: theme.styleSettings.shadow,
      button_style: 'rounded', // fallback
      card_style: 'bordered', // fallback
      divider_style: 'simple', // fallback
    };
  }

  // Remove camelCase keys to avoid dirtying DB object
  delete (dbRow as any).culturalCategory;
  delete (dbRow as any).thumbnailUrl;
  delete (dbRow as any).musicUrl;
  delete (dbRow as any).videoUrl;
  delete (dbRow as any).animationSettings;
  delete (dbRow as any).styleSettings;
  delete (dbRow as any).assetSlots;
  delete (dbRow as any).createdAt;
  delete (dbRow as any).updatedAt;

  return dbRow;
}

export function mapThemeAssetSlotFromDb(row: ThemeAssetSlotDbRow): ThemeAssetSlot {
  return {
    id: row.id,
    themeId: row.theme_id,
    slotKey: row.slot_key,
    slotLabel: row.slot_label,
    slotDescription: row.slot_description || '',
    widthCm: row.width_cm || 0,
    heightCm: row.height_cm || 0,
    aspectRatio: row.aspect_ratio || '1:1',
    assetUrl: row.asset_url || null,
    assetType: (row.asset_type === 'image' ? 'image' : 'png_transparent') as ThemeAssetSlot['assetType'], // Adjust mapping as needed 
    displayOrder: row.display_order,
  };
}
