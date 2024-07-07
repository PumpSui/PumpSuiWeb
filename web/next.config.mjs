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
            }
        ]
    }
};

export default nextConfig;
