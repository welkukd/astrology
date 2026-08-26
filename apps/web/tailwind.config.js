/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ========================================================================
      // COLORS (from DESIGN.md)
      // ========================================================================
      colors: {
        // Backgrounds (luminance stacking)
        bg: {
          primary: '#08090a',
          panel: '#0f1012',
          elevated: '#16181b',
          card: '#1a1d21',
          hover: '#22262b',
        },
        // Borders (semi-transparent white)
        border: {
          subtle: 'rgba(255,255,255,0.04)',
          standard: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.12)',
        },
        // Text scale
        text: {
          primary: '#fafafa',
          secondary: '#c8cbd1',
          muted: '#8a8f98',
          subtle: '#5a5f68',
        },
        // Accent gold (the ONLY chromatic color)
        accent: {
          gold: '#fbbf24',
          'gold-hover': '#fcd34d',
          'gold-active': '#e6a700',
          'gold-muted': 'rgba(251,191,36,0.15)',
          'gold-border': 'rgba(251,191,36,0.3)',
        },
        // Semantic
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        'danger-muted': 'rgba(239,68,68,0.15)',
        // Domain
        tarot: {
          major: '#fbbf24',
          minor: '#a3a9b3',
        },
        'human-design': '#fbbf24',
        astrology: '#fbbf24',
        // Overlay
        overlay: {
          modal: 'rgba(0,0,0,0.75)',
          backdrop: 'rgba(15,16,18,0.95)',
        },
      },

      // ========================================================================
      // FONT FAMILIES
      // ========================================================================
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // ========================================================================
      // FONT SIZES (with line heights and letter spacing)
      // ========================================================================
      fontSize: {
        // Display (Playfair Display, negative letter-spacing)
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600', fontFamily: 'Playfair Display' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600', fontFamily: 'Playfair Display' }],
        'display-md': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '500', fontFamily: 'Playfair Display' }],

        // Headings (Playfair Display)
        'heading-1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '500', fontFamily: 'Playfair Display' }],
        'heading-2': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '500', fontFamily: 'Playfair Display' }],
        'heading-3': ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '500', fontFamily: 'Playfair Display' }],

        // Body (Inter)
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400', fontFamily: 'Inter' }],
        'body': ['1rem', { lineHeight: '1.65', letterSpacing: '0', fontWeight: '400', fontFamily: 'Inter' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400', fontFamily: 'Inter' }],

        // Label / Caption (Inter, uppercase)
        'label': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500', fontFamily: 'Inter', textTransform: 'uppercase' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400', fontFamily: 'Inter' }],

        // Mono
        'mono': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400', fontFamily: 'JetBrains Mono' }],
      },

      // ========================================================================
      // BORDER RADIUS
      // ========================================================================
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        xxl: '24px',
        pill: '9999px',
        circle: '50%',
      },

      // ========================================================================
      // SPACING
      // ========================================================================
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        xxxl: '64px',
        section: '80px',
      },

      // ========================================================================
      // BOX SHADOWS
      // ========================================================================
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        elevated: '0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
        modal: '0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'gold-glow': '0 0 32px rgba(251,191,36,0.15), 0 0 64px rgba(251,191,36,0.08)',
        'gold-glow-strong': '0 0 48px rgba(251,191,36,0.25), 0 0 96px rgba(251,191,36,0.12)',
        focus: '0 0 0 3px rgba(251,191,36,0.4)',
        'focus-error': '0 0 0 3px rgba(239,68,68,0.4)',
      },

      // ========================================================================
      // TRANSITION DURATIONS
      // ========================================================================
      transitionDuration: {
        micro: '150ms',
        standard: '200ms',
        'card-hover': '300ms',
        'modal-enter': '400ms',
        'tarot-flip': '600ms',
        'chart-draw': '1200ms',
      },

      // ========================================================================
      // TRANSITION TIMING FUNCTIONS
      // ========================================================================
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ease-in-expo': 'cubic-bezier(0.55, 0, 0.1, 1)',
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ========================================================================
      // Z-INDEX
      // ========================================================================
      zIndex: {
        dropdown: '100',
        sticky: '200',
        fixed: '300',
        'modal-backdrop': '400',
        modal: '500',
        popover: '600',
        tooltip: '700',
        toast: '800',
      },

      // ========================================================================
      // ANIMATIONS
      // ========================================================================
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 32px rgba(251,191,36,0.15), 0 0 64px rgba(251,191,36,0.08)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 48px rgba(251,191,36,0.25), 0 0 96px rgba(251,191,36,0.12)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },

      animation: {
        spin: 'spin 1s linear infinite',
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 150ms ease-in',
        'slide-up': 'slide-up 300ms ease-out-expo',
        'slide-down': 'slide-down 200ms ease-out-expo',
        'scale-in': 'scale-in 200ms ease-out-expo',
        'typing-1': 'typing-dot 1.2s ease-in-out infinite',
        'typing-2': 'typing-dot 1.2s ease-in-out infinite 133ms',
        'typing-3': 'typing-dot 1.2s ease-in-out infinite 266ms',
      },

      // ========================================================================
      // BACKDROP BLUR
      // ========================================================================
      backdropBlur: {
        'modal': '8px',
        'nav': '20px',
      },

      // ========================================================================
      // CONTAINER SIZES
      // ========================================================================
      maxWidth: {
        'reading': '1280px',
        'charts': '1440px',
        'modals': '960px',
        'forms': '960px',
      },

      // ========================================================================
      // GRADIENTS (for gold triangle pulse, etc.)
      // ========================================================================
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)',
        'gold-radial': 'radial-gradient(circle at center, rgba(251,191,36,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};