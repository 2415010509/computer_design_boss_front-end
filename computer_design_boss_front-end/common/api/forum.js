import request from './request.js'

// 论坛相关API
export const forumApi = {
  // 获取所有评论
  getAllComments: () => {
    return request({
      url: '/forum/all_forum_data',
      method: 'GET'
    })
  },
  
  // 根据职位分类获取评论
  getCommentsByCategory: (categoryId) => {
    return request({
      url: '/forum/forum_one_category',
      method: 'POST',
      data: { category_id: categoryId }
    })
  },
  
  // 获取所有一级评论
  getAllFirstComments: () => {
    return request({
      url: '/forum/forum_all_first_talk',
      method: 'GET'
    })
  },
  
  // 获取评论的回复
  getCommentReplies: (parentId) => {
    return request({
      url: '/forum/forums_back',
      method: 'POST',
      data: { parent_id: parentId }
    })
  },
  
  // 发表评论
  addComment: (commentData) => {
    return request({
      url: '/forum/forums_add',
      method: 'POST',
      data: commentData
    })
  },
  
  // 删除评论
  deleteComment: (commentId) => {
    return request({
      url: '/forum/forum_delete',
      method: 'POST',
      data: { id: commentId }
    })
  },
  
  // 统计评论数量
  countComments: (params) => {
    return request({
      url: '/forum/forum_count',
      method: 'POST',
      data: params
    })
  }
}