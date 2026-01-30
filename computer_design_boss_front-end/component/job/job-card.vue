<template>
  <view class="job-card" @click="goToDetail(job)">
    <view class="card-header">
      <text class="job-title">{{ job.title }}</text>
      <text class="salary">{{ formatSalary(job.salary_min, job.salary_max) }}</text>
    </view>
    
    <view class="company-info">
      <text class="company-name">{{ getCompanyName(data) }}</text>
      <text class="company-tag">{{ data.exp_req || '经验不限' }} | {{ data.edu_req || '学历不限' }}</text>
    </view>
    
    <view class="job-tags">
      <text v-for="tag in getJobTags(data)" :key="tag" class="tag">{{ tag }}</text>
    </view>
    
    <view class="card-footer">
      <text class="location">{{ data.city_name || '城市' }}</text>
      <text class="time">今天</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'JobCard',
  props: {
    job: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    // 格式化薪资
    formatSalary(min, max) {
      if (min && max) {
        return `${(min/1000).toFixed(0)}-${(max/1000).toFixed(0)}K`
      }
      return '薪资面议'
    },
    goToDetail(data) {
	  uni.navigateTo({
		url: `/pages/job/detail/index?id=${data.id}`
	  })
	},
    // 获取公司名称
    getCompanyName(data) {
      // 后端目前没有返回公司名称，需要根据company_id查询，这里暂时返回默认值
      const companyMap = {
        '1': '花旗金融信息服务（中国）有限公司',
        '2': '中国移动通信有限公司在线营销服务中心',
        '3': 'Victoria\'s Secret'
      }
      return companyMap[data.company_id] || '未知公司'
    },
    
    // 获取职位标签
    getJobTags(data) {
      // 后端返回的福利标签可能在welfare_list中
      if (data.welfare_list) {
        return Array.isArray(data.welfare_list) ? data.welfare_list : JSON.parse(data.welfare_list)
      }
      // 默认标签
      return ['五险一金', '弹性工作', '带薪年假']
    }
  }
}
</script>

<style scoped>
.job-card {
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.job-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.salary {
  font-size: 32rpx;
  color: #ff6b35;
  font-weight: bold;
}

.company-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.company-name {
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
}

.company-tag {
  font-size: 24rpx;
  color: #999;
  background-color: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.tag {
  font-size: 24rpx;
  color: #007aff;
  background-color: rgba(0, 122, 255, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.location,
.time {
  font-size: 24rpx;
  color: #999;
}
</style>