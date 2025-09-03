import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL(
                'https://emprbekhhsujukwxwmzj.supabase.co/storage/v1/object/**'
            ),
        ],
    },
};

export default nextConfig;
