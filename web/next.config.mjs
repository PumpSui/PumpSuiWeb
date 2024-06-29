/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname:'svgshare.com'
            }
        ]
    }
};

export default nextConfig;
