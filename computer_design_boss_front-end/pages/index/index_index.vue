<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <uni-icons type="search" size="30" color="#999"></uni-icons>
      <input type="text" placeholder="搜索职位、公司名称" v-model="keyword" @input="onSearchInput" />
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
    
    <!-- 子分类标签区域 -->
    <view v-if="showCategoryTabs && subCategoryList.length > 0" class="sub-category-tabs">
      <view
        class="sub-category-tab"
        v-for="category in subCategoryList"
        :key="category.id"
        @click="selectSubCategory(category.id)"
        :class="{ active: selectedSubCategories.includes(category.id) }"
      >
        <text>{{ category.name }}</text>
      </view>
    </view>
    
    <!-- 就业类型筛选区域 -->
    <view class="emp-type-section">
      <view
        class="emp-type-item"
        v-for="type in empTypeList"
        :key="type.id"
        @click="selectEmpType(type.id)"
        :class="{ active: selectedEmpType === type.id }"
      >
        <text>{{ type.name }}</text>
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
      allCategories: [],
      subCategoryList: [],
      jobList: [],
      allJobs: [],
      hasMore: true,
      currentPage: 1,
      pageSize: 10,
      currentCategory: '',
      currentEmpType: '',
      keyword: '',
      selectedSubCategories: [],
      selectedEmpType: 0,
      showCategoryTabs: false,
      empTypeList: [
        { id: 0, name: '全部' },
        { id: 1, name: '全职' },
        { id: 2, name: '兼职' },
        { id: 3, name: '实习' }
      ]
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
        
        // 检查网络状态
        const networkType = await new Promise((resolve) => {
          uni.getNetworkType({
            success: (res) => resolve(res.networkType)
          })
        })
        console.log('当前网络状态:', networkType)
        
        if (networkType === 'none') {
          uni.showToast({
            title: '当前无网络连接',
            icon: 'none'
          })
          return
        }
        
        const res = await jobApi.getAllJobs()
        
        // 打印原始数据用于调试
        console.log('后端返回原始数据:', res)
        console.log('数据类型:', typeof res)
        console.log('是否为数组:', Array.isArray(res))
        console.log('是否有data属性:', res && 'data' in res)
        
        let jobsData = []
        
        // 检查后端返回的数据
        console.log('res的值:', res)
        console.log('res的类型:', typeof res)
        console.log('res是否为null:', res === null)
        console.log('res是否为undefined:', res === undefined)
        
        if (res !== null && res !== undefined) {
            console.log('res有值，开始处理...')
            if (Array.isArray(res)) {
                // 如果是数组，直接使用
                jobsData = res
                console.log('成功获取jobs数据，长度:', res.length)
                
                // 检查返回的数据结构
                if (jobsData.length > 0) {
                    console.log('第一条数据结构:', jobsData[0])
                    console.log('是否包含category_id:', 'category_id' in jobsData[0])
                    console.log('category_id值:', jobsData[0].category_id)
                }
            } else if (typeof res === 'object' && Object.keys(res).length > 0) {
                // 如果是对象，尝试提取其中的数组数据
                // 检查是否有类似'list'、'data'、'jobs'等字段
                if (res.list && Array.isArray(res.list)) {
                    jobsData = res.list
                    console.log('从res.list获取jobs数据，长度:', res.list.length)
                    if (jobsData.length > 0) {
                        console.log('第一条数据结构:', jobsData[0])
                        console.log('是否包含category_id:', 'category_id' in jobsData[0])
                        console.log('category_id值:', jobsData[0].category_id)
                    }
                } else if (res.data && Array.isArray(res.data)) {
                    jobsData = res.data
                    console.log('从res.data获取jobs数据，长度:', res.data.length)
                    if (jobsData.length > 0) {
                        console.log('第一条数据结构:', jobsData[0])
                        console.log('是否包含category_id:', 'category_id' in jobsData[0])
                        console.log('category_id值:', jobsData[0].category_id)
                    }
                } else if (res.jobs && Array.isArray(res.jobs)) {
                    jobsData = res.jobs
                    console.log('从res.jobs获取jobs数据，长度:', res.jobs.length)
                    if (jobsData.length > 0) {
                        console.log('第一条数据结构:', jobsData[0])
                        console.log('是否包含category_id:', 'category_id' in jobsData[0])
                        console.log('category_id值:', jobsData[0].category_id)
                    }
                } else {
                    // 如果无法提取数组数据，显示错误信息
                    console.error('获取推荐职位失败: 无法提取有效数据', res)
                    uni.showToast({
                        title: '获取推荐职位失败: 数据格式错误',
                        icon: 'none'
                    })
                    jobsData = []
                }
            } else {
                // 其他情况显示错误信息
                console.error('获取推荐职位失败: 无效数据格式', res)
                uni.showToast({
                    title: '获取推荐职位失败: 数据格式错误',
                    icon: 'none'
                })
                jobsData = []
            }
        } else {
            // 没有数据返回，显示错误信息
            console.log('后端返回空数据')
            uni.showToast({
                title: '获取推荐职位失败: 后端无数据返回',
                icon: 'none'
            })
            jobsData = []
        }
        
        // 如果从后端获取的数据为空，使用模拟数据
        if (jobsData.length === 0) {
            console.log('从后端获取的数据为空，使用模拟数据')
            jobsData = this.getMockJobsData()
        }
        
        // 检查数据情况
        console.log('jobsData的类型:', typeof jobsData)
        console.log('jobsData是否为数组:', Array.isArray(jobsData))
        console.log('jobsData的长度:', jobsData.length)
        
        // 处理职位数据，确保category_id为数字类型
        jobsData = jobsData.map(job => ({
            ...job,
            category_id: job.category_id && job.category_id !== '' ? Number(job.category_id) : null
        }))
        
        // 存储所有职位数据，用于本地搜索和筛选
        this.allJobs = jobsData
        this.jobList = jobsData
        
        // 添加更多调试信息
        console.log('存储的所有职位:', this.allJobs)
        console.log('allJobs的类型:', typeof this.allJobs)
        console.log('allJobs是否为数组:', Array.isArray(this.allJobs))
        console.log('allJobs的长度:', this.allJobs.length)
        console.log('jobList的长度:', this.jobList.length)
        if (this.allJobs.length > 0) {
          console.log('第一个职位的数据结构:', this.allJobs[0])
          console.log('第一个职位的分类ID:', this.allJobs[0].category_id)
          console.log('分类ID类型:', typeof this.allJobs[0].category_id)
        }
        
      } catch (error) {
        this.allJobs = []
        this.jobList = []
        console.error('获取推荐职位失败:', error)
        console.error('错误详情:', error.message, error.stack)
        
        // 根据错误类型显示不同的提示信息
        if (error.message && error.message.includes('Packet sequence number wrong')) {
          uni.showToast({
            title: '网络连接异常，请稍后重试',
            icon: 'none'
          })
        } else {
          uni.showToast({
            title: '获取推荐职位失败',
            icon: 'none'
          })
        }
      }
    },
    
    goToCategory(categoryId) {
        // 添加详细调试信息
        console.log('=== 点击分类开始 ===')
        console.log('点击的分类ID:', categoryId)
        console.log('点击的分类ID类型:', typeof categoryId)
        
        this.currentCategory = categoryId
        
        // 详细调试信息
        console.log('设置后的currentCategory:', this.currentCategory)
        console.log('设置后的currentCategory类型:', typeof this.currentCategory)
        
        // 检查是否为技术开发类（ID为100）
        console.log('检查是否为技术开发类:')
        console.log('categoryId === "100":', categoryId === '100')
        console.log('categoryId === 100:', categoryId === 100)
        
        if (categoryId === '100' || categoryId === 100) {
            this.showCategoryTabs = true
            // 获取技术开发的子分类
            console.log('获取技术开发的子分类:')
            this.subCategoryList = this.allCategories.filter(category => {
                const parentId = category.parent_id
                const isMatch = parentId && (parentId.toString() === '100' || parentId === 100)
                console.log('分类:', category.name, 'parent_id:', parentId, '类型:', typeof parentId, '是否匹配:', isMatch)
                return isMatch
            })
            console.log('获取到的子分类数量:', this.subCategoryList.length)
        } else {
            this.showCategoryTabs = false
            this.subCategoryList = []
        }
        
        // 重置筛选条件
        this.selectedSubCategories = []
        this.selectedEmpType = 0
        this.keyword = ''
        
        console.log('重置后的筛选条件:')
        console.log('selectedSubCategories:', this.selectedSubCategories)
        console.log('selectedEmpType:', this.selectedEmpType)
        console.log('keyword:', this.keyword)
        
        // 应用筛选
        console.log('准备应用筛选...')
        this.applyFilters()
        console.log('=== 点击分类结束 ===')
    },
    
    // 选择子分类
    selectSubCategory(categoryId) {
      // 将categoryId转换为数字类型，确保类型一致
      const numCategoryId = Number(categoryId)
      const index = this.selectedSubCategories.indexOf(numCategoryId)
      
      if (index === -1) {
        this.selectedSubCategories.push(numCategoryId)
      } else {
        this.selectedSubCategories.splice(index, 1)
      }
      
      console.log('选择的子分类:', this.selectedSubCategories)
      // 应用筛选
      this.applyFilters()
    },
    
    // 选择就业类型
    selectEmpType(typeId) {
      this.selectedEmpType = typeId
      
      // 应用筛选
      this.applyFilters()
    },
    
    // 搜索输入事件
    onSearchInput() {
      this.applyFilters()
    },
    
    // 应用所有筛选条件
    applyFilters() {
      // 添加详细调试信息
      console.log('=== 应用筛选开始 ===')
      console.log('当前分类:', this.currentCategory)
      console.log('当前分类类型:', typeof this.currentCategory)
      console.log('全部职位数:', this.allJobs.length)
      
      // 输出前几个职位的信息
      console.log('前3个职位信息:')
      for (let i = 0; i < Math.min(3, this.allJobs.length); i++) {
          console.log(`职位${i+1}:`, this.allJobs[i].title, '分类ID:', this.allJobs[i].category_id, '类型:', typeof this.allJobs[i].category_id)
      }
      
      let filteredJobs = [...this.allJobs]
      
      // 调试信息
      console.log('筛选前职位数:', filteredJobs.length)
      
      // 应用分类筛选
    if (this.currentCategory) {
        // 详细调试信息
        console.log('=== 分类筛选开始 ===')
        console.log('当前分类ID:', this.currentCategory)
        console.log('当前分类ID类型:', typeof this.currentCategory)
        console.log('筛选前职位总数:', filteredJobs.length)
        
        // 将当前分类ID统一转换为数字类型进行比较
        const currentCatNum = Number(this.currentCategory)
        
        // 保存符合条件的职位
        const matchedJobs = []
        
        filteredJobs = filteredJobs.filter(job => {
            // 确保job存在且有有效的category_id
            if (!job || job.category_id === null) {
                console.log('跳过无效职位数据:', job)
                return false
            }
            
            // 职位分类ID已经在getRecommendJobs中转换为数字
            const jobCategoryId = job.category_id
            
            // 调试信息
            console.log('职位:', job.title, '分类ID:', jobCategoryId, '类型:', typeof jobCategoryId)
            
            // 如果选择了技术开发类且有子分类筛选
            if (currentCatNum === 100 && this.selectedSubCategories.length > 0) {
                console.log('子分类筛选条件:', this.selectedSubCategories)
                const isMatch = this.selectedSubCategories.includes(jobCategoryId)
                console.log('子分类匹配结果:', isMatch)
                if (isMatch) {
                    matchedJobs.push(job)
                }
                return isMatch
            } else {
                // 检查是否是大类ID或其子分类ID
                // 对于大类ID（如100, 200, 300），直接匹配
                // 对于子分类ID（如101, 201），检查其是否以大类ID开头
                const jobCatStr = jobCategoryId.toString()
                const currentCatStr = this.currentCategory.toString()
                
                // 详细的比较信息
                console.log('=== 单个职位比较 ===')
                console.log('职位标题:', job.title)
                console.log('职位分类ID:', jobCategoryId, '类型:', typeof jobCategoryId)
                console.log('当前分类ID:', this.currentCategory, '类型:', typeof this.currentCategory)
                console.log('转换后的当前分类ID:', currentCatNum, '类型:', typeof currentCatNum)
                console.log('职位分类字符串:', jobCatStr, '长度:', jobCatStr.length)
                console.log('当前分类字符串:', currentCatStr, '长度:', currentCatStr.length)
                console.log('字符串比较:', jobCatStr, 'startsWith', currentCatStr)
                console.log('比较结果:', jobCatStr.startsWith(currentCatStr))
                
                const exactMatch = jobCategoryId === currentCatNum
                const startsWithMatch = jobCatStr.startsWith(currentCatStr)
                
                // 详细的匹配结果信息
                console.log('=== 匹配结果分析 ===')
                console.log('jobCategoryId:', jobCategoryId, '类型:', typeof jobCategoryId)
                console.log('currentCatNum:', currentCatNum, '类型:', typeof currentCatNum)
                console.log('完全匹配条件:', `${jobCategoryId} === ${currentCatNum}`)
                console.log('完全匹配结果:', exactMatch)
                
                console.log('jobCatStr:', jobCatStr, '长度:', jobCatStr.length)
                console.log('currentCatStr:', currentCatStr, '长度:', currentCatStr.length)
                console.log('前缀匹配条件:', `${jobCatStr}.startsWith(${currentCatStr})`)
                console.log('前缀匹配结果:', startsWithMatch)
                
                const isMatch = exactMatch || startsWithMatch
                console.log('最终匹配结果:', isMatch)
                
                // 额外的调试信息
                if (!isMatch) {
                    console.log('=== 不匹配原因分析 ===')
                    console.log('jobCategoryId和currentCatNum是否相等:', jobCategoryId === currentCatNum)
                    console.log('jobCatStr是否以currentCatStr开头:', jobCatStr.startsWith(currentCatStr))
                    console.log('jobCatStr.substring(0, currentCatStr.length):', jobCatStr.substring(0, currentCatStr.length))
                    console.log('currentCatStr:', currentCatStr)
                    console.log('两个字符串是否相等:', jobCatStr.substring(0, currentCatStr.length) === currentCatStr)
                }
                
                if (isMatch) {
                    matchedJobs.push(job)
                    console.log('添加到匹配列表')
                } else {
                    console.log('未匹配')
                }
                return isMatch
            }
        })
        
        console.log('匹配的职位列表:', matchedJobs)
        console.log('分类筛选后职位数:', filteredJobs.length)
        console.log('=== 分类筛选结束 ===')
    }
      
      // 应用就业类型筛选
      console.log('=== 应用就业类型筛选 ===')
      console.log('当前就业类型筛选:', this.selectedEmpType)
      if (this.selectedEmpType !== 0) {
        const beforeCount = filteredJobs.length
        filteredJobs = filteredJobs.filter(job => {
          const empTypeMatch = job.emp_type && Number(job.emp_type) === Number(this.selectedEmpType)
          console.log('职位:', job.title, 'emp_type:', job.emp_type, '匹配结果:', empTypeMatch)
          return empTypeMatch
        })
        console.log(`就业类型筛选后职位数: ${beforeCount} → ${filteredJobs.length}`)
      }
      
      // 应用关键词搜索
      console.log('=== 应用关键词搜索 ===')
      console.log('当前关键词:', this.keyword)
      if (this.keyword) {
        const beforeCount = filteredJobs.length
        const keywordLower = this.keyword.toLowerCase()
        filteredJobs = filteredJobs.filter(job => {
          const titleMatch = job.title && job.title.toLowerCase().includes(keywordLower)
          const companyMatch = job.company && job.company.toLowerCase().includes(keywordLower)
          const descriptionMatch = job.description && job.description.toLowerCase().includes(keywordLower)
          const isMatch = titleMatch || companyMatch || descriptionMatch
          console.log('职位:', job.title, '匹配结果:', isMatch)
          return isMatch
        })
        console.log(`关键词搜索后职位数: ${beforeCount} → ${filteredJobs.length}`)
      }
      
      // 更新职位列表
      console.log('=== 更新职位列表 ===')
      console.log('最终筛选结果:', filteredJobs.length)
      this.jobList = filteredJobs
      console.log('jobList长度:', this.jobList.length)
      console.log('=== 应用筛选结束 ===')
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
            // 存储所有分类数据
            this.allCategories = res
            
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
              
              // 生成模拟的子分类数据
              this.generateMockSubCategories()
            }
          } else {
            // 如果后端API有问题，使用固定数据
            this.categoryList = mainCategories
            
            // 生成模拟的子分类数据
            this.generateMockSubCategories()
          }
        })
        .catch(error => {
          console.error('获取职位分类失败:', error)
          // 使用固定数据作为备选方案
          this.categoryList = mainCategories
          
          // 生成模拟的子分类数据
          this.generateMockSubCategories()
        })
    },
    
    // 生成模拟的子分类数据（当后端没有返回时使用）
    generateMockSubCategories() {
      this.allCategories = [
        { id: 100, name: '技术开发', parent_id: null },
        { id: 200, name: '产品与设计', parent_id: null },
        { id: 300, name: '技术管理', parent_id: null },
        { id: 101, name: '前端开发', parent_id: 100 },
        { id: 102, name: '后端开发', parent_id: 100 },
        { id: 103, name: '移动开发', parent_id: 100 },
        { id: 104, name: '测试开发', parent_id: 100 },
        { id: 105, name: '人工智能', parent_id: 100 },
        { id: 106, name: '大数据', parent_id: 100 },
        { id: 107, name: '云计算', parent_id: 100 },
        { id: 108, name: '运维开发', parent_id: 100 }
      ]
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
    },
    
    // 生成模拟职位数据
    getMockJobsData() {
      console.log('调用getMockJobsData方法')
      const mockData = [
        { id: 1, title: '前端开发工程师', company: '科技有限公司', category_id: 101, emp_type: 1, description: '负责公司网站前端开发，使用Vue框架' },
        { id: 2, title: '后端开发工程师', company: '互联网科技', category_id: 102, emp_type: 1, description: '负责Java后端开发，熟悉Spring框架' },
        { id: 3, title: 'UI设计师', company: '设计工作室', category_id: 201, emp_type: 2, description: '负责产品UI设计，熟悉Figma工具' },
        { id: 4, title: '产品经理', company: '创新科技', category_id: 301, emp_type: 1, description: '负责产品规划和需求分析' },
        { id: 5, title: '移动端开发', company: '移动科技', category_id: 103, emp_type: 3, description: '负责React Native移动应用开发' },
        { id: 6, title: '测试工程师', company: '软件测试', category_id: 104, emp_type: 1, description: '负责自动化测试和性能测试' },
        { id: 7, title: '数据分析师', company: '数据分析', category_id: 106, emp_type: 2, description: '负责业务数据分析和可视化' },
        { id: 8, title: '运维工程师', company: '云服务', category_id: 108, emp_type: 1, description: '负责服务器运维和监控' },
        { id: 9, title: 'AI工程师', company: '人工智能', category_id: 105, emp_type: 3, description: '负责机器学习模型开发' },
        { id: 10, title: '云计算工程师', company: '云计算', category_id: 107, emp_type: 1, description: '负责云平台架构设计' }
      ]
      console.log('模拟数据生成成功，长度:', mockData.length)
      console.log('模拟数据:', mockData)
      return mockData
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

/* 子分类标签区域 */
.sub-category-tabs {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.sub-category-tab {
  padding: 15rpx 30rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.sub-category-tab.active {
  background-color: #007aff;
  color: #fff;
}

/* 就业类型筛选区域 */
.emp-type-section {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-around;
}

.emp-type-item {
  padding: 15rpx 30rpx;
  font-size: 28rpx;
  color: #333;
}

.emp-type-item.active {
  color: #007aff;
  border-bottom: 2rpx solid #007aff;
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 15rpx 20rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.search-bar input {
  flex: 1;
  margin-left: 15rpx;
  font-size: 28rpx;
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