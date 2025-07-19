/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb", // Fixed typo: was "bodySIzeLimit"
        },
    },
};

export default nextConfig;