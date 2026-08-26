/**
 * Gaia Design System Tokens
 * Generated from DESIGN.md — single source of truth for all design values.
 * DO NOT edit values directly — update DESIGN.md and regenerate.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Backgrounds (luminance stacking: deeper = darker)
  bg: {
    primary: '#08090a',    // Page canvas — the void
    panel: '#0f1012',      // Navigation, sidebars, fixed chrome
    elevated: '#16181b',   // Modals, dropdowns, tooltips
    card: '#1a1d21',       // Content cards, chart containers
    hover: '#22262b',      // Interactive hover states
  },

  // Borders (semi-transparent white — never solid dark)
  border: {
    subtle: 'rgba(255,255,255,0.04)',
    standard: 'rgba(255,255,255,0.08)',
    strong: 'rgba(255,255,255,0.12)',
  },

  // Text scale (never pure white — #fafafa prevents eye strain)
  text: {
    primary: '#fafafa',
    secondary: '#c8cbd1',
    muted: '#8a8f98',
    subtle: '#5a5f68',
  },

  // Accent gold — the ONLY chromatic color
  accent: {
    gold: '#fbbf24',
    goldHover: '#fcd34d',
    goldActive: '#e6a700',
    goldMuted: 'rgba(251,191,36,0.15)',
    goldBorder: 'rgba(251,191,36,0.3)',
    goldGlow: 'rgba(251,191,36,0.15)',
    goldGlowStrong: 'rgba(251,191,36,0.25)',
  },

  // Semantic colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    dangerMuted: 'rgba(239,68,68,0.15)',
  },

  // Domain accents (all use gold as base)
  domain: {
    tarotMajor: '#fbbf24',
    tarotMinor: '#a3a9b3',
    humanDesign: '#fbbf24',
    astrology: '#fbbf24',
  },

  // Overlay
  overlay: {
    modal: 'rgba(0,0,0,0.75)',
    backdrop: 'rgba(15,16,18,0.95)',
  },
} as const;

// Type helpers
export type Colors = typeof colors;
export type ColorKey = keyof Colors;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    display: 'Playfair Display',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },

  fontFeatureSettings: {
    playfair: '"cv01", "ss03"', // Single-story a, geometric alternates
  },

  // Display scales (Playfair Display, negative letter-spacing)
  display: {
    xl: {
      fontFamily: 'Playfair Display',
      fontSize: '4.5rem',      // 72px
      fontWeight: 600,
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
    },
    lg: {
      fontFamily: 'Playfair Display',
      fontSize: '3.5rem',      // 56px
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    md: {
      fontFamily: 'Playfair Display',
      fontSize: '2.75rem',     // 44px
      fontWeight: 500,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
  },

  // Heading scales (Playfair Display)
  heading: {
    1: {
      fontFamily: 'Playfair Display',
      fontSize: '2.25rem',     // 36px
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
    },
    2: {
      fontFamily: 'Playfair Display',
      fontSize: '1.75rem',     // 28px
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    3: {
      fontFamily: 'Playfair Display',
      fontSize: '1.375rem',    // 22px
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
    },
  },

  // Body scales (Inter)
  body: {
    lg: {
      fontFamily: 'Inter',
      fontSize: '1.125rem',    // 18px
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: '0',
    },
    md: {
      fontFamily: 'Inter',
      fontSize: '1rem',        // 16px
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: '0',
    },
    sm: {
      fontFamily: 'Inter',
      fontSize: '0.875rem',    // 14px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
  },

  // Label / Caption (Inter, uppercase tracking)
  label: {
    fontFamily: 'Inter',
    fontSize: '0.8125rem',     // 13px
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },

  caption: {
    fontFamily: 'Inter',
    fontSize: '0.75rem',       // 12px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },

  // Monospace (JetBrains Mono)
  mono: {
    fontFamily: 'JetBrains Mono',
    fontSize: '0.875rem',      // 14px
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0',
  },

  // Fluid scaling (clamp values for responsive)
  fluid: {
    displayXl: 'clamp(2.5rem, 5vw, 4.5rem)',
    displayLg: 'clamp(2rem, 4vw, 3.5rem)',
    displayMd: 'clamp(1.75rem, 3.5vw, 2.75rem)',
    heading1: 'clamp(1.75rem, 3vw, 2.25rem)',
    heading2: 'clamp(1.5rem, 2.5vw, 1.75rem)',
    heading3: 'clamp(1.25rem, 2vw, 1.375rem)',
    bodyLg: 'clamp(1rem, 1.5vw, 1.125rem)',
    bodyMd: 'clamp(0.9375rem, 1.5vw, 1rem)',
    bodySm: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
    sectionPadding: 'clamp(48px, 8vw, 80px)',
  },
} as const;

export type Typography = typeof typography;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const rounded = {
  sm: '4px',       // Inputs, badges
  md: '8px',       // Buttons, cards
  lg: '12px',      // Featured cards
  xl: '16px',      // Panels
  xxl: '24px',     // Modals
  pill: '9999px',  // Tags, badges, pills
  circle: '50%',   // Avatars, icon buttons, spinners
} as const;

export type Rounded = typeof rounded;
export type RoundedKey = keyof Rounded;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  xs: '4px',      // 4
  sm: '8px',      // 8
  md: '16px',     // 16
  lg: '24px',     // 24
  xl: '32px',     // 32
  xxl: '48px',    // 48
  xxxl: '64px',   // 64
  section: '80px', // Section vertical rhythm
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Elevation levels (luminance stacking + semi-transparent borders)
  card: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)',
  cardHover: '0 8px 32px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
  elevated: '0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
  modal: '0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',

  // Gold glow (reserved for primary CTAs, major arcana, active HD centers)
  goldGlow: '0 0 32px rgba(251,191,36,0.15), 0 0 64px rgba(251,191,36,0.08)',
  goldGlowStrong: '0 0 48px rgba(251,191,36,0.25), 0 0 96px rgba(251,191,36,0.12)',

  // Focus ring (3px gold glow on ALL interactive elements)
  focus: '0 0 0 3px rgba(251,191,36,0.4)',
  focusError: '0 0 0 3px rgba(239,68,68,0.4)',
} as const;

export type Shadows = typeof shadows;
export type ShadowKey = keyof Shadows;

// ============================================================================
// MOTION
// ============================================================================

export const motion = {
  duration: {
    micro: '150ms',
    standard: '200ms',
    cardHover: '300ms',
    modalEnter: '400ms',
    tarotFlip: '600ms',
    chartDraw: '1.2s',
    aiTyping: '1.2s',
  },

  easing: {
    easeOutExpo: 'cubic-bezier(0.22, 1, 0.36, 1)',
    easeInExpo: 'cubic-bezier(0.55, 0, 0.1, 1)',
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },

  stagger: '50ms',

  // Gold triangle subtle pulse (hero only)
  goldTrianglePulse: '2s ease-in-out infinite',

  // Reduced motion
  reducedMotion: '0.01ms',
} as const;

export type Motion = typeof motion;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  mobile: '640px',
  tablet: '1024px',
  desktop: '1440px',
  wide: '1440px',
} as const;

export type Breakpoints = typeof breakpoints;

// ============================================================================
// CONTAINER WIDTHS
// ============================================================================

export const containers = {
  reading: '1280px',
  charts: '1440px',
  modals: '960px',
  forms: '960px',
} as const;

export type Containers = typeof containers;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
} as const;

export type ZIndex = typeof zIndex;

// ============================================================================
// TOUCH TARGETS
// ============================================================================

export const touchTarget = {
  minHeight: '44px',
  minWidth: '44px',
  mobileMinHeight: '48px',
  mobileMinWidth: '48px',
} as const;

export type TouchTarget = typeof touchTarget;

// ============================================================================
// COMPONENT TOKENS (composed from primitives)
// ============================================================================

// Base input styles (shared by input and select)
const inputBase = {
  backgroundColor: colors.bg.panel,
  color: colors.text.primary,
  placeholderColor: colors.text.subtle,
  border: `1px solid ${colors.border.subtle}`,
  borderRadius: rounded.md,
  padding: '14px 16px',
  fontSize: '1rem',
  fontFamily: typography.fontFamily.body,
  transition: `all ${motion.duration.standard} ${motion.easing.standard}`,
  minHeight: touchTarget.minHeight,
} as const;

export const components = {
  // Buttons
  button: {
    primary: {
      backgroundColor: colors.accent.gold,
      color: colors.bg.primary,
      borderRadius: rounded.md,
      padding: '14px 28px',
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.01em',
      border: 'none',
      transition: `all ${motion.duration.standard} ${motion.easing.standard}`,
      minHeight: touchTarget.minHeight,
    },
    primaryHover: {
      backgroundColor: colors.accent.goldHover,
      boxShadow: shadows.goldGlow,
      transform: 'translateY(-1px)',
    },
    primaryActive: {
      backgroundColor: colors.accent.goldActive,
      transform: 'translateY(0)',
      boxShadow: 'none',
    },
    primaryDisabled: {
      backgroundColor: 'rgba(251,191,36,0.3)',
      color: 'rgba(8,9,10,0.5)',
      cursor: 'not-allowed',
    },

    secondary: {
      backgroundColor: 'transparent',
      color: colors.text.primary,
      borderRadius: rounded.md,
      padding: '14px 28px',
      fontWeight: 500,
      fontSize: '1rem',
      border: `1px solid ${colors.border.standard}`,
      transition: `all ${motion.duration.standard} ${motion.easing.standard}`,
      minHeight: touchTarget.minHeight,
    },
    secondaryHover: {
      backgroundColor: colors.bg.hover,
      borderColor: colors.accent.gold,
      color: colors.accent.gold,
    },
    secondaryDisabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },

    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      borderRadius: rounded.md,
      padding: '12px 24px',
      fontWeight: 400,
      fontSize: '0.9375rem',
      border: 'none',
      transition: `all ${motion.duration.standard} ${motion.easing.standard}`,
      minHeight: touchTarget.minHeight,
    },
    ghostHover: {
      color: colors.text.primary,
      backgroundColor: colors.bg.hover,
    },
    ghostDisabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },

  // Cards
  card: {
    default: {
      backgroundColor: colors.bg.card,
      border: `1px solid ${colors.border.subtle}`,
      borderRadius: rounded.lg,
      padding: spacing.xl,
      boxShadow: shadows.card,
      transition: `all ${motion.duration.cardHover} ${motion.easing.standard}`,
    },
    hover: {
      borderColor: colors.border.standard,
      boxShadow: shadows.cardHover,
    },
    elevated: {
      backgroundColor: colors.bg.elevated,
      border: `1px solid ${colors.border.standard}`,
      borderRadius: rounded.xl,
      padding: spacing.xxl,
      boxShadow: shadows.elevated,
    },
  },

  // Inputs
  input: {
    default: inputBase,
    focus: {
      borderColor: colors.accent.gold,
      boxShadow: `0 0 0 3px ${colors.accent.goldMuted}`,
      outline: 'none',
    },
    error: {
      borderColor: colors.semantic.danger,
      boxShadow: `0 0 0 3px ${colors.semantic.dangerMuted}`,
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    label: {
      ...typography.label,
      color: colors.text.muted,
      marginBottom: spacing.xs,
      display: 'block',
    },
    helperText: {
      ...typography.caption,
      color: colors.text.subtle,
      marginTop: spacing.xs,
    },
    errorText: {
      ...typography.caption,
      color: colors.semantic.danger,
      marginTop: spacing.xs,
    },
  },

  // Select
  select: {
    default: {
      ...inputBase,
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8f98' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      paddingRight: '44px',
    },
  },

  // Tabs
  tabs: {
    container: {
      backgroundColor: colors.bg.panel,
      border: `1px solid ${colors.border.subtle}`,
      borderRadius: rounded.lg,
      padding: spacing.xs,
      display: 'flex',
      gap: spacing.xs,
    },
    item: {
      color: colors.text.muted,
      fontSize: '0.875rem',
      fontWeight: 500,
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: rounded.md,
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      transition: `all ${motion.duration.standard} ${motion.easing.standard}`,
      minHeight: touchTarget.minHeight,
    },
    itemActive: {
      color: colors.bg.primary,
      backgroundColor: colors.accent.gold,
      fontWeight: 600,
    },
    itemDisabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },

  // Badges
  badge: {
    gold: {
      backgroundColor: colors.accent.goldMuted,
      color: colors.accent.gold,
      border: `1px solid ${colors.accent.goldBorder}`,
      borderRadius: rounded.pill,
      padding: '4px 12px',
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    subtle: {
      backgroundColor: colors.bg.hover,
      color: colors.text.muted,
      borderRadius: rounded.pill,
      padding: '4px 10px',
      fontSize: '0.75rem',
      fontWeight: 500,
    },
  },

  // Dividers
  divider: {
    subtle: {
      borderTop: `1px solid ${colors.border.subtle}`,
    },
    standard: {
      borderTop: `1px solid ${colors.border.standard}`,
    },
    gold: {
      borderTop: `1px solid ${colors.accent.gold}`,
      opacity: 0.3,
      width: '60px',
    },
  },

  // Spinner
  spinner: {
    gold: {
      border: `2px solid ${colors.border.subtle}`,
      borderTopColor: colors.accent.gold,
      borderRadius: rounded.circle,
      width: '24px',
      height: '24px',
      animation: `spin 1s linear infinite`,
    },
    sizes: {
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
  },

  // Tooltip
  tooltip: {
    default: {
      backgroundColor: colors.bg.elevated,
      color: colors.text.primary,
      border: `1px solid ${colors.border.standard}`,
      borderRadius: rounded.md,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '0.8125rem',
      boxShadow: shadows.elevated,
      maxWidth: '280px',
      zIndex: zIndex.tooltip,
    },
  },

  // Modal
  modal: {
    overlay: {
      backgroundColor: colors.overlay.modal,
      backdropFilter: 'blur(8px)',
      zIndex: zIndex.modalBackdrop,
    },
    container: {
      backgroundColor: colors.bg.elevated,
      border: `1px solid ${colors.border.standard}`,
      borderRadius: rounded.xxl,
      padding: spacing.xxl,
      boxShadow: shadows.modal,
      maxWidth: '560px',
      width: '90vw',
      zIndex: zIndex.modal,
    },
    closeButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      width: '36px',
      height: '36px',
      borderRadius: rounded.circle,
      backgroundColor: 'transparent',
      border: `1px solid ${colors.border.subtle}`,
      color: colors.text.muted,
      cursor: 'pointer',
      transition: `all ${motion.duration.micro} ${motion.easing.standard}`,
    },
    closeButtonHover: {
      backgroundColor: colors.bg.hover,
      color: colors.text.primary,
      borderColor: colors.border.standard,
    },
  },

  // Disclaimer Banner
  disclaimerBanner: {
    default: {
      backgroundColor: 'rgba(251,191,36,0.08)',
      border: `1px solid ${colors.accent.goldBorder}`,
      borderLeft: `3px solid ${colors.accent.gold}`,
      borderRadius: rounded.md,
      padding: `${spacing.md} ${spacing.lg}`,
      color: colors.text.secondary,
      fontSize: '0.8125rem',
    },
  },

  // Gold Triangle (single instance per major section)
  goldTriangle: {
    default: {
      width: '0',
      height: '0',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: `14px solid ${colors.accent.gold}`,
    },
    sizes: {
      sm: { borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '10px solid' },
      md: { borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '14px solid' },
      lg: { borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '20px solid' },
    },
    orientations: {
      up: { borderBottom: 'none', borderTop: '14px solid', borderLeft: '8px solid transparent', borderRight: '8px solid transparent' },
      down: { borderBottom: '14px solid', borderTop: 'none', borderLeft: '8px solid transparent', borderRight: '8px solid transparent' },
      left: { borderRight: '14px solid', borderLeft: 'none', borderTop: '8px solid transparent', borderBottom: '8px solid transparent' },
      right: { borderLeft: '14px solid', borderRight: 'none', borderTop: '8px solid transparent', borderBottom: '8px solid transparent' },
    },
  },

  // Chart containers
  chart: {
    wheel: {
      backgroundColor: colors.bg.card,
      border: `1px solid ${colors.border.subtle}`,
      borderRadius: rounded.xl,
      padding: spacing.xl,
      boxShadow: shadows.card,
    },
    vedic: {
      backgroundColor: colors.bg.card,
      border: `1px solid ${colors.border.subtle}`,
      borderRadius: rounded.xl,
      padding: spacing.xl,
      boxShadow: shadows.card,
    },
  },

  // Tarot cards
  tarot: {
    card: {
      backgroundColor: colors.bg.elevated,
      border: `1px solid ${colors.border.standard}`,
      borderRadius: rounded.lg,
      padding: spacing.lg,
      boxShadow: shadows.elevated,
      aspectRatio: '5/7',
    },
    major: {
      borderColor: colors.accent.gold,
      boxShadow: shadows.goldGlow,
    },
    reversed: {
      transform: 'rotate(180deg)',
    },
  },

  // Human Design
  humanDesign: {
    center: {
      defined: {
        backgroundColor: colors.accent.goldMuted,
        border: `2px solid ${colors.accent.gold}`,
      },
      undefined: {
        backgroundColor: 'transparent',
        border: `1px dashed ${colors.border.standard}`,
      },
    },
    channel: {
      backgroundColor: colors.accent.gold,
      height: '3px',
    },
    gate: {
      backgroundColor: colors.bg.card,
      border: `1px solid ${colors.border.standard}`,
      borderRadius: rounded.sm,
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: colors.accent.gold,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
  },

  // AI Guide
  aiGuide: {
    message: {
      user: {
        backgroundColor: colors.accent.goldMuted,
        border: `1px solid ${colors.accent.goldBorder}`,
        color: colors.text.primary,
      },
      assistant: {
        backgroundColor: colors.bg.card,
        border: `1px solid ${colors.border.subtle}`,
        color: colors.text.secondary,
      },
    },
    typingIndicator: {
      color: colors.accent.gold,
      opacity: 0.6,
    },
  },

  // Navigation
  nav: {
    bar: {
      backgroundColor: colors.overlay.backdrop,
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${colors.border.subtle}`,
      padding: `${spacing.md} ${spacing.xl}`,
    },
    link: {
      color: colors.text.secondary,
      fontSize: '0.9375rem',
      fontWeight: 400,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: rounded.sm,
      transition: `all ${motion.duration.micro} ${motion.easing.standard}`,
    },
    linkHover: {
      color: colors.text.primary,
      backgroundColor: colors.bg.hover,
    },
    linkActive: {
      color: colors.accent.gold,
      backgroundColor: colors.accent.goldMuted,
    },
  },
} as const;

export type Components = typeof components;

// ============================================================================
// COMPLETE DESIGN SYSTEM EXPORT
// ============================================================================

export const designSystem = {
  colors,
  typography,
  rounded,
  spacing,
  shadows,
  motion,
  breakpoints,
  containers,
  zIndex,
  touchTarget,
  components,
} as const;

export type DesignSystem = typeof designSystem;

// ============================================================================
// CSS VARIABLE NAMES (for Tailwind config)
// ============================================================================

export const cssVariables = {
  // Colors
  'color-bg-primary': colors.bg.primary,
  'color-bg-panel': colors.bg.panel,
  'color-bg-elevated': colors.bg.elevated,
  'color-bg-card': colors.bg.card,
  'color-bg-hover': colors.bg.hover,
  'color-border-subtle': colors.border.subtle,
  'color-border-standard': colors.border.standard,
  'color-border-strong': colors.border.strong,
  'color-text-primary': colors.text.primary,
  'color-text-secondary': colors.text.secondary,
  'color-text-muted': colors.text.muted,
  'color-text-subtle': colors.text.subtle,
  'color-accent-gold': colors.accent.gold,
  'color-accent-gold-hover': colors.accent.goldHover,
  'color-accent-gold-active': colors.accent.goldActive,
  'color-accent-gold-muted': colors.accent.goldMuted,
  'color-accent-gold-border': colors.accent.goldBorder,
  'color-semantic-success': colors.semantic.success,
  'color-semantic-warning': colors.semantic.warning,
  'color-semantic-danger': colors.semantic.danger,
  'color-semantic-danger-muted': colors.semantic.dangerMuted,

  // Rounded
  'rounded-sm': rounded.sm,
  'rounded-md': rounded.md,
  'rounded-lg': rounded.lg,
  'rounded-xl': rounded.xl,
  'rounded-xxl': rounded.xxl,
  'rounded-pill': rounded.pill,
  'rounded-circle': rounded.circle,

  // Spacing
  'spacing-xs': spacing.xs,
  'spacing-sm': spacing.sm,
  'spacing-md': spacing.md,
  'spacing-lg': spacing.lg,
  'spacing-xl': spacing.xl,
  'spacing-xxl': spacing.xxl,
  'spacing-xxxl': spacing.xxxl,
  'spacing-section': spacing.section,

  // Shadows
  'shadow-card': shadows.card,
  'shadow-card-hover': shadows.cardHover,
  'shadow-elevated': shadows.elevated,
  'shadow-modal': shadows.modal,
  'shadow-gold-glow': shadows.goldGlow,
  'shadow-gold-glow-strong': shadows.goldGlowStrong,
  'shadow-focus': shadows.focus,
  'shadow-focus-error': shadows.focusError,

  // Motion
  'duration-micro': motion.duration.micro,
  'duration-standard': motion.duration.standard,
  'duration-card-hover': motion.duration.cardHover,
  'duration-modal-enter': motion.duration.modalEnter,
  'ease-out-expo': motion.easing.easeOutExpo,
  'ease-in-expo': motion.easing.easeInExpo,
  'ease-out': motion.easing.easeOut,

  // Z-index
  'z-dropdown': zIndex.dropdown.toString(),
  'z-sticky': zIndex.sticky.toString(),
  'z-fixed': zIndex.fixed.toString(),
  'z-modal-backdrop': zIndex.modalBackdrop.toString(),
  'z-modal': zIndex.modal.toString(),
  'z-popover': zIndex.popover.toString(),
  'z-tooltip': zIndex.tooltip.toString(),
  'z-toast': zIndex.toast.toString(),

  // Touch targets
  'touch-target-min': touchTarget.minHeight,
  'touch-target-mobile': touchTarget.mobileMinHeight,
} as const;

export type CSSVariables = typeof cssVariables;

// ============================================================================
// UTILITY: Convert tokens to CSS custom properties string
// ============================================================================

export function tokensToCSSVariables(tokens: Record<string, string | number>): string {
  return Object.entries(tokens)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n  ');
}

// Generate CSS for :root
export const rootCSSVariables = tokensToCSSVariables(cssVariables);