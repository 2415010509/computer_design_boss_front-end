<template>
  <view class="job-detail-page">
    <!-- 职位基本信息 -->
    <view class="job-header">
      <text class="job-title">{{ jobDetail.title }}</text>
      <text class="job-salary">{{ jobDetail.salary_min }}k-{{ jobDetail.salary_max }}k</text>
      
      <view class="job-requirements">
        <text class="req-item">{{ jobDetail.edu_req }}</text>
        <text class="req-item">{{ jobDetail.exp_req }}</text>
        <text class="req-item">{{ getEmpTypeText(jobDetail.emp_type) }}</text>
      </view>
    </view>
    
    <!-- 职位描述 -->
    <view class="job-section">
      <view class="section-title">职位描述</view>
      <view class="section-content">
        <text>{{ jobDetail.description || '暂无描述' }}</text>
      </view>
    </view>
    
    <!-- 任职要求 -->
    <view class="job-section">
      <view class="section-title">任职要求</view>
      <view class="section-content">
        <text>{{ jobDetail.requirements || '暂无要求' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { jobApi } from '@/common/api/job.js'

export default {
  data() {
    return {
      jobId: '',
      jobDetail: {}
    }
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id
      this.getJobDetail()
    }
  },
  methods: {
    async getJobDetail() {
      try {
        const res = await jobApi.getJobDetail(this.jobId)
        if (res && res.length > 0) {
          this.jobDetail = res[0]
        }
      } catch (error) {
        console.error('获取职位详情失败:', error)
        uni.showToast({
          title: '获取详情失败',
          icon: 'none'
        })
      }
    },
    getEmpTypeText(type) {
      const typeMap = {
        '1': '全职',
        '2': '兼职',
        '3': '实习'
      }
      return typeMap[type] || '全职'
    }
  }
}
</script>

<style>
.job-detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.job-header {
  background-color: #fff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.job-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.job-salary {
  font-size: 32rpx;
  color: #ff6b35;
  display: block;
  margin-bottom: 20rpx;
}

.job-requirements {
  display: flex;
  gap: 30rpx;
}

.req-item {
  font-size: 28rpx;
  color: #666;
}

.job-section {
  background-color: #fff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 45rpx;
}
</style>