/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions:{
            bodySIzeLimit: "5mb",
        },
    },
};

export default nextConfig;
