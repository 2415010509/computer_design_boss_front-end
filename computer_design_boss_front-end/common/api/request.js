import config from '../config.js'

// 请求重试机制
const requestWithRetry = (options, retryCount = 3) => {
  return new Promise((resolve, reject) => {
    const attemptRequest = (attempt) => {
      // 为每次请求生成唯一的时间戳参数，避免缓存问题
      const urlWithTimestamp = options.url + (options.url.includes('?') ? '&' : '?') + 't=' + Date.now();
      
      uni.request({
        url: config.baseURL + urlWithTimestamp,
        method: options.method || 'GET',
        data: options.data || {},
        timeout: 15000, // 增加超时时间到15秒
        sslVerify: false, // 开发环境下关闭SSL验证（避免证书问题）
        enableHttp2: false, // 禁用HTTP/2（可能解决序列错误问题）
        enableHttpDNS: false, // 禁用HTTP DNS（可能解决序列错误问题）
        enableQuic: false, // 禁用QUIC（可能解决序列错误问题）
        header: {
          'Content-Type': 'application/json',
          'Authorization': uni.getStorageSync('token') || '',
          'Cache-Control': 'no-cache', // 禁用缓存
          ...options.header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 检查响应数据格式
            const data = res.data;
            
            // 如果后端返回标准格式 {code: 200, data: [...], message: "..."}
            if (data && typeof data === 'object' && 'code' in data && 'data' in data) {
              // 检查是否成功
              if (data.code === 200) {
                resolve(data.data); // 返回实际数据
              } else {
                // 后端返回错误信息
                reject(data);
              }
            } 
            // 如果后端直接返回数组或对象
            else {
              resolve(data);
            }
          } else {
            console.error('HTTP请求失败:', res.statusCode, res.errMsg);
            reject(res.data || { error: `HTTP Error ${res.statusCode}` });
          }
        },
        fail: (err) => {
          console.error(`网络请求失败 (尝试 ${attempt + 1}/${retryCount}):`, err);
          
          // 如果还有重试次数，延迟后重试
          if (attempt < retryCount - 1) {
            const delay = Math.pow(2, attempt) * 1000; // 指数退避策略
            console.log(`将在 ${delay}ms 后重试...`);
            setTimeout(() => attemptRequest(attempt + 1), delay);
          } else {
            // 重试次数耗尽
            reject(err);
          }
        }
      })
    };
    
    // 开始第一次请求
    attemptRequest(0);
  });
}

// 导出带有重试机制的请求函数
export default requestWithRetry