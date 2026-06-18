/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/supabaseImageLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co'
      }
    ]
  }
};

export default nextConfig;
