/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "files.edgestore.dev",
            "img.clerk.com",
            "localhost",
            "db.api.qual.su"
        ]
    }
}

module.exports = nextConfig