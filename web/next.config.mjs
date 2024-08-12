/** @type {import('next').NextConfig} */
const nextConfig = {
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
    compiler:{
        removeConsole:{
            exclude: ['error']
        }
    }
};

export default nextConfig;
