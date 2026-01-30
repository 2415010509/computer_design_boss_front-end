<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar" @click="goToSearch">
      <uni-icons type="search" size="30" color="#999"></uni-icons>
      <text class="search-text">搜索职位、公司名称</text>
    </view>
    
    <!-- 轮播图 -->
    <swiper :autoplay="true" :interval="3000" :duration="1000" indicator-dots circular>
      <swiper-item v-for="(banner, index) in bannerList" :key="index">
        <image :src="banner.imageUrl" class="banner-img"></image>
      </swiper-item>
    </swiper>
    
    <!-- 分类入口 -->
    <view class="category-section">
      <view class="category-item" v-for="category in categoryList" :key="category.id" @click="goToCategory(category.id)">
        <image :src="category.icon" class="category-icon"></image>
        <text class="category-name">{{ category.name }}</text>
      </view>
    </view>
    
    <!-- 推荐职位区域 -->
    <view class="job-section">
      <view class="section-header">
        <text class="section-title">推荐职位</text>
        <text class="more-btn" @click="scrollToJobList">查看更多</text>
      </view>
      
      <!-- 职位列表 -->
      <view class="job-list" ref="jobList">
        <job-card v-for="job in jobList" :key="job.id" :job="job"></job-card>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore" @click="loadMore">
        <text>加载更多</text>
      </view>
    </view>
  </view>
</template>

<script>
import jobCard from '@/component/job/job-card.vue'
import { jobApi } from '@/common/api/job.js'

export default {
  components: {
    jobCard
  },
  data() {
    return {
      bannerList: [
        { id: 1, imageUrl: '/static/banner1.png' },
        { id: 2, imageUrl: '/static/banner2.png' },
        { id: 3, imageUrl: '/static/banner3.png' }
      ],
      categoryList: [
        { id: '1001', name: '技术', icon: '/static/category/tech.png' },
        { id: '1002', name: '产品', icon: '/static/category/product.png' },
        { id: '1003', name: '设计', icon: '/static/category/design.png' },
        { id: '1004', name: '运营', icon: '/static/category/operate.png' },
        { id: '1005', name: '市场', icon: '/static/category/market.png' }
      ],
      jobList: [],
      hasMore: true,
      currentPage: 1,
      pageSize: 10,
      currentCategory: '',
      currentEmpType: ''
    }
  },
  onLoad() {
    this.getRecommendJobs()
  },
  onPullDownRefresh() {
    this.onRefresh()
  },
  methods: {
    async getRecommendJobs() {
      try {
        const res = await jobApi.getAllJobs()
        this.jobList = res
        console.log('获取推荐职位成功:', res)
      } catch (error) {
        console.error('获取推荐职位失败:', error)
        uni.showToast({
          title: '获取职位失败',
          icon: 'none'
        })
      }
    },
    
    goToSearch() {
      uni.navigateTo({
        url: '/pages/job/list/index'
      })
    },
    
    goToCategory(categoryId) {
      this.currentCategory = categoryId
      this.getJobsByCategory()
    },
    
    async getJobsByCategory() {
      try {
        const res = await jobApi.getJobsByCategory(this.currentCategory)
        this.jobList = res
      } catch (error) {
        console.error('获取分类职位失败:', error)
      }
    },
    
    scrollToJobList() {
      uni.pageScrollTo({
        selector: '.job-list',
        duration: 300
      })
    },
    
    loadMore() {
      // 加载更多逻辑
      this.currentPage++
      // 这里可以实现分页加载
    },
    
    onRefresh() {
      // 下拉刷新逻辑
      this.currentPage = 1
      this.getRecommendJobs()
      uni.stopPullDownRefresh()
    }
  }
}
</script>

<style>
.container {
  padding: 0 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 15rpx 20rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.search-text {
  margin-left: 15rpx;
  color: #999;
  font-size: 28rpx;
}

.banner-img {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
}

.category-section {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 30rpx 0;
  margin: 20rpx 0;
  border-radius: 10rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.category-name {
  font-size: 26rpx;
  color: #333;
}

.job-section {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-btn {
  font-size: 26rpx;
  color: #999;
}

.job-list {
  margin-bottom: 20rpx;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
}
</style>