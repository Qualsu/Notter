/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "files.edgestore.dev",
            "img.clerk.com",
            "localhost",
            "db.api.qual.su"
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'db.api.qual.su',
                port: '8000', 
                pathname: '/**',
            },
        ]
    }
}

module.exports = nextConfig