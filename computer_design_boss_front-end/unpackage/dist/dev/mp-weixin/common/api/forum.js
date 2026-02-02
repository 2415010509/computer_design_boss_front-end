"use strict";
var common_api_request = require("./request.js");
const forumApi = {
  getAllComments: () => {
    return common_api_request.request({
      url: "/forum/all_forum_data",
      method: "GET"
    });
  },
  getCommentsByCategory: (categoryId) => {
    return common_api_request.request({
      url: "/forum/forum_one_category",
      method: "POST",
      data: { category_id: categoryId }
    });
  },
  getAllFirstComments: () => {
    return common_api_request.request({
      url: "/forum/forum_all_first_talk",
      method: "GET"
    });
  },
  getCommentReplies: (parentId) => {
    return common_api_request.request({
      url: "/forum/forums_back",
      method: "POST",
      data: { parent_id: parentId }
    });
  },
  addComment: (commentData) => {
    return common_api_request.request({
      url: "/forum/forums_add",
      method: "POST",
      data: commentData
    });
  },
  deleteComment: (commentId) => {
    return common_api_request.request({
      url: "/forum/forum_delete",
      method: "POST",
      data: { id: commentId }
    });
  },
  countComments: (params) => {
    return common_api_request.request({
      url: "/forum/forum_count",
      method: "POST",
      data: params
    });
  }
};
exports.forumApi = forumApi;
