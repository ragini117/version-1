const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Rewrites the route from /blog/blog-details/:slug to /:slug
    async rewrites() {
        return [
          {
            source: '/:slug', // Custom route structure
            destination: '/blog/blog-details/:slug', // Dynamic route
          },
        ]
    },
    webpack: (config) => {
        config.resolve.alias['jquery'] = path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.js');
        return config;
    }
}

module.exports = nextConfig
