import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-georgian)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-georgian)', 'system-ui', 'sans-serif']
      },
      colors: {
        /* Legacy brand tokens — values retuned for the new system so every
           existing utility class picks up the redesign automatically. */
        brand: {
          50: '#FDF7F9',
          100: '#F9EBEF',
          200: '#F2D8DF',
          300: '#E3B2C0',
          400: '#CB8497',
          500: '#B15670',
          600: '#993B56',
          700: '#7C2E45',
          800: '#5F2335',
          900: '#421926',
          cream: '#FBF8F9',
          sand: '#F1E6EA',
          ivory: '#FFFFFF',
          brown: '#8E2A46',
          espresso: '#221319',
          gold: '#2F7D7A',
          line: '#EDE0E5',
          sage: '#5E7A78'
        },
        /* New semantic ramps used by the redesigned components. */
        wine: {
          50: '#FDF7F9',
          100: '#F9EBEF',
          200: '#F2D8DF',
          300: '#E3B2C0',
          400: '#CB8497',
          500: '#B15670',
          600: '#993B56',
          700: '#8E2A46',
          800: '#6E1F36',
          900: '#4C1626',
          950: '#2E0D17'
        },
        ink: {
          DEFAULT: '#221319',
          900: '#221319',
          800: '#382630',
          700: '#523E48',
          600: '#6C5762',
          500: '#7A626C',
          400: '#8E7681',
          300: '#C6B3BA',
          200: '#E2D6DB',
          100: '#F1E9EC',
          50: '#FAF6F7'
        },
        sea: {
          50: '#EAF4F3',
          100: '#D2E7E5',
          300: '#8CBFBD',
          400: '#4A9A97',
          500: '#2F7D7A',
          600: '#256462',
          700: '#1B4A48'
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(34,19,25,0.04), 0 10px 28px -14px rgba(34,19,25,0.18)',
        card: '0 1px 2px rgba(34,19,25,0.04), 0 12px 32px -18px rgba(34,19,25,0.22)',
        lift: '0 2px 6px rgba(34,19,25,0.05), 0 26px 50px -22px rgba(142,42,70,0.38)',
        glow: '0 18px 44px -18px rgba(142,42,70,0.55)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 12px 34px -20px rgba(34,19,25,0.35)',
        sunk: 'inset 0 1px 2px rgba(34,19,25,0.05)'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      transitionDuration: {
        400: '400ms',
        450: '450ms',
        600: '600ms',
        800: '800ms'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(3%, -4%, 0) scale(1.08)' }
        },
        'drift-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '50%': { transform: 'translate3d(-4%, 3%, 0) scale(1)' }
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '80%, 100%': { transform: 'scale(2.2)', opacity: '0' }
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.8s infinite',
        drift: 'drift 18s ease-in-out infinite',
        'drift-slow': 'drift-slow 24s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'slide-down': 'slide-down 0.22s cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: []
};

export default config;
