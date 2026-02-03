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
        <view
          class="filter-tab"
          v-for="tab in filterTabs"
          :key="tab.id"
          @click="switchTab(tab.id)"
          :class="{ active: currentTab === tab.id }"
        >
          <image v-if="tab.icon" :src="tab.icon" class="filter-tab-icon"></image>
          <text>{{ tab.name }}</text>
        </view>
      </view>
      
      <!-- 分类筛选：显示当前大类下的小类（胶囊标签，支持多选） -->
      <view v-if="showCategoryTabs && categoryList.length > 0" class="category-tabs">
        <view
          class="category-tab"
          v-for="category in categoryList"
          :key="category.id"
          @click="switchCategory(category.id)"
          :class="{ active: currentCategories.includes(category.id) }"
        >
          <text>{{ category.name }}</text>
        </view>
      </view>

      <!-- 就业类型筛选 -->
      <view class="emp-type-tabs">
        <view
          class="emp-type-tab"
          v-for="type in empTypeList"
          :key="type.id"
          @click="switchEmpType(type.id)"
          :class="{ active: currentEmpType === type.id }"
        >
          <text>{{ type.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 职位列表 -->
    <view class="job-list">
      <job-card v-for="job in jobList" :key="job.id" :data="job"></job-card>
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
  components: { jobCard },
  data() {
    return {
      // 搜索关键字
      keyword: '',
      // 大分类
      filterTabs: [
        { id: '100', name: '技术开发类', icon: '/static/category/tech.png' },
        { id: '200', name: '产品与设计类', icon: '/static/category/design.png' },
        { id: '300', name: '技术管理类', icon: '/static/category/product.png' }
      ],
      allCategories: [],
      categoryList: [], // 当前大类下的小类
      empTypeList: [
        { id: 0, name: '全部' },
        { id: 1, name: '全职' },
        { id: 2, name: '兼职' },
        { id: 3, name: '实习' }
      ],
      currentTab: '',            // 当前选中的大类id
      currentCategories: [],     // 选中的小类id（多选，为数组，number类型）
      currentEmpType: 0,         // 当前选的就业类型
      showCategoryTabs: false,   // 是否显示小类标签
      jobList: []
    }
  },
  onLoad() {
    this.getJobCategories()
    this.getJobList()
  },
  methods: {
    // 筛选职位列表，根据大类、小类和就业类型
    async getJobList() {
      try {
        let jobsData = []
        // 情况1：只选大类（currentTab），且没选小类，则请求后端的大类接口
        // 情况2：选了小类(如101,103)，则用all接口后前端筛选
        // 情况3：选了就业类型，则加类型条件

        // 1. 搜索优先
        if (this.keyword) {
          await this.searchJobs()
          return
        }

        // 2. 判断筛选
        if (this.currentTab && this.currentEmpType > 0) {
          // 大类+就业类型
          jobsData = await jobApi.getJobsByCategoryAndType(this.currentTab, this.currentEmpType)
        } else if (this.currentTab) {
          // 只��大类
          jobsData = await jobApi.getJobsByCategory(this.currentTab)
        } else {
          // 全部
          jobsData = await jobApi.getAllJobs()
        }

        // 格式处理，支持各种后端返回（数组或包装对象）
        if (Array.isArray(jobsData)) {
          // ok
        } else if (jobsData && typeof jobsData === 'object') {
          jobsData = jobsData.list || jobsData.data || jobsData.jobs || []
        } else {
          jobsData = []
        }

        // 3. 小类多选：如果有选中任何小类
        if (this.currentCategories.length > 0) {
          const categoryIds = this.currentCategories.map(id => parseInt(id))
          jobsData = jobsData.filter(job =>
            job.category_id !== undefined && categoryIds.includes(Number(job.category_id))
          )
        }
        // 4. 设置
        this.jobList = jobsData
      } catch (error) {
        this.jobList = []
        uni.showToast({ title: '获取职位失败', icon: 'none' })
        console.error(error)
      }
    },

    // 就业类型筛选
    switchEmpType(empTypeId) {
      if (this.currentEmpType !== empTypeId) {
        this.currentEmpType = empTypeId
        this.getJobList()
      }
    },

    // 搜索
    onSearchInput() {
      if (this.keyword) {
        this.searchJobs()
      }
    },

    async searchJobs() {
      try {
        let res = await jobApi.searchJobs(this.keyword)
        if (Array.isArray(res)) {
          this.jobList = res
        } else if (typeof res === 'object' && Object.keys(res).length > 0) {
          this.jobList = res.list || res.data || res.jobs || []
        } else {
          this.jobList = []
        }
      } catch (error) {
        this.jobList = []
        console.error('搜索职位失败:', error)
      }
    },

    // 取消搜索
    onCancelSearch() {
      this.keyword = ''
      this.getJobList()
    },

    // 点击大类tab（大类切换、显示/隐藏小类胶囊标签）
    switchTab(tabId) {
      if (this.currentTab === tabId && this.showCategoryTabs) {
        this.showCategoryTabs = false
        this.currentTab = ''
        this.categoryList = []
        this.currentCategories = []
      } else {
        this.currentTab = tabId
        this.showCategoryTabs = true
        this.currentCategories = []
        // 获取该大类下的小类: allCategories里 parent_id == tabId
        this.categoryList = this.allCategories.filter(cat => String(cat.parent_id) === String(tabId))
      }
      this.getJobList()
    },

    // 小类多选/取消（胶囊标签点击）
    switchCategory(categoryId) {
      // 多选
      const id = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
      if (this.currentCategories.includes(id)) {
        this.currentCategories = this.currentCategories.filter(cid => cid !== id)
      } else {
        this.currentCategories.push(id)
      }
      this.getJobList()
    },

    // 获取所有职位分类（���类和小类）
    async getJobCategories() {
      try {
        const res = await jobApi.getJobCategories()
        // 处理为[{id, name, parent_id, ...}]
        if (Array.isArray(res)) {
          this.allCategories = res
        } else if (res && typeof res === 'object') {
          this.allCategories = res.list || res.data || res.jobs || []
        } else {
          // 兜底数据
          this.allCategories = [
            { id: 100, name: '技术开发类', parent_id: null, level: 1 },
            { id: 101, name: '前端', parent_id: 100, level: 2 },
            { id: 102, name: '后端', parent_id: 100, level: 2 },
            { id: 103, name: '移动端', parent_id: 100, level: 2 },
            { id: 104, name: '数据与AI', parent_id: 100, level: 2 },
            { id: 105, name: '测试', parent_id: 100, level: 2 },
            { id: 106, name: '运维/DevOps', parent_id: 100, level: 2 },
            { id: 107, name: '网络安全', parent_id: 100, level: 2 },
            { id: 108, name: '嵌入式/硬件', parent_id: 100, level: 2 },
            { id: 200, name: '产品与设计类', parent_id: null, level: 1 },
            { id: 300, name: '技术管理类', parent_id: null, level: 1 }
          ]
        }
      } catch (error) {
        // fallback
        this.allCategories = [
          { id: 100, name: '技术开发类', parent_id: null, level: 1 },
          { id: 101, name: '前端', parent_id: 100, level: 2 },
          { id: 102, name: '后端', parent_id: 100, level: 2 },
          { id: 103, name: '移动端', parent_id: 100, level: 2 },
          { id: 104, name: '数据与AI', parent_id: 100, level: 2 },
          { id: 105, name: '测试', parent_id: 100, level: 2 },
          { id: 106, name: '运维/DevOps', parent_id: 100, level: 2 },
          { id: 107, name: '网络安全', parent_id: 100, level: 2 },
          { id: 108, name: '嵌入式/硬件', parent_id: 100, level: 2 },
          { id: 200, name: '产品与设计类', parent_id: null, level: 1 },
          { id: 300, name: '技术管理类', parent_id: null, level: 1 }
        ]
      }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.filter-tab-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 8rpx;
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
  margin: 8rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  cursor: pointer;
  user-select: none;
  transition: background 0.18s;
}
.category-tab.active {
  background-color: #007aff;
  color: #fff;
}
/* 就业类型筛选 */
.emp-type-tabs {
  display: flex;
  flex-wrap: wrap;
  padding: 15rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}
.emp-type-tab {
  padding: 10rpx 20rpx;
  margin: 10rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  cursor: pointer;
  user-select: none;
  transition: background 0.18s;
}
.emp-type-tab.active {
  background-color: #007aff;
  color: #fff;
}
.job-list {
  padding: 0 20rpx;
  /* 瀑布流布局 */
  column-count: 2; /* 分为2列 */
  column-gap: 20rpx; /* 列间距 */
  column-fill: balance; /* 平衡列高 */
}
.empty-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
</style>