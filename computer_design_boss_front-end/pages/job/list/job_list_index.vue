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
          <image v-if="tab.icon" :src="tab.icon" class="filter-tab-icon"></image>
          <text>{{ tab.name }}</text>
        </view>
      </view>
      
      <!-- 分类筛选 -->
      <view class="category-tabs" v-if="showCategoryTabs">
        <view class="category-tab" v-for="category in categoryList" :key="category.id" @click="switchCategory(category.id)" :class="{ active: currentCategories.includes(category.id) }">
          <text>{{ category.name }}</text>
        </view>
      </view>
      
      <!-- 就业类型筛选 -->
      <view class="emp-type-tabs">
        <view class="emp-type-tab" v-for="type in empTypeList" :key="type.id" @click="switchEmpType(type.id)" :class="{ active: currentEmpType === type.id }">
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
  components: {
    jobCard
  },
  data() {
    return {
      keyword: '',
      // 大分类（一级分类）
      filterTabs: [
        { id: '100', name: '技术开发类', icon: '/static/category/tech.png' },
        { id: '200', name: '产品与设计类', icon: '/static/category/design.png' },
        { id: '300', name: '技术管理类', icon: '/static/category/product.png' }
      ],
      // 所有分类数据（包括大分类和小分类）
      allCategories: [],
      // 当前显示的小分类
      categoryList: [],
      empTypeList: [
        { id: 0, name: '全部' },
        { id: 1, name: '全职' },
        { id: 2, name: '兼职' },
        { id: 3, name: '实习' }
      ],
      currentTab: '',
      currentCategories: [],
      currentEmpType: 0,
      showCategoryTabs: false,
      // 用于跟踪当前激活的大分类ID
      activeParentCategory: null,
      jobList: []
    }
  },
  onLoad() {
    this.getJobList()
    this.getJobCategories()
  },
  methods: {
    async getJobList() {
      try {
        console.log('开始请求职位列表...')
        console.log('当前分类ID:', this.currentCategories)
        console.log('当前就业类型:', this.currentEmpType)
        
        let res
        // 根据当前选择的分类和就业类型获取职位数据
        if (this.currentTab && this.currentEmpType > 0) {
          // 有大分类和就业类型筛选
          console.log('请求分类和类型筛选数据')
          res = await jobApi.getJobsByCategoryAndType(this.currentTab, this.currentEmpType)
        } else if (this.currentTab) {
          // 只有大分类筛选
          console.log('请求分类筛选数据')
          res = await jobApi.getJobsByCategory(this.currentTab)
        } else {
          // 无筛选，获取全部职位
          console.log('请求全部职位数据')
          res = await jobApi.getAllJobs()
        }
        
        // 打印原始数据用于调试
        console.log('后端返回原始数据:', res)
        console.log('数据类型:', typeof res)
        console.log('是否为数组:', Array.isArray(res))
        console.log('是否有data属性:', res && 'data' in res)
        
        // 检查后端返回的数据
        let jobsData = []
        if (res) {
          if (Array.isArray(res)) {
            jobsData = res
          } else if (typeof res === 'object' && Object.keys(res).length > 0) {
            // 如果是对象，尝试提取其中的数组数据
            if (res.list && Array.isArray(res.list)) {
              jobsData = res.list
            } else if (res.data && Array.isArray(res.data)) {
              jobsData = res.data
            } else if (res.jobs && Array.isArray(res.jobs)) {
              jobsData = res.jobs
            }
          }
        }
        
        // 在前端进行小分类筛选
        if (this.currentCategories.length > 0) {
          // 将currentCategories转换为整数类型进行比较
          const categoryIds = this.currentCategories.map(id => parseInt(id))
          // 筛选出分类ID在currentCategories中的职位
          this.jobList = jobsData.filter(job => 
            job.category_id !== undefined && job.category_id !== null && categoryIds.includes(job.category_id)
          )
          console.log('前端小分类筛选后jobList长度:', this.jobList.length)
        } else {
          // 如果没有选择小分类，直接使用获取到的数据
          this.jobList = jobsData
          console.log('成功设置jobList，长度:', this.jobList.length)
        }
        
        if (this.jobList.length === 0) {
          console.log('当前筛选条件下没有职位数据')
        }
        
      } catch (error) {
        this.jobList = []
        console.error('获取职位列表失败:', error)
        console.error('错误详情:', error.message, error.stack)
        uni.showToast({
          title: '获取职位失败',
          icon: 'none'
        })
      }
    },
    
    switchEmpType(empTypeId) {
      this.currentEmpType = empTypeId
      this.getJobList()
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
        
        // 检查搜索结果
        if (res) {
          if (Array.isArray(res)) {
            this.jobList = res
          } else if (typeof res === 'object' && Object.keys(res).length > 0) {
            if (res.list && Array.isArray(res.list)) {
              this.jobList = res.list
            } else if (res.data && Array.isArray(res.data)) {
              this.jobList = res.data
            } else if (res.jobs && Array.isArray(res.jobs)) {
              this.jobList = res.jobs
            } else {
              this.jobList = []
              console.error('搜索职位失败: 无法提取有效数据', res)
            }
          } else {
            this.jobList = []
          }
        } else {
          this.jobList = []
        }
      } catch (error) {
        console.error('搜索职位失败:', error)
      }
    },
    
    onCancelSearch() {
      this.keyword = ''
      this.getJobList()
    },
    
    switchTab(tabId) {
      // 点击大分类时
      // 如果当前已经在这个分类并且小分类已经显示，则隐藏小分类并显示全部职位
      if (this.currentTab === tabId && this.showCategoryTabs) {
        this.showCategoryTabs = false
        this.currentTab = ''
        this.activeParentCategory = null
        this.categoryList = []
        this.currentCategories = []
      } else {
        // 否则，显示该大分类下的小分类，并只显示该大分类的职位
        this.currentTab = tabId
        this.showCategoryTabs = true
        this.activeParentCategory = tabId
        // 清空小分类选择
        this.currentCategories = []
        // 获取该大分类下的小分类
        this.categoryList = this.allCategories.filter(cat => 
          cat.parent_id && cat.parent_id.toString() === tabId
        )
      }
      this.getJobList()
    },
    
    switchCategory(categoryId) {
      // 切换分类选择状态
      if (this.currentCategories.includes(categoryId)) {
        // 如果已经选中，则取消选择
        this.currentCategories = this.currentCategories.filter(id => id !== categoryId)
      } else {
        // 如果未选中，则添加选择
        this.currentCategories.push(categoryId)
      }
      this.getJobList()
    },
    
    async getJobCategories() {
      try {
        // 从后端API获取分类数据
        const res = await jobApi.getJobCategories()
        if (res && Array.isArray(res)) {
          // 保存所有分类数据
          this.allCategories = res
          
          // 大分类（一级分类）已经在filterTabs中定义，不需要从API获取
          // 我们只需要在点击大分类时获取对应的小分类
        } else {
          // 如果后端API有问题，使用默认数据
          this.allCategories = [
            {"id": 100, "name": "技术开发类", "parent_id": null, "level": 1},
            {"id": 101, "name": "前端", "parent_id": 100, "level": 2},
            {"id": 102, "name": "后端", "parent_id": 100, "level": 2},
            {"id": 103, "name": "移动端", "parent_id": 100, "level": 2},
            {"id": 104, "name": "数据与AI", "parent_id": 100, "level": 2},
            {"id": 105, "name": "测试", "parent_id": 100, "level": 2},
            {"id": 106, "name": "运维/DevOps", "parent_id": 100, "level": 2},
            {"id": 107, "name": "网络安全", "parent_id": 100, "level": 2},
            {"id": 108, "name": "嵌入式/硬件", "parent_id": 100, "level": 2},
            {"id": 200, "name": "产品与设计类", "parent_id": null, "level": 1},
            {"id": 300, "name": "技术管理类", "parent_id": null, "level": 1}
          ]
        }
      } catch (error) {
        console.error('获取职位分类失败:', error)
        // 出错时使用默认数据
        this.allCategories = [
          {"id": 100, "name": "技术开发类", "parent_id": null, "level": 1},
          {"id": 101, "name": "前端", "parent_id": 100, "level": 2},
          {"id": 102, "name": "后端", "parent_id": 100, "level": 2},
          {"id": 103, "name": "移动端", "parent_id": 100, "level": 2},
          {"id": 104, "name": "数据与AI", "parent_id": 100, "level": 2},
          {"id": 105, "name": "测试", "parent_id": 100, "level": 2},
          {"id": 106, "name": "运维/DevOps", "parent_id": 100, "level": 2},
          {"id": 107, "name": "网络安全", "parent_id": 100, "level": 2},
          {"id": 108, "name": "嵌入式/硬件", "parent_id": 100, "level": 2},
          {"id": 200, "name": "产品与设计类", "parent_id": null, "level": 1},
          {"id": 300, "name": "技术管理类", "parent_id": null, "level": 1}
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
  margin: 10rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
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