/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx'
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname:'svgshare.com'
            },
            {
                protocol:'https',
                hostname:'images.contentstack.io'
            },
            {
                protocol:'https',
                hostname:'imgur.com'
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
};

const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
