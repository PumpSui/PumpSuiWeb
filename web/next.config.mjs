/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'svgshare.com'
            },
            {
                protocol: 'https',
                hostname: 'images.contentstack.io'
            },
            {
                protocol: 'https',
                hostname: 'imgur.com'
            },
            {
                protocol: 'https',
                hostname: 'ucarecdn.com'
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com'
            }
        ]
    },
    webpack: (config, { isServer, dev }) => {
        if (!dev && !isServer) {
            config.optimization.minimizer = config.optimization.minimizer || [];
            config.optimization.minimizer.push(
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    },
                })
            );
        }
        return config;
    },
};

export default nextConfig;