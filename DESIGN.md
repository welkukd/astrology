---
version: alpha
name: Gaia
description: Private spiritual toolkit — dark glassmorphism, gold accent, editorial serif headings. Zero community, zero noise, maximum depth.
colors:
  bg-primary: "#08090a"
  bg-panel: "#0f1012"
  bg-elevated: "#16181b"
  bg-card: "#1a1d21"
  bg-hover: "#22262b"
  border-subtle: "rgba(255,255,255,0.04)"
  border-standard: "rgba(255,255,255,0.08)"
  border-strong: "rgba(255,255,255,0.12)"
  text-primary: "#fafafa"
  text-secondary: "#c8cbd1"
  text-muted: "#8a8f98"
  text-subtle: "#5a5f68"
  accent-gold: "#fbbf24"
  accent-gold-hover: "#fcd34d"
  accent-gold-muted: "rgba(251,191,36,0.15)"
  accent-gold-border: "rgba(251,191,36,0.3)"
  success: "#22c55e"
  warning: "#f59e0b"
  danger: "#ef4444"
  tarot-major: "#fbbf24"
  tarot-minor: "#a3a9b3"
  human-design: "#fbbf24"
  astrology: "#fbbf24"
typography:
  display-xl:
    fontFamily: "Playfair Display"
    fontSize: "4.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  display-lg:
    fontFamily: "Playfair Display"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  display:
    fontFamily: "Playfair Display"
    fontSize: "2.75rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading-1:
    fontFamily: "Playfair Display"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  heading-2:
    fontFamily: "Playfair Display"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  heading-3:
    fontFamily: "Playfair Display"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body-lg:
    fontFamily: "Inter"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
  body:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  body-sm:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "Inter"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
    textTransform: "uppercase"
  caption:
    fontFamily: "Inter"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
  mono:
    fontFamily: "JetBrains Mono"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
  pill: "9999px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  xxxl: "64px"
  section: "80px"
shadows:
  card: "0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)"
  card-hover: "0 8px 32px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
  elevated: "0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)"
  modal: "0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
  gold-glow: "0 0 32px rgba(251,191,36,0.15), 0 0 64px rgba(251,191,36,0.08)"
  gold-glow-strong: "0 0 48px rgba(251,191,36,0.25), 0 0 96px rgba(251,191,36,0.12)"
components:
  # Buttons
  btn-primary:
    backgroundColor: "{colors.accent-gold}"
    textColor: "{colors.bg-primary}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
    fontWeight: 600
    fontSize: "1rem"
    letterSpacing: "0.01em"
    border: "none"
    transition: "all 200ms ease"
  btn-primary-hover:
    backgroundColor: "{colors.accent-gold-hover}"
    boxShadow: "{shadows.gold-glow}"
    transform: "translateY(-1px)"
  btn-primary-active:
    backgroundColor: "#e6a700"
    transform: "translateY(0)"
    boxShadow: "none"
  btn-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
    fontWeight: 500
    fontSize: "1rem"
    border: "1px solid {colors.border-standard}"
    transition: "all 200ms ease"
  btn-secondary-hover:
    backgroundColor: "{colors.bg-hover}"
    borderColor: "{colors.accent-gold}"
    textColor: "{colors.accent-gold}"
  btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    fontWeight: 400
    fontSize: "0.9375rem"
    border: "none"
    transition: "all 200ms ease"
  btn-ghost-hover:
    textColor: "{colors.text-primary}"
    backgroundColor: "{colors.bg-hover}"
  
  # Cards
  card-default:
    backgroundColor: "{colors.bg-card}"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    boxShadow: "{shadows.card}"
    transition: "all 300ms ease"
  card-hover:
    borderColor: "{colors.border-standard}"
    boxShadow: "{shadows.card-hover}"
  card-elevated:
    backgroundColor: "{colors.bg-elevated}"
    border: "1px solid {colors.border-standard}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    boxShadow: "{shadows.elevated}"
  
  # Inputs
  input-default:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-subtle}"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
    fontSize: "1rem"
    fontFamily: "{typography.body.fontFamily}"
    transition: "all 200ms ease"
  input-focus:
    borderColor: "{colors.accent-gold}"
    boxShadow: "0 0 0 3px {colors.accent-gold-muted}"
    outline: "none"
  input-error:
    borderColor: "{colors.danger}"
    boxShadow: "0 0 0 3px rgba(239,68,68,0.15)"
  
  # Select
  select-default:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-primary}"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
    fontSize: "1rem"
    appearance: "none"
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8f98' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"
    backgroundRepeat: "no-repeat"
    backgroundPosition: "right 12px center"
    paddingRight: "44px"
  
  # Navigation
  nav-bar:
    backgroundColor: "rgba(15,16,18,0.95)"
    backdropFilter: "blur(20px)"
    borderBottom: "1px solid {colors.border-subtle}"
    padding: "{spacing.md} {spacing.xl}"
  nav-link:
    textColor: "{colors.text-secondary}"
    fontSize: "0.9375rem"
    fontWeight: 400
    padding: "{spacing.sm} {spacing.md}"
    rounded: "{rounded.sm}"
    transition: "all 150ms ease"
  nav-link-hover:
    textColor: "{colors.text-primary}"
    backgroundColor: "{colors.bg-hover}"
  nav-link-active:
    textColor: "{colors.accent-gold}"
    backgroundColor: "{colors.accent-gold-muted}"
  
  # Tabs
  tabs-container:
    backgroundColor: "{colors.bg-panel}"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs}"
    display: "flex"
    gap: "{spacing.xs}"
  tab-item:
    textColor: "{colors.text-muted}"
    fontSize: "0.875rem"
    fontWeight: 500
    padding: "{spacing.sm} {spacing.lg}"
    rounded: "{rounded.md}"
    border: "none"
    backgroundColor: "transparent"
    cursor: "pointer"
    transition: "all 200ms ease"
  tab-item-active:
    textColor: "{colors.bg-primary}"
    backgroundColor: "{colors.accent-gold}"
    fontWeight: 600
  
  # Badges
  badge-gold:
    backgroundColor: "{colors.accent-gold-muted}"
    textColor: "{colors.accent-gold}"
    border: "1px solid {colors.accent-gold-border}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.02em"
    textTransform: "uppercase"
  badge-subtle:
    backgroundColor: "{colors.bg-hover}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    fontSize: "0.75rem"
    fontWeight: 500
  
  # Dividers
  divider-subtle:
    borderTop: "1px solid {colors.border-subtle}"
  divider-standard:
    borderTop: "1px solid {colors.border-standard}"
  divider-gold:
    borderTop: "1px solid {colors.accent-gold}"
    opacity: 0.3
    width: "60px"
  
  # Progress / Loading
  spinner-gold:
    border: "2px solid {colors.border-subtle}"
    borderTopColor: "{colors.accent-gold}"
    rounded: "{rounded.circle}"
    width: "24px"
    height: "24px"
    animation: "spin 1s linear infinite"
  
  # Tooltip
  tooltip-default:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.text-primary}"
    border: "1px solid {colors.border-standard}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    fontSize: "0.8125rem"
    boxShadow: "{shadows.elevated}"
    maxWidth: "280px"
  
  # Modal
  modal-overlay:
    backgroundColor: "rgba(0,0,0,0.75)"
    backdropFilter: "blur(8px)"
  modal-container:
    backgroundColor: "{colors.bg-elevated}"
    border: "1px solid {colors.border-standard}"
    rounded: "{rounded.xxl}"
    padding: "{spacing.xxl}"
    boxShadow: "{shadows.modal}"
    maxWidth: "560px"
    width: "90vw"
  
  # Chart containers
  chart-wheel:
    backgroundColor: "{colors.bg-card}"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    boxShadow: "{shadows.card}"
  chart-vedic:
    backgroundColor: "{colors.bg-card}"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    boxShadow: "{shadows.card}"
  
  # Tarot card
  tarot-card:
    backgroundColor: "{colors.bg-elevated}"
    border: "1px solid {colors.border-standard}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    boxShadow: "{shadows.elevated}"
    aspectRatio: "5/7"
  tarot-card-major:
    borderColor: "{colors.accent-gold}"
    boxShadow: "{shadows.gold-glow}"
  tarot-card-reversed:
    transform: "rotate(180deg)"
  
  # Human Design centers
  hd-center-defined:
    backgroundColor: "{colors.accent-gold-muted}"
    border: "2px solid {colors.accent-gold}"
  hd-center-undefined:
    backgroundColor: "transparent"
    border: "1px dashed {colors.border-standard}"
  hd-channel:
    backgroundColor: "{colors.accent-gold}"
    height: "3px"
  hd-gate:
    backgroundColor: "{colors.bg-card}"
    border: "1px solid {colors.border-standard}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
    fontSize: "0.75rem"
    fontWeight: 600
    textColor: "{colors.accent-gold}"
  
  # AI Guide
  ai-message-user:
    backgroundColor: "{colors.accent-gold-muted}"
    border: "1px solid {colors.accent-gold-border}"
    textColor: "{colors.text-primary}"
  ai-message-assistant:
    backgroundColor: "{colors.bg-card}"
    border: "1px solid {colors.border-subtle}"
    textColor: "{colors.text-secondary}"
  ai-typing-indicator:
    color: "{colors.accent-gold}"
    opacity: 0.6
  
  # Disclaimer banner
  disclaimer-banner:
    backgroundColor: "rgba(251,191,36,0.08)"
    border: "1px solid {colors.accent-gold-border}"
    borderLeft: "3px solid {colors.accent-gold}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
    textColor: "{colors.text-secondary}"
    fontSize: "0.8125rem"
  
  # Gold triangle accent (the ONE gold triangle)
  gold-triangle:
    width: "0"
    height: "0"
    borderLeft: "8px solid transparent"
    borderRight: "8px solid transparent"
    borderBottom: "14px solid {colors.accent-gold}"
---

## Overview

Gaia is a **private spiritual toolkit** — not a social platform, not a content farm, not a marketplace. Every design decision serves one person in solitude: calculating their chart, pulling their cards, reading their design, hearing their guide. The UI gets out of the way. Depth over breadth. Signal over noise.

**Visual posture:** Dark-mode native. Near-black canvas (`#08090a`) where content emerges like candlelight. Gold (`#fbbf24`) is the single chromatic accent — used only for primary actions, active states, and the signature triangle. No other colors in the chrome. Playfair Display for headings (editorial gravitas, spiritual weight). Inter for body (clarity, readability, neutrality). One gold triangle — the mark of precision, the capstone.

**Principles:**
- **Privacy by default** — no sharing, no public profiles, no analytics tracking behavior. Data encrypted at rest. Local-first where possible.
- **Zero emojis** — ever. Spiritual depth doesn't need decoration.
- **One gold triangle** — the only decorative geometric element. Appears once per major section as a visual anchor.
- **Glassmorphism with purpose** — translucent surfaces (`rgba(255,255,255,0.02–0.05)`) create depth without shadows. Borders are whispers (`rgba(255,255,255,0.04–0.08)`).
- **Editorial hierarchy** — Playfair at display sizes with negative tracking creates authority. Inter at body sizes with generous leading creates calm.
- **Motion as clarification** — 200-300ms easing. No loops. Respects `prefers-reduced-motion`.
- **Touch targets ≥44px** — spiritual tools work on phone in bed at 3am.

## Colors

- **bg-primary (#08090a):** The void. Page background. Near-black with cool undertone.
- **bg-panel (#0f1012):** Navigation, sidebars, fixed chrome. One step up.
- **bg-elevated (#16181b):** Modals, dropdowns, tooltips. Elevated surfaces.
- **bg-card (#1a1d21):** Content cards, chart containers, reading panels. Standard surface.
- **bg-hover (#22262b):** Interactive hover states. Subtle lift.
- **Border system:** Subtle (0.04), Standard (0.08), Strong (0.12) — all semi-transparent white. No solid dark borders.
- **Text scale:** Primary (#fafafa), Secondary (#c8cbd1), Muted (#8a8f98), Subtle (#5a5f68). Never pure white — too harsh on near-black.
- **Accent gold (#fbbf24):** The only chromatic color. Primary CTAs, active tab, focus rings, gold triangle. Muted variants for backgrounds/borders.
- **Domain accents:** Tarot (gold + muted silver), Human Design (gold), Astrology (gold). Same gold, different contexts.

## Typography

- **Playfair Display** — Serif. Headings only. Weights 500/600. Negative letter-spacing at display sizes (-0.03em at 72px → -0.005em at 22px). OpenType: `cv01` (single-story a), `ss03` (geometric alternates). Conveys tradition, gravity, permanence.
- **Inter** — Sans. All UI, body, labels, data. Weights 400/500/600. Neutral, highly readable, invisible. Variable font preferred.
- **JetBrains Mono** — Monospace. Technical data: degrees, timestamps, JSON exports, gate numbers. Clean, legible at small sizes.
- **Scale:** 72px/56px/44px/36px/28px/22px/18px/16px/14px/12px. Fluid scaling via `clamp()`.

## Layout

- **Container max-width:** 1280px (reading), 1440px (charts), 960px (modals/forms).
- **Spacing rhythm:** 8px base. Section padding 80px vertical. Card padding 24-32px.
- **Grid:** 12-column fluid. 24px gutters desktop, 16px tablet, 12px mobile.
- **Whitespace as breath:** Dark background IS the whitespace. Content emerges from it. Generous vertical rhythm (1.65-1.7 line-height). Sections separated by 80px+ padding, no visible dividers.

## Elevation & Depth

- **Level 0 (Flat):** bg-primary, no shadow, no border. Page canvas.
- **Level 1 (Panel):** bg-panel, border-subtle, no shadow. Fixed chrome.
- **Level 2 (Card):** bg-card, border-subtle, card shadow. Standard content.
- **Level 3 (Hover):** bg-hover, border-standard, card-hover shadow. Interactive lift.
- **Level 4 (Elevated):** bg-elevated, border-standard, elevated shadow. Dropdowns, tooltips.
- **Level 5 (Modal):** bg-elevated, border-standard, modal shadow + overlay. Focus isolation.
- **Gold glow:** Reserved for primary CTAs, major arcana cards, active Human Design centers. Never decorative.

## Shapes

- **Radius scale:** 4px (inputs, badges), 8px (buttons, cards), 12px (featured cards), 16px (panels), 24px (modals), pill (tags, badges), circle (avatars, icon buttons, spinners).
- **Gold triangle:** 8px/8px/14px border triangle. Single instance per major section. Rotated variants for direction (up/down/left/right).

## Components

**Buttons:** Primary (gold fill, bg-primary text), Secondary (transparent, gold border on hover), Ghost (transparent, text only). All 14px/28px padding, 8px radius, 600/500/400 weight. 200ms transitions.

**Cards:** Default (bg-card, border-subtle, card shadow), Hover (border-standard, card-hover), Elevated (bg-elevated, border-standard, elevated shadow). Padding 24-32px. Transition 300ms.

**Inputs:** bg-panel, border-subtle, 14px/16px padding, 8px radius. Focus: gold border + gold glow ring. Error: danger border + danger glow. Label: 12px uppercase tracking-wide, text-muted.

**Select:** Same as input + custom chevron (muted silver). Native `<select>` with appearance:none.

**Navigation:** Sticky top bar, bg-panel/95 + blur(20px), border-subtle bottom. Links: text-secondary → text-primary on hover. Active: gold text + gold-muted bg. CTA: primary button.

**Tabs:** Container (bg-panel, border-subtle, 12px radius, 4px padding). Items: text-muted → gold fill + bg-primary text on active. No underline indicators — fill is the signal.

**Badges:** Gold (gold-muted bg, gold text, gold-border, pill), Subtle (bg-hover, text-muted, pill). 12px uppercase tracking-wide.

**Dividers:** Subtle (border-subtle), Standard (border-standard), Gold (60px wide, gold, 30% opacity) — section anchors.

**Charts:** Wheel (bg-card, border-subtle, 16px radius, card shadow). Vedic grid (same). SVG strokes use border-subtle/standard. Planet glyphs: text-primary. Aspect lines: gold for trine/sextile, muted for square/opposition.

**Tarot Cards:** 5:7 aspect. bg-elevated, border-standard, elevated shadow. Major Arcana: gold border + gold glow. Reversed: CSS transform rotate(180deg). Card imagery: placeholder until real assets.

**Human Design:** Bodygraph SVG. Defined centers: gold-muted fill + 2px gold border. Undefined: transparent + dashed border. Channels: 3px gold lines. Gates: bg-card, gold border, gold text, 4px radius, 12px uppercase.

**AI Guide:** Chat bubbles. User: gold-muted bg, gold border, text-primary. Assistant: bg-card, border-subtle, text-secondary. Typing: 3 gold dots pulsing. Input: full-width, primary button send.

**Disclaimer Banner:** Gold-muted bg, gold border + 3px gold left border, 8px radius. text-secondary, 13px. Persistent, dismissible.

**Gold Triangle:** Single instance per major section. 8/8/14px border triangle. Gold fill. Positioned as visual anchor (hero, section header, card corner).

## Do's and Don'ts

### Do
- Use Playfair Display for ALL headings (display-xl through heading-3) with font-feature-settings: "cv01", "ss03"
- Use Inter for ALL body, UI, labels, data — never Playfair for paragraphs
- Apply negative letter-spacing at display sizes: -0.03em (72px), -0.025em (56px), -0.02em (44px), -0.015em (36px), -0.01em (28px), -0.005em (22px)
- Build on near-black: #08090a (page), #0f1012 (chrome), #16181b (elevated), #1a1d21 (cards)
- Use semi-transparent white borders: 0.04 (subtle), 0.08 (standard), 0.12 (strong) — never solid dark borders
- Keep button backgrounds transparent or gold — no solid colored buttons except primary
- Reserve gold (#fbbf24) for: primary CTAs, active tab, focus ring, gold triangle, major arcana border, defined HD centers
- Use #fafafa for primary text — not #ffffff (too harsh)
- Apply luminance stacking: deeper = darker bg, elevated = slightly lighter bg (0.02 → 0.04 → 0.05 opacity steps)
- Respect prefers-reduced-motion — disable all non-essential animation
- Ensure 44px minimum touch targets on all interactive elements

### Don't
- Don't use pure white (#ffffff) as primary text — #fafafa prevents eye strain
- Don't use solid colored backgrounds for buttons — transparency is the system
- Don't apply gold decoratively — it's reserved for interactive/CTA/anchor elements only
- Don't use positive letter-spacing on display text — Playfair at large sizes always runs negative
- Don't use visible/opaque borders on dark backgrounds — borders are whisper-thin semi-transparent white
- Don't skip OpenType features ("cv01", "ss03") on Playfair — without them it's generic serif
- Don't use weight 700 (bold) — max weight is 600, with 500 as workhorse for headings
- Don't introduce warm colors into UI chrome — palette is cool near-black with gold accent only
- Don't use drop shadows for elevation — use background luminance stepping + semi-transparent borders
- Don't add emojis — ever. Zero. Spiritual depth doesn't need decoration.
- Don't add social features — no sharing, no profiles, no feeds, no comments, no community
- Don't use glassmorphism without the luminance stacking system — translucent without hierarchy is noise
- Don't use feature-tile grids (icon + heading + sentence × 3) — one idea per section, editorial flow
- Don't center everything — commit to a surface archetype (Decide/Learn for landing, Operate for tools, Command for inputs)

## Responsive Behavior

### Breakpoints
- Mobile: <640px (single column, 16px gutters, 48px section padding)
- Tablet: 640-1024px (2-column grids, 20px gutters, 64px section padding)
- Desktop: 1024-1440px (full grids, 24px gutters, 80px section padding)
- Wide: >1440px (centered 1280/1440 max, generous margins)

### Fluid Scaling
- Display: clamp(2.5rem, 5vw, 4.5rem)
- Heading-1: clamp(1.75rem, 3vw, 2.25rem)
- Body: clamp(0.9375rem, 1.5vw, 1.125rem)
- Section padding: clamp(48px, 8vw, 80px)
- Gold triangle: fixed 8/8/14px (does not scale)

### Touch Adaptations
- Mobile: larger tap targets (48px), increased padding, stacked layouts
- Hover states → active states on touch
- Tooltips → inline help text on mobile
- Modals → full-screen sheets on mobile <480px

## Accessibility

- Contrast: text-primary on bg-primary = 18.5:1 (AAA), text-secondary = 11.2:1 (AAA), text-muted = 4.8:1 (AA large), gold on bg-primary = 12.1:1 (AAA)
- Focus: 3px gold glow ring (0 0 0 3px rgba(251,191,36,0.4)) on ALL interactive elements
- Semantic HTML: proper heading hierarchy, landmarks, labels, ARIA where needed
- Keyboard: full tab navigation, visible focus, escape closes modals, arrow keys in tabs/menus
- Screen readers: alt text for all imagery, aria-labels for icon buttons, live regions for AI typing
- Reduced motion: disable transitions/animations when prefers-reduced-motion: reduce

## Motion

- **Duration:** 150ms (micro), 200ms (standard), 300ms (card hover), 400ms (modal enter)
- **Easing:** cubic-bezier(0.22, 1, 0.36, 1) (ease-out-expo) for enter, cubic-bezier(0.55, 0, 0.1, 1) (ease-in-expo) for exit
- **Stagger:** 50ms per item for lists/grids
- **Gold triangle:** subtle pulse (2s ease-in-out infinite) on hero only — not on every instance
- **Tarot flip:** 600ms cubic-bezier(0.4, 0, 0.2, 1) with perspective(1000px)
- **Chart draw:** SVG stroke-dasharray animation 1.2s on mount
- **AI typing:** 3 dots, 400ms stagger, 1.2s loop