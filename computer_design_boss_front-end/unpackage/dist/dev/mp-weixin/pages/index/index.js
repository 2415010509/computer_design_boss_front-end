"use strict";
var common_vendor = require("../../common/vendor.js");
var common_api_job = require("../../common/api/job.js");
require("../../common/api/request.js");
require("../../common/config.js");
const jobCard = () => "../../component/job/job-card.js";
const _sfc_main = {
  components: {
    jobCard
  },
  data() {
    return {
      bannerList: [
        { id: 1, imageUrl: "/static/banner1.png" },
        { id: 2, imageUrl: "/static/banner2.png" },
        { id: 3, imageUrl: "/static/banner3.png" }
      ],
      categoryList: [
        { id: "1001", name: "\u6280\u672F", icon: "/static/category/tech.png" },
        { id: "1002", name: "\u4EA7\u54C1", icon: "/static/category/product.png" },
        { id: "1003", name: "\u8BBE\u8BA1", icon: "/static/category/design.png" },
        { id: "1004", name: "\u8FD0\u8425", icon: "/static/category/operate.png" },
        { id: "1005", name: "\u5E02\u573A", icon: "/static/category/market.png" }
      ],
      jobList: [],
      hasMore: true,
      currentPage: 1,
      pageSize: 10,
      currentCategory: "",
      currentEmpType: ""
    };
  },
  onLoad() {
    this.getRecommendJobs();
  },
  onPullDownRefresh() {
    this.onRefresh();
  },
  methods: {
    async getRecommendJobs() {
      try {
        const res = await common_api_job.jobApi.getAllJobs();
        this.jobList = res;
        console.log("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u6210\u529F:", res);
      } catch (error) {
        console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25",
          icon: "none"
        });
      }
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/job/list/index"
      });
    },
    goToCategory(categoryId) {
      this.currentCategory = categoryId;
      this.getJobsByCategory();
    },
    async getJobsByCategory() {
      try {
        const res = await common_api_job.jobApi.getJobsByCategory(this.currentCategory);
        this.jobList = res;
      } catch (error) {
        console.error("\u83B7\u53D6\u5206\u7C7B\u804C\u4F4D\u5931\u8D25:", error);
      }
    },
    scrollToJobList() {
      common_vendor.index.pageScrollTo({
        selector: ".job-list",
        duration: 300
      });
    },
    loadMore() {
      this.currentPage++;
    },
    onRefresh() {
      this.currentPage = 1;
      this.getRecommendJobs();
      common_vendor.index.stopPullDownRefresh();
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_job_card = common_vendor.resolveComponent("job-card");
  (_component_uni_icons + _component_job_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "search",
      size: "30",
      color: "#999"
    }),
    b: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    c: common_vendor.f($data.bannerList, (banner, index, i0) => {
      return {
        a: banner.imageUrl,
        b: index
      };
    }),
    d: common_vendor.f($data.categoryList, (category, k0, i0) => {
      return {
        a: category.icon,
        b: common_vendor.t(category.name),
        c: category.id,
        d: common_vendor.o(($event) => $options.goToCategory(category.id), category.id)
      };
    }),
    e: common_vendor.o((...args) => $options.scrollToJobList && $options.scrollToJobList(...args)),
    f: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: job.id,
        b: "e0ae1b64-1-" + i0,
        c: common_vendor.p({
          job
        })
      };
    }),
    g: $data.hasMore
  }, $data.hasMore ? {
    h: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss/computer_design_boss/computer_design_boss_front-end/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
