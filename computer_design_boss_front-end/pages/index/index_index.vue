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
        <job-card v-for="job in jobList" :key="job.id" :data="job"></job-card>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore" @click="loadMore">
        <text>加载更多</text>
      </view>
    </view>
    
    <!-- 发布职位按钮 -->
    <view class="add-job-btn" @click="goToAddJob">
      <text>+</text>
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
      categoryList: [],
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
    this.getJobCategories()
  },
  onPullDownRefresh() {
    this.onRefresh()
  },
  methods: {
    async getRecommendJobs() {
      try {
        console.log('开始请求推荐职位...')
        const res = await jobApi.getAllJobs()
        
        // 打印原始数据用于调试
        console.log('后端返回原始数据:', res)
        console.log('数据类型:', typeof res)
        console.log('是否为数组:', Array.isArray(res))
        console.log('是否有data属性:', res && 'data' in res)
        
        // 检查后端返回的数据
        if (res) {
          if (Array.isArray(res)) {
            // 如果是数组，直接使用
            this.jobList = res
            console.log('成功设置jobList，长度:', res.length)
          } else if (typeof res === 'object' && Object.keys(res).length > 0) {
            // 如果是对象，尝试提取其中的数组数据
            // 检查是否有类似'list'、'data'、'jobs'等字段
            if (res.list && Array.isArray(res.list)) {
              this.jobList = res.list
              console.log('从res.list设置jobList，长度:', res.list.length)
            } else if (res.data && Array.isArray(res.data)) {
              this.jobList = res.data
              console.log('从res.data设置jobList，长度:', res.data.length)
            } else if (res.jobs && Array.isArray(res.jobs)) {
              this.jobList = res.jobs
              console.log('从res.jobs设置jobList，长度:', res.jobs.length)
            } else {
              // 如果无法提取数组数据，显示为空
              this.jobList = []
              console.error('获取推荐职位失败: 无法提取有效数据', res)
              uni.showToast({
                title: '获取推荐职位失败: 数据格式错误',
                icon: 'none'
              })
            }
          } else {
            // 其他情况显示为空
            this.jobList = []
            console.error('获取推荐职位失败: 无效数据格式', res)
            uni.showToast({
              title: '获取推荐职位失败',
              icon: 'none'
            })
          }
        } else {
          // 没有数据返回
          this.jobList = []
          console.log('后端返回空数据')
        }
      } catch (error) {
        this.jobList = []
        console.error('获取推荐职位失败:', error)
        console.error('错误详情:', error.message, error.stack)
        uni.showToast({
          title: '获取推荐职位失败',
          icon: 'none'
        })
      }
    },
    
    goToSearch() {
      uni.navigateTo({
        url: '/pages/job/list/job_list_index'
      })
    },
    
    goToCategory(categoryId) {
      this.currentCategory = categoryId
      this.getJobsByCategory()
    },
    
    async getJobsByCategory() {
      try {
        const res = await jobApi.getJobsByCategory(this.currentCategory)
        
        // 打印原始数据用于调试
        console.log('获取分类职位原始数据:', res)
        
        if (res) {
          if (Array.isArray(res)) {
            // 如果是数组，直接使用
            this.jobList = res
          } else if (typeof res === 'object' && Object.keys(res).length > 0) {
            // 如果是对象，尝试提取其中的数组数据
            if (res.list && Array.isArray(res.list)) {
              this.jobList = res.list
            } else if (res.data && Array.isArray(res.data)) {
              this.jobList = res.data
            } else if (res.jobs && Array.isArray(res.jobs)) {
              this.jobList = res.jobs
            } else {
              // 如果无法提取数组数据，显示为空
              this.jobList = []
              console.error('获取分类职位失败: 无法提取有效数据', res)
              uni.showToast({
                title: '获取分类职位失败: 数据格式错误',
                icon: 'none'
              })
            }
          } else {
            this.jobList = []
          }
        } else {
          this.jobList = []
        }
      } catch (error) {
        console.error('获取分类职位失败:', error)
        this.jobList = []
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
      this.getJobCategories()
      uni.stopPullDownRefresh()
    },
    
    // 跳转到发布职位页面
    goToAddJob() {
      uni.navigateTo({
        url: '/pages/job/add/job_add_index'
      })
    },
    
    getJobCategories() {
      // 直接使用固定的大类数据，确保图标正确显示
      const mainCategories = [
        { id: '100', name: '技术开发', icon: '/static/category/tech.png' },
        { id: '200', name: '产品与设计', icon: '/static/category/design.png' },
        { id: '300', name: '技术管理', icon: '/static/category/product.png' }
      ]
      
      // 尝试从后端获取数据，如果成功则处理后使用，否则使用固定数据
      jobApi.getJobCategories()
        .then(res => {
          if (res && Array.isArray(res)) {
            // 过滤出大类（parent_id为null或不存在的分类）
            const parentCategories = res.filter(category => 
              !category.parent_id || category.parent_id === null
            )
            
            if (parentCategories.length > 0) {
              // 使用后端返回的大类数据，但确保图标正确
              this.categoryList = parentCategories.map(category => ({
                ...category,
                icon: `/static/category/${this.getCategoryIcon(category.id)}.png`
              }))
            } else {
              // 如果后端没有返回大类数据，使用固定数据
              this.categoryList = mainCategories
            }
          } else {
            // 如果后端API有问题，使用固定数据
            this.categoryList = mainCategories
          }
        })
        .catch(error => {
          console.error('获取职位分类失败:', error)
          // 使用固定数据作为备选方案
          this.categoryList = mainCategories
        })
    },
    
    getCategoryIcon(categoryId) {
      // 根据分类ID返回对应的图标名称
      const iconMap = {
        // 大类图标映射
        '100': 'tech',     // 技术开发大类
        '200': 'design',   // 产品与设计大类
        '300': 'product',  // 技术管理大类
        // 兼容旧的小类ID
        '1001': 'tech',    // 技术小类
        '1002': 'design',  // 设计小类
        '1003': 'market'   // 市场小类
      }
      return iconMap[categoryId] || 'tech'
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

/* 发布职位按钮 */
.add-job-btn {
  position: fixed;
  bottom: 80rpx;
  right: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  height: 120rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 60rpx;
  border-radius: 50%;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.3);
  z-index: 999;
}

.btn-text {
  font-size: 20rpx;
  position: absolute;
  bottom: 15rpx;
}
</style>