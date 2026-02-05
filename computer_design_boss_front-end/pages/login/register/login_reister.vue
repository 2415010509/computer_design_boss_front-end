<template>
  <view class="register-container">
    <!-- 页面标题 -->
    <view class="register-header">
      <text class="register-title">新用户注册</text>
    </view>
    
    <!-- 注册表单 -->
    <view class="register-form">
      <!-- 基本信息 -->
      <view v-if="registerStep === 2" class="register-step">
        <h3 class="step-title">完善个人信息</h3>
        
        <!-- 真实姓名输入框 -->
        <view class="form-item">
          <view class="form-label">真实姓名</view>
          <view class="form-input-wrapper">
            <uni-icons type="person" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入真实姓名"
              v-model="basicInfoForm.real_name"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 性别选择 -->
        <view class="form-item">
          <view class="form-label">性别</view>
          <view class="gender-selector">
            <view 
              class="gender-item" 
              :class="{ active: basicInfoForm.gender === 0 }"
              @click="basicInfoForm.gender = 0"
            >
              <text class="gender-text">未知</text>
            </view>
            <view 
              class="gender-item" 
              :class="{ active: basicInfoForm.gender === 1 }"
              @click="basicInfoForm.gender = 1"
            >
              <text class="gender-text">男</text>
            </view>
            <view 
              class="gender-item" 
              :class="{ active: basicInfoForm.gender === 2 }"
              @click="basicInfoForm.gender = 2"
            >
              <text class="gender-text">女</text>
            </view>
          </view>
        </view>
        
       <!-- 出生日期选择 -->
        <view class="form-item">
          <view class="form-label">出生日期</view>
          <view class="form-input-wrapper">
            <uni-icons type="calendar" size="24" color="#999"></uni-icons>
            <uni-date-picker 
              v-model="basicInfoForm.birth_date" 
              type="date" 
              placeholder="请选择出生日期"
              @confirm="handleDateChange"
              class="form-input"
            ></uni-date-picker>
          </view>
        </view>
        
        <!-- 所在城市选择 -->
        <view class="form-item">
          <view class="form-label">所在城市</view>
          <view class="form-input-wrapper">
            <uni-icons type="location" size="24" color="#999"></uni-icons>
            <uni-data-picker 
              v-model="basicInfoForm.city" 
              :localdata="cityOptions" 
              @confirm="handleCityChange"
              placeholder="请选择所在城市"
              class="form-input"
            ></uni-data-picker>
          </view>
        </view>
        
        <!-- 邮箱输入框 -->
        <view class="form-item">
          <view class="form-label">邮箱（可选）</view>
          <view class="form-input-wrapper">
            <uni-icons type="email" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入邮箱"
              v-model="basicInfoForm.email"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 按钮区域 -->
        <view class="register-buttons">
          <button 
            class="back-btn"
            @click="prevRegisterStep"
          >
            上一步
          </button>
          <button 
            class="register-btn"
            :disabled="!isBasicInfoFormValid"
            @click="nextRegisterStep"
          >
            下一步
          </button>
        </view>
      </view>
      
      <!-- 教育背景 -->
      <view v-if="registerStep === 3" class="register-step">
        <h3 class="step-title">教育经历</h3>
        
        <!-- 学历选择 -->
        <view class="form-item">
          <view class="form-label">学历水平</view>
          <view class="form-input-wrapper">
            <uni-icons type="book" size="24" color="#999"></uni-icons>
            <uni-data-picker 
              v-model="educationForm.degree" 
              :localdata="degreeOptions" 
              @confirm="handleDegreeChange"
              placeholder="请选择学历"
              class="form-input"
            ></uni-data-picker>
          </view>
        </view>
        
        <!-- 学校名称输入框 -->
        <view class="form-item">
          <view class="form-label">学校名称</view>
          <view class="form-input-wrapper">
            <uni-icons type="office" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入学校名称"
              v-model="educationForm.school_name"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 专业输入框 -->
        <view class="form-item">
          <view class="form-label">专业</view>
          <view class="form-input-wrapper">
            <uni-icons type="compose" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入专业"
              v-model="educationForm.major"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 毕业年份选择 -->
        <view class="form-item">
          <view class="form-label">毕业年份</view>
          <view class="form-input-wrapper">
            <uni-icons type="calendar" size="24" color="#999"></uni-icons>
            <input 
              type="number" 
              placeholder="请输入毕业年份"
              v-model="educationForm.graduation_year"
              class="form-input"
              maxlength="4"
            />
          </view>
        </view>
        
        <!-- 按钮区域 -->
        <view class="register-buttons">
          <button 
            class="back-btn"
            @click="prevRegisterStep"
          >
            上一步
          </button>
          <button 
            class="register-btn"
            :disabled="!isEducationFormValid"
            @click="nextRegisterStep"
          >
            下一步
          </button>
        </view>
      </view>
      
      <!-- 求职意向（可选） -->
      <view v-if="registerStep === 4" class="register-step optional">
        <h3 class="step-title">求职意向 <span class="optional-tag">可选</span></h3>
        
        <!-- 期望职位方向 -->
        <view class="form-item">
          <view class="form-label">期望职位方向</view>
          <view class="form-input-wrapper">
            <uni-icons type="briefcase" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入期望职位方向（如：前端/后端/数据等）"
              v-model="jobIntentForm.job_direction"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 期望工作城市 -->
        <view class="form-item">
          <view class="form-label">期望工作城市</view>
          <view class="form-input-wrapper">
            <uni-icons type="location" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入期望工作城市"
              v-model="jobIntentForm.expected_city"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 期望薪资范围 -->
        <view class="form-item">
          <view class="form-label">期望薪资范围（千/月）</view>
          <view class="salary-range">
            <input 
              type="number" 
              placeholder="最低"
              v-model="jobIntentForm.expected_salary_min"
              class="form-input salary-input"
              min="0"
            />
            <span class="salary-separator">~</span>
            <input 
              type="number" 
              placeholder="最高"
              v-model="jobIntentForm.expected_salary_max"
              class="form-input salary-input"
              min="0"
            />
            <span class="salary-unit">千/月</span>
          </view>
        </view>
        
        <!-- 到岗时间 -->
        <view class="form-item">
          <view class="form-label">到岗时间</view>
          <view class="form-input-wrapper">
            <uni-icons type="time" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入到岗时间（如：立即到岗/一个月内等）"
              v-model="jobIntentForm.available_time"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 按钮区域 -->
        <view class="register-buttons">
          <button 
            class="back-btn"
            @click="prevRegisterStep"
          >
            上一步
          </button>
          <button 
            class="skip-btn"
            @click="completeRegister"
          >
            暂时跳过，稍后完善
          </button>
          <button 
            class="register-btn"
            :disabled="!isJobIntentFormValid"
            @click="completeRegister"
          >
            完成注册
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '../../../common/api/user.js'

export default {
  data() {
    return {
      // 从登录页面传递过来的注册数据
      registerForm: {
        mobile: '',
        sms_code: '',
        password: '',
        confirm_password: ''
      },
      
      // 用户基本信息表单
      basicInfoForm: {
        real_name: '',
        gender: 0, // 0: 未知, 1: 男, 2: 女
        birth_date: '',
        city: '',
        email: ''
      },
      
      // 教育背景表单
      educationForm: {
        degree: '', // 学历
        school_name: '', // 学校名称
        major: '', // 专业
        graduation_year: '' // 毕业年份
      },
      // 城市选择器数据
      cityOptions: [
        { value: '北京', text: '北京' },
        { value: '上海', text: '上海' },
        { value: '广州', text: '广州' },
        { value: '深圳', text: '深圳' },
        { value: '杭州', text: '杭州' },
        { value: '成都', text: '成都' },
        { value: '武汉', text: '武汉' },
        { value: '西安', text: '西安' },
        { value: '重庆', text: '重庆' },
        { value: '南京', text: '南京' }
      ],
      // 学历选项
      degreeOptions: [
        { value: 'high_school', text: '高中' },
        { value: 'college', text: '专科' },
        { value: 'bachelor', text: '本科' },
        { value: 'master', text: '硕士' },
        { value: 'doctor', text: '博士' }
      ],
      
      // 求职意向表单（可选）
      jobIntentForm: {
        job_direction: '', // 期望职位方向
        expected_city: '', // 期望工作城市
        expected_salary_min: '', // 期望薪资范围-最低
        expected_salary_max: '', // 期望薪资范围-最高
        available_time: '' // 到岗时间
      },
      
      // 注册步骤
      registerStep: 2, // 2: 基本信息, 3: 教育背景, 4: 求职意向（可选）
      
      loading: false
    }
  },
  computed: {
    // 基本信息表单验证
    isBasicInfoFormValid() {
      const { real_name, birth_date, city, email } = this.basicInfoForm
      // 邮箱验证（可选，但格式要正确）
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      
      // 必填项验证
      const realNameValid = real_name.trim().length > 0
      const birthDateValid = birth_date.trim().length > 0
      const cityValid = city.trim().length > 0
      
      // 邮箱如果填写则必须格式正确
      const emailValid = email.trim() === '' || emailRegex.test(email)
      
      return realNameValid && birthDateValid && cityValid && emailValid
    },
    
    // 教育背景表单验证
    isEducationFormValid() {
      const { degree, school_name, major, graduation_year } = this.educationForm
      
      // 必填项验证
      const degreeValid = degree.trim().length > 0
      const schoolNameValid = school_name.trim().length > 0
      const majorValid = major.trim().length > 0
      const graduationYearValid = graduation_year.trim().length === 4 && !isNaN(graduation_year)
      
      return degreeValid && schoolNameValid && majorValid && graduationYearValid
    },
    
    // 求职意向表单验证（可选）
    isJobIntentFormValid() {
      // 求职意向为可选步骤，所有字段都是可选的
      // 但如果填写了薪资范围，需要确保格式正确
      const { expected_salary_min, expected_salary_max } = this.jobIntentForm
      
      if (expected_salary_min && isNaN(expected_salary_min)) {
        return false
      }
      
      if (expected_salary_max && isNaN(expected_salary_max)) {
        return false
      }
      
      return true
    }
  },
  onLoad(options) {
    // 接收从登录页面传递过来的注册数据
    if (options.registerData) {
      this.registerForm = JSON.parse(decodeURIComponent(options.registerData))
    }
  },
  methods: {
    // 处理学历选择变化
    handleDegreeChange(e) {
      // uni-data-picker直接返回选中的值
      this.educationForm.degree = e.detail.value
    },
    // 处理日期选择变化
    handleDateChange(e) {
      this.basicInfoForm.birth_date = e.detail.value
    },

    // 处理城市选择变化
    handleCityChange(e) {
      this.basicInfoForm.city = e.detail.value
    },
    // 注册步骤：进入下一步
    nextRegisterStep() {
      // 根据当前步骤和表单验证结果，进入下一步
      if (this.registerStep === 2 && this.isBasicInfoFormValid) {
        this.registerStep = 3
      } else if (this.registerStep === 3 && this.isEducationFormValid) {
        this.registerStep = 4
      }
    },
    
    // 注册步骤：返回上一步
    prevRegisterStep() {
      // 返回上一步，不验证表单
      if (this.registerStep > 2) {
        this.registerStep--
      } else {
        // 返回登录页面的注册表单
        uni.navigateBack()
      }
    },
    
    // 完成注册
    async completeRegister() {
      this.loading = true
      
      try {
        // 准备完整的注册数据
        const registerData = {
          mobile: this.registerForm.mobile,
          sms_code: this.registerForm.sms_code,
          password: this.registerForm.password,
          ...this.basicInfoForm,
          ...this.educationForm,
          ...this.jobIntentForm
        }
        
        // 模拟注册流程：
        // 1. 验证手机号和验证码
        // 2. 创建 sys_user 记录
        // 3. 创建空 resume 记录
        // 4. 返回 Token
        
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 模拟成功响应
        const mockResponse = {
          code: 200,
          message: '注册成功',
          data: {
            token: 'mock-jwt-token-987654321',
            user_info: {
              user_id: '987654321',
              mobile: this.registerForm.mobile,
              email: this.basicInfoForm.email,
              real_name: this.basicInfoForm.real_name,
              gender: this.basicInfoForm.gender,
              birth_date: this.basicInfoForm.birth_date,
              city: this.basicInfoForm.city,
              avatar_url: '',
              status: 1,
              job_status: 1,
              register_time: new Date().toISOString()
            },
            // 模拟创建的简历记录
            resume_info: {
              resume_id: 'resume-001',
              user_id: '987654321',
              status: this.registerStep === 4 ? 1 : 0, // 如果完成了所有步骤，状态为已完善
              create_time: new Date().toISOString(),
              // 教育背景信息
              education: {
                degree: this.educationForm.degree,
                school_name: this.educationForm.school_name,
                major: this.educationForm.major,
                graduation_year: this.educationForm.graduation_year
              },
              // 求职意向信息（如果填写）
              job_intent: this.registerStep === 4 ? {
                job_direction: this.jobIntentForm.job_direction,
                expected_city: this.jobIntentForm.expected_city,
                expected_salary_min: this.jobIntentForm.expected_salary_min,
                expected_salary_max: this.jobIntentForm.expected_salary_max,
                available_time: this.jobIntentForm.available_time
              } : null
            }
          }
        }
        
        // 处理注册成功
        if (mockResponse.code === 200) {
          // 保存登录状态
          uni.setStorageSync('token', mockResponse.data.token)
          uni.setStorageSync('userInfo', mockResponse.data.user_info)
          uni.setStorageSync('resumeInfo', mockResponse.data.resume_info)
          
          // 显示成功提示
          uni.showToast({
            title: mockResponse.message,
            icon: 'success'
          })
          
          // 跳转到首页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index_index'
            })
          }, 1500)
        } else {
          // 注册失败
          uni.showToast({
            title: mockResponse.message || '注册失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('注册失败:', error)
        uni.showToast({
          title: '注册失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40rpx;
}

.register-header {
  margin: 80rpx 0 60rpx 0;
  text-align: center;
}

.register-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.register-form {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.form-input-wrapper {
  display: flex;
  align-items: center;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  background-color: #fafafa;
}

.form-input {
  flex: 1;
  height: 88rpx;
  font-size: 32rpx;
  color: #333;
  padding-left: 16rpx;
}

.form-input:focus {
  outline: none;
}

.error-text {
  font-size: 24rpx;
  color: #e54d42;
  margin-top: 12rpx;
  display: block;
}

.register-btn {
  width: 100%;
  height: 96rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
  margin: 40rpx 0;
}

.register-btn:disabled {
  background-color: #ccc;
}

/* 步骤标题 */
.step-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 40rpx;
  text-align: center;
}

/* 注册步骤 */
.register-step {
  display: block;
  animation: fadeIn 0.3s ease-in-out;
}

/* 可选步骤标记 */
.optional-tag {
  font-size: 24rpx;
  color: #007aff;
  font-weight: normal;
  margin-left: 10rpx;
}

/* 跳过按钮 */
.skip-btn {
  flex: 1;
  height: 96rpx;
  background-color: #f5f5f5;
  color: #333;
  font-size: 32rpx;
  border-radius: 48rpx;
  border: 2rpx solid #e5e5e5;
  margin: 40rpx 10rpx;
}

/* Picker组件样式 */
.picker-input {
  flex: 1;
  padding-right: 40rpx;
  background-color: transparent;
  border: none;
}

.picker-arrow {
  position: absolute;
  right: 20rpx;
}

/* 薪资范围 */
.salary-range {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 20rpx;
  background-color: #fafafa;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
}

.salary-input {
  flex: 1;
  height: 88rpx;
  font-size: 32rpx;
  color: #333;
}

.salary-separator {
  font-size: 32rpx;
  color: #999;
}

.salary-unit {
  font-size: 28rpx;
  color: #999;
}

/* 性别选择器 */
.gender-selector {
  display: flex;
  gap: 20rpx;
}

.gender-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background-color: #fafafa;
}

.gender-item.active {
  border-color: #007aff;
  background-color: #e6f2ff;
}

.gender-text {
  font-size: 32rpx;
  color: #333;
}

.gender-item.active .gender-text {
  color: #007aff;
  font-weight: bold;
}

/* 注册按钮区域 */
.register-buttons {
  display: flex;
  gap: 20rpx;
  margin: 40rpx 0;
}

.back-btn {
  flex: 1;
  height: 96rpx;
  background-color: #f5f5f5;
  color: #333;
  font-size: 32rpx;
  border-radius: 48rpx;
  border: 2rpx solid #e5e5e5;
}

.register-btn {
  flex: 1;
  height: 96rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
}

.register-btn:disabled {
  background-color: #ccc;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>