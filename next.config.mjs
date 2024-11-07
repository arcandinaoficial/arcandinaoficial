/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['i.ytimg.com'], 
        unoptimized: true, 
    },
    assetPrefix: '',
    basePath: '',
    output: 'export'
};

export default nextConfig;
