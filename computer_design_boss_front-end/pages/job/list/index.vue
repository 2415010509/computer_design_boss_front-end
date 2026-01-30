<template>
  <view class="job-list-page">
    <!-- 搜索栏 -->
    <view class="search-container">
      <view class="search-bar">
        <uni-icons type="search" size="30" color="#999"></uni-icons>
        <input type="text" placeholder="搜索职位、公司名称" v-model="keyword" @input="onSearchInput" />
        <text class="cancel-btn" @click="onCancelSearch">取消</text>
      </view>
    </view>
    
    <!-- 筛选条件 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <view class="filter-tab" v-for="tab in filterTabs" :key="tab.id" @click="switchTab(tab.id)" :class="{ active: currentTab === tab.id }">
          <text>{{ tab.name }}</text>
        </view>
      </view>
      
      <!-- 分类筛选 -->
      <view class="category-tabs" v-if="showCategoryTabs">
        <view class="category-tab" v-for="category in categoryList" :key="category.id" @click="switchCategory(category.id)" :class="{ active: currentCategory === category.id }">
          <text>{{ category.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 职位列表 -->
    <view class="job-list">
      <job-card v-for="job in jobList" :key="job.id" :job="job"></job-card>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-if="jobList.length === 0">
      <text>暂无职位</text>
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
      keyword: '',
      filterTabs: [
        { id: 'all', name: '全部' },
        { id: 'tech', name: '技术' },
        { id: 'product', name: '产品' },
        { id: 'design', name: '设计' }
      ],
      categoryList: [
        { id: '1001', name: '技术' },
        { id: '1002', name: '产品' },
        { id: '1003', name: '设计' },
        { id: '1004', name: '运营' },
        { id: '1005', name: '市场' }
      ],
      currentTab: 'all',
      currentCategory: '',
      showCategoryTabs: false,
      jobList: []
    }
  },
  onLoad() {
    this.getJobList()
  },
  methods: {
    async getJobList() {
      try {
        let res
        if (this.currentCategory) {
          res = await jobApi.getJobsByCategory(this.currentCategory)
        } else {
          res = await jobApi.getAllJobs()
        }
        this.jobList = res
      } catch (error) {
        console.error('获取职位列表失败:', error)
        uni.showToast({
          title: '获取职位失败',
          icon: 'none'
        })
      }
    },
    
    onSearchInput() {
      // 搜索输入处理
      if (this.keyword) {
        this.searchJobs()
      }
    },
    
    async searchJobs() {
      try {
        const res = await jobApi.searchJobs(this.keyword)
        this.jobList = res
      } catch (error) {
        console.error('搜索职位失败:', error)
      }
    },
    
    onCancelSearch() {
      this.keyword = ''
      this.getJobList()
      uni.navigateBack()
    },
    
    switchTab(tabId) {
      this.currentTab = tabId
      this.showCategoryTabs = tabId === 'all'
      this.getJobList()
    },
    
    switchCategory(categoryId) {
      this.currentCategory = categoryId
      this.getJobList()
    }
  }
}
</script>

<style>
.job-list-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-container {
  padding: 20rpx;
  background-color: #fff;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 15rpx 20rpx;
  border-radius: 8rpx;
}

.search-bar input {
  flex: 1;
  margin: 0 15rpx;
  font-size: 28rpx;
}

.cancel-btn {
  color: #007aff;
  font-size: 28rpx;
}

.filter-section {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.filter-tabs {
  display: flex;
  border-bottom: 1rpx solid #eee;
}

.filter-tab {
  flex: 1;
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
}

.filter-tab.active {
  color: #007aff;
  border-bottom: 2rpx solid #007aff;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  padding: 15rpx;
}

.category-tab {
  padding: 10rpx 20rpx;
  margin: 10rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
}

.category-tab.active {
  background-color: #007aff;
  color: #fff;
}

.job-list {
  padding: 0 20rpx;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
</style>