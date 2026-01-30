<template>
  <view class="user-page">
    <!-- 用户信息 -->
    <view class="user-info">
      <image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
      <view class="user-name">
        <text>未登录</text>
      </view>
      <view class="login-btn" @click="login">
        <text>登录/注册</text>
      </view>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item">
        <uni-icons type="person" size="30" color="#666"></uni-icons>
        <text class="menu-text">我的收藏</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
      
      <view class="menu-item">
        <uni-icons type="clock" size="30" color="#666"></uni-icons>
        <text class="menu-text">浏览历史</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
      
      <view class="menu-item">
        <uni-icons type="settings" size="30" color="#666"></uni-icons>
        <text class="menu-text">设置</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null
    }
  },
  onShow() {
    // 检查用户登录状态
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      // 这里可以检查用户登录状态
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    },
    login() {
      // 登录逻辑
      uni.showToast({
        title: '登录功能开发中',
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.user-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.user-info {
  background-color: #fff;
  padding: 50rpx 0;
  text-align: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
}

.user-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.login-btn {
  background-color: #007aff;
  color: #fff;
  padding: 15rpx 40rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  display: inline-block;
}

.menu-section {
  background-color: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 20rpx;
  border-bottom: 1rpx solid #eee;
}

.menu-text {
  flex: 1;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #333;
}
</style>