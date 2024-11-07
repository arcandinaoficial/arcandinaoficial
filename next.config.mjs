const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['i.ytimg.com'], 
        unoptimized: true, 
    },
    assetPrefix: isProd ? '/arcandinaoficial/' : '',
    basePath: isProd ? '/arcandinaoficial' : '',
    output: 'export'
};

export default nextConfig;
