// 修改next.config.mjs以支持Vercel部署
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用图像优化，简化部署
  images: {
    unoptimized: true,
  },
  
  // 确保应用可以在任何路径下运行
  basePath: '',
  
  // 禁用严格模式以避免开发中的双重渲染
  reactStrictMode: false,
  
  // 环境变量
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
  
  // 禁用X-Powered-By头
  poweredByHeader: false,
  
  // 配置webpack
  webpack: (config, { isServer }) => {
    // 在这里可以添加自定义webpack配置
    return config;
  },
};

export default nextConfig;