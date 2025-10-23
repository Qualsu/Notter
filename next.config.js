/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "files.edgestore.dev",
            "img.clerk.com",
            "media.discordapp.net",
            "localhost"
        ]
    }
}

module.exports = nextConfig