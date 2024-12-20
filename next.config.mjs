const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
              protocol: 'https', 
              hostname: 'i.ytimg.com', 
              pathname: '**', 
            },
        ],
        unoptimized: true, 
    },
    assetPrefix: '',
    basePath: '',
    output: isProd ? 'export' : undefined,
};

export default nextConfig;
