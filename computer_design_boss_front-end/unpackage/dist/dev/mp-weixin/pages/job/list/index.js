"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_job = require("../../../common/api/job.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const jobCard = () => "../../../component/job/job-card.js";
const _sfc_main = {
  components: {
    jobCard
  },
  data() {
    return {
      keyword: "",
      filterTabs: [
        { id: "all", name: "\u5168\u90E8" },
        { id: "tech", name: "\u6280\u672F" },
        { id: "product", name: "\u4EA7\u54C1" },
        { id: "design", name: "\u8BBE\u8BA1" }
      ],
      categoryList: [
        { id: "1001", name: "\u6280\u672F" },
        { id: "1002", name: "\u4EA7\u54C1" },
        { id: "1003", name: "\u8BBE\u8BA1" },
        { id: "1004", name: "\u8FD0\u8425" },
        { id: "1005", name: "\u5E02\u573A" }
      ],
      currentTab: "all",
      currentCategory: "",
      showCategoryTabs: false,
      jobList: []
    };
  },
  onLoad() {
    this.getJobList();
  },
  methods: {
    async getJobList() {
      try {
        let res;
        if (this.currentCategory) {
          res = await common_api_job.jobApi.getJobsByCategory(this.currentCategory);
        } else {
          res = await common_api_job.jobApi.getAllJobs();
        }
        this.jobList = res;
      } catch (error) {
        console.error("\u83B7\u53D6\u804C\u4F4D\u5217\u8868\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25",
          icon: "none"
        });
      }
    },
    onSearchInput() {
      if (this.keyword) {
        this.searchJobs();
      }
    },
    async searchJobs() {
      try {
        const res = await common_api_job.jobApi.searchJobs(this.keyword);
        this.jobList = res;
      } catch (error) {
        console.error("\u641C\u7D22\u804C\u4F4D\u5931\u8D25:", error);
      }
    },
    onCancelSearch() {
      this.keyword = "";
      this.getJobList();
      common_vendor.index.navigateBack();
    },
    switchTab(tabId) {
      this.currentTab = tabId;
      this.showCategoryTabs = tabId === "all";
      this.getJobList();
    },
    switchCategory(categoryId) {
      this.currentCategory = categoryId;
      this.getJobList();
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
    b: common_vendor.o([($event) => $data.keyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    c: $data.keyword,
    d: common_vendor.o((...args) => $options.onCancelSearch && $options.onCancelSearch(...args)),
    e: common_vendor.f($data.filterTabs, (tab, k0, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: tab.id,
        c: common_vendor.o(($event) => $options.switchTab(tab.id), tab.id),
        d: $data.currentTab === tab.id ? 1 : ""
      };
    }),
    f: $data.showCategoryTabs
  }, $data.showCategoryTabs ? {
    g: common_vendor.f($data.categoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.o(($event) => $options.switchCategory(category.id), category.id),
        d: $data.currentCategory === category.id ? 1 : ""
      };
    })
  } : {}, {
    h: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: job.id,
        b: "3396464a-1-" + i0,
        c: common_vendor.p({
          job
        })
      };
    }),
    i: $data.jobList.length === 0
  }, $data.jobList.length === 0 ? {} : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss/computer_design_boss/computer_design_boss_front-end/pages/job/list/index.vue"]]);
wx.createPage(MiniProgramPage);
