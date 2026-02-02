"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_job = require("../../../common/api/job.js");
var common_api_forum = require("../../../common/api/forum.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      jobId: "",
      jobDetail: {},
      commentList: [],
      commentCount: 0,
      newComment: "",
      newReply: "",
      showReply: false,
      replyToCommentId: ""
    };
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id;
      this.getJobDetail();
      this.getComments();
    }
  },
  methods: {
    async getJobDetail() {
      try {
        const res = await common_api_job.jobApi.getJobDetail(this.jobId);
        console.log("\u804C\u4F4D\u8BE6\u60C5\u8FD4\u56DE\u6570\u636E:", res);
        if (res && Array.isArray(res) && res.length > 0) {
          this.jobDetail = res[0];
        } else if (res && typeof res === "object" && Object.keys(res).length > 0) {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            this.jobDetail = res.data[0];
          } else {
            this.jobDetail = res;
          }
        } else {
          this.jobDetail = {};
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u804C\u4F4D\u8BE6\u60C5\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25",
          icon: "none"
        });
        this.jobDetail = {};
      }
    },
    async getComments() {
      var _a;
      try {
        const categoryId = ((_a = this.jobDetail) == null ? void 0 : _a.category_id) || "1001";
        console.log("\u83B7\u53D6\u8BC4\u8BBA\uFF0C\u5206\u7C7BID:", categoryId);
        const comments = await common_api_forum.forumApi.getCommentsByCategory(categoryId);
        console.log("\u8BC4\u8BBA\u6570\u636E\u8FD4\u56DE:", comments);
        const countRes = await common_api_forum.forumApi.countComments({
          switch: "category",
          category_id: categoryId
        });
        console.log("\u8BC4\u8BBA\u6570\u91CF\u8FD4\u56DE:", countRes);
        let processedComments = [];
        let processedCount = 0;
        if (Array.isArray(comments)) {
          processedComments = comments;
        } else if (comments && typeof comments === "object") {
          if (comments.data && Array.isArray(comments.data)) {
            processedComments = comments.data;
          } else if (comments.list && Array.isArray(comments.list)) {
            processedComments = comments.list;
          } else {
            processedComments = [];
          }
        }
        if (countRes && typeof countRes === "object" && "forum_count_num" in countRes) {
          processedCount = countRes.forum_count_num;
        } else if (typeof countRes === "number") {
          processedCount = countRes;
        } else {
          processedCount = 0;
        }
        for (const comment of processedComments) {
          try {
            const replies = await common_api_forum.forumApi.getCommentReplies(comment.id);
            if (Array.isArray(replies)) {
              comment.replies = replies;
            } else if (replies && typeof replies === "object") {
              if (replies.data && Array.isArray(replies.data)) {
                comment.replies = replies.data;
              } else if (replies.list && Array.isArray(replies.list)) {
                comment.replies = replies.list;
              } else {
                comment.replies = [];
              }
            } else {
              comment.replies = [];
            }
          } catch (replyError) {
            console.error("\u83B7\u53D6\u56DE\u590D\u5931\u8D25:", replyError);
            comment.replies = [];
          }
        }
        this.commentList = processedComments;
        this.commentCount = processedCount;
      } catch (error) {
        console.error("\u83B7\u53D6\u8BC4\u8BBA\u5931\u8D25:", error);
        this.commentList = [];
        this.commentCount = 0;
      }
    },
    async submitComment() {
      var _a;
      if (!this.newComment.trim())
        return;
      try {
        const categoryId = ((_a = this.jobDetail) == null ? void 0 : _a.category_id) || "1001";
        const userId = "1";
        const result = await common_api_forum.forumApi.addComment({
          category_id: categoryId,
          user_id: userId,
          parent_id: "",
          content: this.newComment,
          level: "1",
          sort_order: "0"
        });
        console.log("\u63D0\u4EA4\u8BC4\u8BBA\u7ED3\u679C:", result);
        if (Array.isArray(result) && result.length > 0 && result[0].code === 200 || result && typeof result === "object" && result.code === 200) {
          common_vendor.index.showToast({
            title: "\u8BC4\u8BBA\u6210\u529F",
            icon: "success"
          });
          this.newComment = "";
          this.getComments();
        } else {
          common_vendor.index.showToast({
            title: "\u8BC4\u8BBA\u5931\u8D25",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("\u8BC4\u8BBA\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u8BC4\u8BBA\u5931\u8D25",
          icon: "none"
        });
      }
    },
    showReplyInput(comment) {
      this.showReply = true;
      this.replyToCommentId = (comment == null ? void 0 : comment.id) || "";
      this.newReply = "";
    },
    cancelReply() {
      this.showReply = false;
      this.replyToCommentId = "";
      this.newReply = "";
    },
    async submitReply(comment) {
      var _a;
      if (!this.newReply.trim() || !(comment == null ? void 0 : comment.id))
        return;
      try {
        const userId = "1";
        const categoryId = (comment == null ? void 0 : comment.category_id) || ((_a = this.jobDetail) == null ? void 0 : _a.category_id) || "1001";
        const result = await common_api_forum.forumApi.addComment({
          category_id: categoryId,
          user_id: userId,
          parent_id: comment.id,
          content: this.newReply,
          level: "2",
          sort_order: "0"
        });
        console.log("\u63D0\u4EA4\u56DE\u590D\u7ED3\u679C:", result);
        if (Array.isArray(result) && result.length > 0 && result[0].code === 200 || result && typeof result === "object" && result.code === 200) {
          common_vendor.index.showToast({
            title: "\u56DE\u590D\u6210\u529F",
            icon: "success"
          });
          this.newReply = "";
          this.cancelReply();
          this.getComments();
        } else {
          common_vendor.index.showToast({
            title: "\u56DE\u590D\u5931\u8D25",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("\u56DE\u590D\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u56DE\u590D\u5931\u8D25",
          icon: "none"
        });
      }
    },
    getEmpTypeText(type) {
      const typeMap = {
        "1": "\u5168\u804C",
        "2": "\u517C\u804C",
        "3": "\u5B9E\u4E60"
      };
      return typeMap[type] || "\u5168\u804C";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f;
  return common_vendor.e({
    a: common_vendor.t(((_a = $data.jobDetail) == null ? void 0 : _a.title) || "\u6682\u65E0\u804C\u4F4D\u4FE1\u606F"),
    b: common_vendor.t(((_b = $data.jobDetail) == null ? void 0 : _b.salary_min) ? `${($data.jobDetail.salary_min / 1e3).toFixed(0)}k-${((_c = $data.jobDetail) == null ? void 0 : _c.salary_max) ? ($data.jobDetail.salary_max / 1e3).toFixed(0) : "?"}k` : "\u85AA\u8D44\u9762\u8BAE"),
    c: common_vendor.t(((_d = $data.jobDetail) == null ? void 0 : _d.edu_req) || "\u5B66\u5386\u4E0D\u9650"),
    d: common_vendor.t(((_e = $data.jobDetail) == null ? void 0 : _e.exp_req) || "\u7ECF\u9A8C\u4E0D\u9650"),
    e: common_vendor.t(((_f = $data.jobDetail) == null ? void 0 : _f.emp_type) ? $options.getEmpTypeText($data.jobDetail.emp_type) : "\u5168\u804C"),
    f: common_vendor.t($data.jobDetail.description || "\u6682\u65E0\u63CF\u8FF0"),
    g: common_vendor.t($data.jobDetail.requirements || "\u6682\u65E0\u8981\u6C42"),
    h: common_vendor.t($data.commentCount),
    i: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    j: $data.newComment,
    k: common_vendor.o(($event) => $data.newComment = $event.detail.value),
    l: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    m: common_vendor.f($data.commentList, (comment, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(comment.content),
        b: common_vendor.o(($event) => $options.showReplyInput(comment)),
        c: comment.replies && comment.replies.length > 0
      }, comment.replies && comment.replies.length > 0 ? {
        d: common_vendor.f(comment.replies, (reply, k1, i1) => {
          return {
            a: common_vendor.t(reply.content),
            b: reply.id
          };
        })
      } : {}, {
        e: $data.showReply && $data.replyToCommentId === comment.id
      }, $data.showReply && $data.replyToCommentId === comment.id ? {
        f: common_vendor.o(($event) => $options.submitReply(comment)),
        g: $data.newReply,
        h: common_vendor.o(($event) => $data.newReply = $event.detail.value),
        i: common_vendor.o(($event) => $options.submitReply(comment)),
        j: common_vendor.o((...args) => $options.cancelReply && $options.cancelReply(...args))
      } : {}, {
        k: comment.id
      });
    }),
    n: $data.commentList.length === 0
  }, $data.commentList.length === 0 ? {} : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/job/detail/job_detail_index.vue"]]);
wx.createPage(MiniProgramPage);
