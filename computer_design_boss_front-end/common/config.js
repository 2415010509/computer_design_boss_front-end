// 开发环境配置
const config = {
  // 开发环境（本地开发）
  development: {
    baseURL: 'http://localhost:5000/api', // 后端本地地址
    staticURL: 'http://localhost:5000'
  },
  
  // 生产环境
  production: {
    baseURL: 'https://api.yourdomain.com/api',
    staticURL: 'https://yourdomain.com'
  }
}

// 根据环境选择配置
const env = process.env.NODE_ENV || 'development'
export default config[env]