export type CafeThemePalette = {
  primary?: string;
  primaryDark?: string;
  primaryLight?: string;
  accent?: string;
  background?: string;
  surface?: string;
  surfaceSubtle?: string;
  text?: string;
  textMuted?: string;
  border?: string;
};

export type BrandTheme = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
};

export const DEFAULT_THEME: BrandTheme = {
  primary: '#9d5126',
  primaryDark: '#3d2817',
  primaryLight: '#d77b39',
  secondary: '#4B3621',
  secondaryDark: '#2F221B',
  accent: '#F27D26',
  background: '#f8f5f0',
  surface: '#fffdf9',
  surfaceSubtle: '#f5f2ed',
  text: '#34231a',
  textMuted: '#796b60',
  textInverse: '#ffffff',
  border: '#e9e1d8',
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeHex = (value?: string | null) => {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const matched = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!matched) return null;

  const raw = matched[1];
  if (raw.length === 3) {
    return `#${raw.split('').map((c) => c + c).join('')}`.toLowerCase();
  }

  return `#${raw.toLowerCase()}`;
};

const hexToRgb = (hex: string) => {
  const raw = normalizeHex(hex) ?? DEFAULT_THEME.primary;
  const numeric = raw.replace('#', '');
  const value = numeric.length === 3 ? numeric.split('').map((ch) => ch + ch).join('') : numeric;

  const parse = Number.parseInt(value, 16);
  return {
    r: (parse >> 16) & 255,
    g: (parse >> 8) & 255,
    b: parse & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`;

const mixColors = (baseHex: string, targetHex: string, amount: number) => {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  const weight = clamp(amount, 0, 1);

  const r = base.r + (target.r - base.r) * weight;
  const g = base.g + (target.g - base.g) * weight;
  const b = base.b + (target.b - base.b) * weight;

  return rgbToHex(r, g, b);
};

const getDevThemeOverride = () => {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return null;

  const direct = (window as Window & { __PERKLY_THEME_OVERRIDE__?: { primary?: string; secondary?: string } }).__PERKLY_THEME_OVERRIDE__;
  if (direct) return direct;

  try {
    const stored = window.localStorage.getItem('perkly-theme-override');
    if (!stored) return null;
    return JSON.parse(stored) as { primary?: string; secondary?: string };
  } catch {
    return null;
  }
};

export const resolveBrandColors = (primaryColor?: string | null, secondaryColor?: string | null) => {
  const override = getDevThemeOverride();

  const primary = normalizeHex(override?.primary ?? primaryColor ?? DEFAULT_THEME.primary) ?? DEFAULT_THEME.primary;
  const secondary = normalizeHex(override?.secondary ?? secondaryColor ?? DEFAULT_THEME.secondary) ?? DEFAULT_THEME.secondary;

  return { primary, secondary };
};

const themeHasExplicitValues = (theme?: Partial<CafeThemePalette> | null) =>
  !!theme && Object.values(theme).some((value) => typeof value === 'string' && value.trim().length > 0);

const buildSemanticThemeFromLegacyColors = (primaryColor?: string | null, secondaryColor?: string | null) => {
  const { primary, secondary } = resolveBrandColors(primaryColor, secondaryColor);

  return {
    primary,
    primaryDark: mixColors(primary, '#000000', 0.34),
    primaryLight: mixColors(primary, '#ffffff', 0.32),
    accent: mixColors(primary, '#f7e6d4', 0.18),
    background: DEFAULT_THEME.background,
    surface: DEFAULT_THEME.surface,
    surfaceSubtle: DEFAULT_THEME.surfaceSubtle,
    text: DEFAULT_THEME.text,
    textMuted: DEFAULT_THEME.textMuted,
    border: DEFAULT_THEME.border,
    secondary,
    secondaryDark: mixColors(secondary, '#000000', 0.22),
  };
};

export const buildBrandTheme = (
  theme?: Partial<CafeThemePalette> | 'light' | 'dark' | null,
  primaryColor?: string | null,
  secondaryColor?: string | null,
): BrandTheme => {
  const semanticTheme = typeof theme === 'object' && theme !== null ? theme : null;
  const hasSemanticTheme = themeHasExplicitValues(semanticTheme);

  const baseTheme = buildSemanticThemeFromLegacyColors(primaryColor, secondaryColor);

  if (hasSemanticTheme && semanticTheme) {
    const resolvedPrimary = normalizeHex(semanticTheme.primary ?? baseTheme.primary) ?? baseTheme.primary;
    const resolvedPrimaryDark = normalizeHex(semanticTheme.primaryDark ?? baseTheme.primaryDark) ?? baseTheme.primaryDark;
    const resolvedPrimaryLight = normalizeHex(semanticTheme.primaryLight ?? baseTheme.primaryLight) ?? baseTheme.primaryLight;
    const resolvedAccent = normalizeHex(semanticTheme.accent ?? baseTheme.accent) ?? baseTheme.accent;
    const resolvedBackground = normalizeHex(semanticTheme.background ?? baseTheme.background) ?? baseTheme.background;
    const resolvedSurface = normalizeHex(semanticTheme.surface ?? baseTheme.surface) ?? baseTheme.surface;
    const resolvedSurfaceSubtle = normalizeHex(semanticTheme.surfaceSubtle ?? baseTheme.surfaceSubtle) ?? baseTheme.surfaceSubtle;
    const resolvedText = normalizeHex(semanticTheme.text ?? baseTheme.text) ?? baseTheme.text;
    const resolvedTextMuted = normalizeHex(semanticTheme.textMuted ?? baseTheme.textMuted) ?? baseTheme.textMuted;
    const resolvedBorder = normalizeHex(semanticTheme.border ?? baseTheme.border) ?? baseTheme.border;

    return {
      primary: resolvedPrimary,
      primaryDark: resolvedPrimaryDark,
      primaryLight: resolvedPrimaryLight,
      secondary: normalizeHex(secondaryColor ?? baseTheme.secondary) ?? baseTheme.secondary,
      secondaryDark: normalizeHex(secondaryColor ?? baseTheme.secondaryDark) ?? baseTheme.secondaryDark,
      accent: resolvedAccent,
      background: resolvedBackground,
      surface: resolvedSurface,
      surfaceSubtle: resolvedSurfaceSubtle,
      text: resolvedText,
      textMuted: resolvedTextMuted,
      textInverse: DEFAULT_THEME.textInverse,
      border: resolvedBorder,
    };
  }

  return {
    primary: baseTheme.primary,
    primaryDark: baseTheme.primaryDark,
    primaryLight: baseTheme.primaryLight,
    secondary: baseTheme.secondary,
    secondaryDark: baseTheme.secondaryDark,
    accent: baseTheme.accent,
    background: baseTheme.background,
    surface: baseTheme.surface,
    surfaceSubtle: baseTheme.surfaceSubtle,
    text: baseTheme.text,
    textMuted: baseTheme.textMuted,
    textInverse: DEFAULT_THEME.textInverse,
    border: baseTheme.border,
  };
};

export const applyBrandTheme = (theme: BrandTheme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-dark', theme.primaryDark);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-secondary-dark', theme.secondaryDark);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-background', theme.background);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-surface-subtle', theme.surfaceSubtle);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-text-muted', theme.textMuted);
  root.style.setProperty('--color-text-inverse', theme.textInverse);
  root.style.setProperty('--color-border', theme.border);

  root.style.setProperty('--color-caramel', theme.primaryLight);
  root.style.setProperty('--color-coffee-700', theme.secondary);
  root.style.setProperty('--color-coffee-800', theme.secondaryDark);
  root.style.setProperty('--color-coffee-900', theme.secondaryDark);
  root.style.setProperty('--color-ink', theme.text);
  root.style.setProperty('--color-muted', theme.textMuted);
  root.style.setProperty('--color-canvas', theme.background);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-line', theme.border);
};
