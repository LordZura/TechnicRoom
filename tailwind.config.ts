import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          500: '#1f7ae0',
          700: '#155bb0',
          900: '#12375f'
        }
      }
    }
  },
  plugins: []
};

export default config;
