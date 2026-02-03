"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_job = require("../../../common/api/job.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const jobCard = () => "../../../component/job/job-card.js";
const _sfc_main = {
  components: { jobCard },
  data() {
    return {
      keyword: "",
      filterTabs: [
        { id: "100", name: "\u6280\u672F\u5F00\u53D1\u7C7B", icon: "/static/category/tech.png" },
        { id: "200", name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B", icon: "/static/category/design.png" },
        { id: "300", name: "\u6280\u672F\u7BA1\u7406\u7C7B", icon: "/static/category/product.png" }
      ],
      allCategories: [],
      categoryList: [],
      empTypeList: [
        { id: 0, name: "\u5168\u90E8" },
        { id: 1, name: "\u5168\u804C" },
        { id: 2, name: "\u517C\u804C" },
        { id: 3, name: "\u5B9E\u4E60" }
      ],
      currentTab: "",
      currentCategories: [],
      currentEmpType: 0,
      showCategoryTabs: false,
      jobList: []
    };
  },
  onLoad() {
    this.getJobCategories();
    this.getJobList();
  },
  methods: {
    async getJobList() {
      try {
        let jobsData = [];
        if (this.keyword) {
          await this.searchJobs();
          return;
        }
        if (this.currentTab && this.currentEmpType > 0) {
          jobsData = await common_api_job.jobApi.getJobsByCategoryAndType(this.currentTab, this.currentEmpType);
        } else if (this.currentTab) {
          jobsData = await common_api_job.jobApi.getJobsByCategory(this.currentTab);
        } else {
          jobsData = await common_api_job.jobApi.getAllJobs();
        }
        if (Array.isArray(jobsData)) {
        } else if (jobsData && typeof jobsData === "object") {
          jobsData = jobsData.list || jobsData.data || jobsData.jobs || [];
        } else {
          jobsData = [];
        }
        if (this.currentCategories.length > 0) {
          const categoryIds = this.currentCategories.map((id) => parseInt(id));
          jobsData = jobsData.filter((job) => job.category_id !== void 0 && categoryIds.includes(Number(job.category_id)));
        }
        this.jobList = jobsData;
      } catch (error) {
        this.jobList = [];
        common_vendor.index.showToast({ title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25", icon: "none" });
        console.error(error);
      }
    },
    switchEmpType(empTypeId) {
      if (this.currentEmpType !== empTypeId) {
        this.currentEmpType = empTypeId;
        this.getJobList();
      }
    },
    onSearchInput() {
      if (this.keyword) {
        this.searchJobs();
      }
    },
    async searchJobs() {
      try {
        let res = await common_api_job.jobApi.searchJobs(this.keyword);
        if (Array.isArray(res)) {
          this.jobList = res;
        } else if (typeof res === "object" && Object.keys(res).length > 0) {
          this.jobList = res.list || res.data || res.jobs || [];
        } else {
          this.jobList = [];
        }
      } catch (error) {
        this.jobList = [];
        console.error("\u641C\u7D22\u804C\u4F4D\u5931\u8D25:", error);
      }
    },
    onCancelSearch() {
      this.keyword = "";
      this.getJobList();
    },
    switchTab(tabId) {
      if (this.currentTab === tabId && this.showCategoryTabs) {
        this.showCategoryTabs = false;
        this.currentTab = "";
        this.categoryList = [];
        this.currentCategories = [];
      } else {
        this.currentTab = tabId;
        this.showCategoryTabs = true;
        this.currentCategories = [];
        this.categoryList = this.allCategories.filter((cat) => String(cat.parent_id) === String(tabId));
      }
      this.getJobList();
    },
    switchCategory(categoryId) {
      const id = typeof categoryId === "string" ? parseInt(categoryId) : categoryId;
      if (this.currentCategories.includes(id)) {
        this.currentCategories = this.currentCategories.filter((cid) => cid !== id);
      } else {
        this.currentCategories.push(id);
      }
      this.getJobList();
    },
    async getJobCategories() {
      try {
        const res = await common_api_job.jobApi.getJobCategories();
        if (Array.isArray(res)) {
          this.allCategories = res;
        } else if (res && typeof res === "object") {
          this.allCategories = res.list || res.data || res.jobs || [];
        } else {
          this.allCategories = [
            { id: 100, name: "\u6280\u672F\u5F00\u53D1\u7C7B", parent_id: null, level: 1 },
            { id: 101, name: "\u524D\u7AEF", parent_id: 100, level: 2 },
            { id: 102, name: "\u540E\u7AEF", parent_id: 100, level: 2 },
            { id: 103, name: "\u79FB\u52A8\u7AEF", parent_id: 100, level: 2 },
            { id: 104, name: "\u6570\u636E\u4E0EAI", parent_id: 100, level: 2 },
            { id: 105, name: "\u6D4B\u8BD5", parent_id: 100, level: 2 },
            { id: 106, name: "\u8FD0\u7EF4/DevOps", parent_id: 100, level: 2 },
            { id: 107, name: "\u7F51\u7EDC\u5B89\u5168", parent_id: 100, level: 2 },
            { id: 108, name: "\u5D4C\u5165\u5F0F/\u786C\u4EF6", parent_id: 100, level: 2 },
            { id: 200, name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B", parent_id: null, level: 1 },
            { id: 300, name: "\u6280\u672F\u7BA1\u7406\u7C7B", parent_id: null, level: 1 }
          ];
        }
      } catch (error) {
        this.allCategories = [
          { id: 100, name: "\u6280\u672F\u5F00\u53D1\u7C7B", parent_id: null, level: 1 },
          { id: 101, name: "\u524D\u7AEF", parent_id: 100, level: 2 },
          { id: 102, name: "\u540E\u7AEF", parent_id: 100, level: 2 },
          { id: 103, name: "\u79FB\u52A8\u7AEF", parent_id: 100, level: 2 },
          { id: 104, name: "\u6570\u636E\u4E0EAI", parent_id: 100, level: 2 },
          { id: 105, name: "\u6D4B\u8BD5", parent_id: 100, level: 2 },
          { id: 106, name: "\u8FD0\u7EF4/DevOps", parent_id: 100, level: 2 },
          { id: 107, name: "\u7F51\u7EDC\u5B89\u5168", parent_id: 100, level: 2 },
          { id: 108, name: "\u5D4C\u5165\u5F0F/\u786C\u4EF6", parent_id: 100, level: 2 },
          { id: 200, name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B", parent_id: null, level: 1 },
          { id: 300, name: "\u6280\u672F\u7BA1\u7406\u7C7B", parent_id: null, level: 1 }
        ];
      }
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
      return common_vendor.e({
        a: tab.icon
      }, tab.icon ? {
        b: tab.icon
      } : {}, {
        c: common_vendor.t(tab.name),
        d: tab.id,
        e: common_vendor.o(($event) => $options.switchTab(tab.id), tab.id),
        f: $data.currentTab === tab.id ? 1 : ""
      });
    }),
    f: $data.showCategoryTabs && $data.categoryList.length > 0
  }, $data.showCategoryTabs && $data.categoryList.length > 0 ? {
    g: common_vendor.f($data.categoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.o(($event) => $options.switchCategory(category.id), category.id),
        d: $data.currentCategories.includes(category.id) ? 1 : ""
      };
    })
  } : {}, {
    h: common_vendor.f($data.empTypeList, (type, k0, i0) => {
      return {
        a: common_vendor.t(type.name),
        b: type.id,
        c: common_vendor.o(($event) => $options.switchEmpType(type.id), type.id),
        d: $data.currentEmpType === type.id ? 1 : ""
      };
    }),
    i: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: job.id,
        b: "4c84bf90-1-" + i0,
        c: common_vendor.p({
          data: job
        })
      };
    }),
    j: $data.jobList.length === 0
  }, $data.jobList.length === 0 ? {} : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/job/list/job_list_index.vue"]]);
wx.createPage(MiniProgramPage);
