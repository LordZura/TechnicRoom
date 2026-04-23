import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FCF6F7',
          100: '#F9ECEE',
          200: '#F4D9DE',
          300: '#ECAFC6',
          400: '#DE7A96',
          500: '#C84C6D',
          600: '#B43A57',
          700: '#912C46',
          800: '#73263A',
          900: '#4F1D2A',
          cream: '#FAF5F6',
          sand: '#EEDFE3',
          ivory: '#FFF9FA',
          brown: '#912C46',
          espresso: '#2C1A20',
          gold: '#4E8E8A',
          line: '#E6D3D9',
          sage: '#5E7A78'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(145, 44, 70, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
