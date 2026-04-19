import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#F6F0E7',
          sand: '#E8D9C7',
          ivory: '#FFF8F1',
          brown: '#7A4E2E',
          espresso: '#3A2418',
          gold: '#C89A5A',
          line: '#D8C1A8',
          sage: '#7E8A63'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(58, 36, 24, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
