import config from '../config.js'

const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || '',
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
        console.error('网络请求失败:', err);
        reject(err);
      }
    })
  })
}

export default request