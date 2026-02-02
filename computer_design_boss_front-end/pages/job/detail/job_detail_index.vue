<template>
  <view class="job-detail-page">
    <!-- 职位基本信息 -->
    <view class="job-header">
      <text class="job-title">{{ jobDetail?.title || '暂无职位信息' }}</text>
      <text class="job-salary">{{ jobDetail?.salary_min ? `${(jobDetail.salary_min/1000).toFixed(0)}k-${jobDetail?.salary_max ? (jobDetail.salary_max/1000).toFixed(0) : '?' }k` : '薪资面议' }}</text>
      
      <view class="job-requirements">
        <text class="req-item">{{ jobDetail?.edu_req || '学历不限' }}</text>
        <text class="req-item">{{ jobDetail?.exp_req || '经验不限' }}</text>
        <text class="req-item">{{ jobDetail?.emp_type ? getEmpTypeText(jobDetail.emp_type) : '全职' }}</text>
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
    
    <!-- 论坛评论 -->
    <view class="job-section">
      <view class="section-title">论坛评论 <text class="comment-count">({{ commentCount }})</text></view>
      
      <!-- 发表评论 -->
      <view class="comment-input-section">
        <input type="text" placeholder="发表你的评论..." v-model="newComment" @confirm="submitComment" />
        <text class="send-btn" @click="submitComment">发送</text>
      </view>
      
      <!-- 评论列表 -->
      <view class="comment-list">
        <view class="comment-item" v-for="comment in commentList" :key="comment.id">
          <view class="comment-content">{{ comment.content }}</view>
          <view class="comment-footer">
            <text class="comment-time">今天</text>
            <text class="reply-btn" @click="showReplyInput(comment)">回复</text>
          </view>
          
          <!-- 回复列表 -->
          <view class="reply-list" v-if="comment.replies && comment.replies.length > 0">
            <view class="reply-item" v-for="reply in comment.replies" :key="reply.id">
              <view class="reply-content">{{ reply.content }}</view>
              <view class="reply-footer">
                <text class="reply-time">今天</text>
              </view>
            </view>
          </view>
          
          <!-- 回复输入框 -->
          <view class="reply-input-section" v-if="showReply && replyToCommentId === comment.id">
            <input type="text" placeholder="回复这条评论..." v-model="newReply" @confirm="submitReply(comment)" />
            <text class="send-btn" @click="submitReply(comment)">发送</text>
            <text class="cancel-btn" @click="cancelReply">取消</text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-comments" v-if="commentList.length === 0">
        <text>暂无评论，快来发表第一条评论吧</text>
      </view>
    </view>
  </view>
</template>

<script>
import { jobApi } from '@/common/api/job.js'
import { forumApi } from '@/common/api/forum.js'

export default {
  data() {
    return {
      jobId: '',
      jobDetail: {},
      commentList: [],
      commentCount: 0,
      newComment: '',
      newReply: '',
      showReply: false,
      replyToCommentId: ''
    }
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id
      this.getJobDetail()
      this.getComments()
    }
  },
  methods: {
    async getJobDetail() {
      try {
        const res = await jobApi.getJobDetail(this.jobId)
        console.log('职位详情返回数据:', res)
        
        if (res && Array.isArray(res) && res.length > 0) {
          this.jobDetail = res[0]
        } else if (res && typeof res === 'object' && Object.keys(res).length > 0) {
          // 处理不同的响应格式
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            this.jobDetail = res.data[0]
          } else {
            this.jobDetail = res
          }
        } else {
          this.jobDetail = {}
        }
      } catch (error) {
        console.error('获取职位详情失败:', error)
        uni.showToast({
          title: '获取详情失败',
          icon: 'none'
        })
        this.jobDetail = {}
      }
    },
    
    async getComments() {
      try {
        // 从职位详情中获取分类ID
        const categoryId = this.jobDetail?.category_id || '1001'
        console.log('获取评论，分类ID:', categoryId)
        
        const comments = await forumApi.getCommentsByCategory(categoryId)
        console.log('评论数据返回:', comments)
        
        // 获取评论数量
        const countRes = await forumApi.countComments({ 
          switch: 'category', 
          category_id: categoryId 
        })
        console.log('评论数量返回:', countRes)
        
        // 根据可能的响应格式处理数据
        let processedComments = []
        let processedCount = 0
        
        // 处理评论数据
        if (Array.isArray(comments)) {
          processedComments = comments
        } else if (comments && typeof comments === 'object') {
          if (comments.data && Array.isArray(comments.data)) {
            processedComments = comments.data
          } else if (comments.list && Array.isArray(comments.list)) {
            processedComments = comments.list
          } else {
            processedComments = []
          }
        }
        
        // 处理评论数量
        if (countRes && typeof countRes === 'object' && 'forum_count_num' in countRes) {
          processedCount = countRes.forum_count_num
        } else if (typeof countRes === 'number') {
          processedCount = countRes
        } else {
          processedCount = 0
        }
        
        // 为每个评论获取回复
        for (const comment of processedComments) {
          try {
            const replies = await forumApi.getCommentReplies(comment.id)
            if (Array.isArray(replies)) {
              comment.replies = replies
            } else if (replies && typeof replies === 'object') {
              if (replies.data && Array.isArray(replies.data)) {
                comment.replies = replies.data
              } else if (replies.list && Array.isArray(replies.list)) {
                comment.replies = replies.list
              } else {
                comment.replies = []
              }
            } else {
              comment.replies = []
            }
          } catch (replyError) {
            console.error('获取回复失败:', replyError)
            comment.replies = []
          }
        }
        
        this.commentList = processedComments
        this.commentCount = processedCount
      } catch (error) {
        console.error('获取评论失败:', error)
        this.commentList = []
        this.commentCount = 0
      }
    },
    
    async submitComment() {
      if (!this.newComment.trim()) return
      
      try {
        // 获取分类ID和用户ID
        const categoryId = this.jobDetail?.category_id || '1001'
        // 注意：实际项目中应从登录状态获取用户ID
        const userId = '1' 
        
        const result = await forumApi.addComment({
          category_id: categoryId,
          user_id: userId,
          parent_id: '',
          content: this.newComment,
          level: '1',
          sort_order: '0'
        })
        
        console.log('提交评论结果:', result)
        
        // 检查是否成功
        if ((Array.isArray(result) && result.length > 0 && result[0].code === 200) ||
            (result && typeof result === 'object' && result.code === 200)) {
          uni.showToast({
            title: '评论成功',
            icon: 'success'
          })
          
          this.newComment = ''
          // 刷新评论列表
          this.getComments()
        } else {
          uni.showToast({
            title: '评论失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('评论失败:', error)
        uni.showToast({
          title: '评论失败',
          icon: 'none'
        })
      }
    },
    
    showReplyInput(comment) {
      this.showReply = true
      this.replyToCommentId = comment?.id || ''
      this.newReply = ''
    },
    
    cancelReply() {
      this.showReply = false
      this.replyToCommentId = ''
      this.newReply = ''
    },
    
    async submitReply(comment) {
      if (!this.newReply.trim() || !comment?.id) return
      
      try {
        // 注意：实际项目中应从登录状态获取用户ID
        const userId = '1'
        const categoryId = comment?.category_id || this.jobDetail?.category_id || '1001'
        
        const result = await forumApi.addComment({
          category_id: categoryId,
          user_id: userId,
          parent_id: comment.id,
          content: this.newReply,
          level: '2',
          sort_order: '0'
        })
        
        console.log('提交回复结果:', result)
        
        if ((Array.isArray(result) && result.length > 0 && result[0].code === 200) ||
            (result && typeof result === 'object' && result.code === 200)) {
          uni.showToast({
            title: '回复成功',
            icon: 'success'
          })
          
          this.newReply = ''
          this.cancelReply()
          // 刷新评论列表
          this.getComments()
        } else {
          uni.showToast({
            title: '回复失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('回复失败:', error)
        uni.showToast({
          title: '回复失败',
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

.comment-count {
  font-size: 24rpx;
  font-weight: normal;
  color: #999;
  margin-left: 10rpx;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 45rpx;
}

/* 评论输入区域 */
.comment-input-section {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.comment-input-section input {
  flex: 1;
  padding: 15rpx 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 30rpx;
  font-size: 26rpx;
  background-color: #f9f9f9;
}

.send-btn {
  margin-left: 20rpx;
  padding: 15rpx 30rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 30rpx;
  font-size: 26rpx;
}

/* 评论列表 */
.comment-list {
  margin-bottom: 20rpx;
}

.comment-item {
  margin-bottom: 30rpx;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
}

.comment-content {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-time {
  font-size: 22rpx;
  color: #999;
}

.reply-btn {
  font-size: 24rpx;
  color: #007aff;
}

/* 回复列表 */
.reply-list {
  margin-top: 20rpx;
  padding-left: 30rpx;
  border-left: 2rpx solid #ddd;
}

.reply-item {
  margin-bottom: 15rpx;
  padding: 15rpx;
  background-color: #fff;
  border-radius: 8rpx;
}

.reply-content {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.reply-footer {
  display: flex;
  justify-content: flex-end;
}

.reply-time {
  font-size: 20rpx;
  color: #999;
}

/* 回复输入框 */
.reply-input-section {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx dashed #ddd;
}

.reply-input-section input {
  flex: 1;
  padding: 12rpx 15rpx;
  border: 1rpx solid #ddd;
  border-radius: 25rpx;
  font-size: 24rpx;
  background-color: #fff;
}

.reply-input-section .send-btn {
  margin-left: 15rpx;
  padding: 12rpx 25rpx;
  font-size: 24rpx;
}

.cancel-btn {
  margin-left: 15rpx;
  padding: 12rpx 25rpx;
  color: #999;
  font-size: 24rpx;
}

/* 空状态 */
.empty-comments {
  text-align: center;
  padding: 50rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>