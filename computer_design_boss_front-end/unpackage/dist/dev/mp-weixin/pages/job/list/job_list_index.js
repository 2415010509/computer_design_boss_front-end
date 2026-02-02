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
      activeParentCategory: null,
      jobList: []
    };
  },
  onLoad() {
    this.getJobList();
    this.getJobCategories();
  },
  methods: {
    async getJobList() {
      try {
        console.log("\u5F00\u59CB\u8BF7\u6C42\u804C\u4F4D\u5217\u8868...");
        console.log("\u5F53\u524D\u5206\u7C7BID:", this.currentCategories);
        console.log("\u5F53\u524D\u5C31\u4E1A\u7C7B\u578B:", this.currentEmpType);
        let res;
        if (this.currentTab && this.currentEmpType > 0) {
          console.log("\u8BF7\u6C42\u5206\u7C7B\u548C\u7C7B\u578B\u7B5B\u9009\u6570\u636E");
          res = await common_api_job.jobApi.getJobsByCategoryAndType(this.currentTab, this.currentEmpType);
        } else if (this.currentTab) {
          console.log("\u8BF7\u6C42\u5206\u7C7B\u7B5B\u9009\u6570\u636E");
          res = await common_api_job.jobApi.getJobsByCategory(this.currentTab);
        } else {
          console.log("\u8BF7\u6C42\u5168\u90E8\u804C\u4F4D\u6570\u636E");
          res = await common_api_job.jobApi.getAllJobs();
        }
        console.log("\u540E\u7AEF\u8FD4\u56DE\u539F\u59CB\u6570\u636E:", res);
        console.log("\u6570\u636E\u7C7B\u578B:", typeof res);
        console.log("\u662F\u5426\u4E3A\u6570\u7EC4:", Array.isArray(res));
        console.log("\u662F\u5426\u6709data\u5C5E\u6027:", res && "data" in res);
        let jobsData = [];
        if (res) {
          if (Array.isArray(res)) {
            jobsData = res;
          } else if (typeof res === "object" && Object.keys(res).length > 0) {
            if (res.list && Array.isArray(res.list)) {
              jobsData = res.list;
            } else if (res.data && Array.isArray(res.data)) {
              jobsData = res.data;
            } else if (res.jobs && Array.isArray(res.jobs)) {
              jobsData = res.jobs;
            }
          }
        }
        if (this.currentCategories.length > 0) {
          const categoryIds = this.currentCategories.map((id) => parseInt(id));
          this.jobList = jobsData.filter((job) => job.category_id !== void 0 && job.category_id !== null && categoryIds.includes(job.category_id));
          console.log("\u524D\u7AEF\u5C0F\u5206\u7C7B\u7B5B\u9009\u540EjobList\u957F\u5EA6:", this.jobList.length);
        } else {
          this.jobList = jobsData;
          console.log("\u6210\u529F\u8BBE\u7F6EjobList\uFF0C\u957F\u5EA6:", this.jobList.length);
        }
        if (this.jobList.length === 0) {
          console.log("\u5F53\u524D\u7B5B\u9009\u6761\u4EF6\u4E0B\u6CA1\u6709\u804C\u4F4D\u6570\u636E");
        }
      } catch (error) {
        this.jobList = [];
        console.error("\u83B7\u53D6\u804C\u4F4D\u5217\u8868\u5931\u8D25:", error);
        console.error("\u9519\u8BEF\u8BE6\u60C5:", error.message, error.stack);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25",
          icon: "none"
        });
      }
    },
    switchEmpType(empTypeId) {
      this.currentEmpType = empTypeId;
      this.getJobList();
    },
    onSearchInput() {
      if (this.keyword) {
        this.searchJobs();
      }
    },
    async searchJobs() {
      try {
        const res = await common_api_job.jobApi.searchJobs(this.keyword);
        if (res) {
          if (Array.isArray(res)) {
            this.jobList = res;
          } else if (typeof res === "object" && Object.keys(res).length > 0) {
            if (res.list && Array.isArray(res.list)) {
              this.jobList = res.list;
            } else if (res.data && Array.isArray(res.data)) {
              this.jobList = res.data;
            } else if (res.jobs && Array.isArray(res.jobs)) {
              this.jobList = res.jobs;
            } else {
              this.jobList = [];
              console.error("\u641C\u7D22\u804C\u4F4D\u5931\u8D25: \u65E0\u6CD5\u63D0\u53D6\u6709\u6548\u6570\u636E", res);
            }
          } else {
            this.jobList = [];
          }
        } else {
          this.jobList = [];
        }
      } catch (error) {
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
        this.activeParentCategory = null;
        this.categoryList = [];
        this.currentCategories = [];
      } else {
        this.currentTab = tabId;
        this.showCategoryTabs = true;
        this.activeParentCategory = tabId;
        this.currentCategories = [];
        this.categoryList = this.allCategories.filter((cat) => cat.parent_id && cat.parent_id.toString() === tabId);
      }
      this.getJobList();
    },
    switchCategory(categoryId) {
      if (this.currentCategories.includes(categoryId)) {
        this.currentCategories = this.currentCategories.filter((id) => id !== categoryId);
      } else {
        this.currentCategories.push(categoryId);
      }
      this.getJobList();
    },
    async getJobCategories() {
      try {
        const res = await common_api_job.jobApi.getJobCategories();
        if (res && Array.isArray(res)) {
          this.allCategories = res;
        } else {
          this.allCategories = [
            { "id": 100, "name": "\u6280\u672F\u5F00\u53D1\u7C7B", "parent_id": null, "level": 1 },
            { "id": 101, "name": "\u524D\u7AEF", "parent_id": 100, "level": 2 },
            { "id": 102, "name": "\u540E\u7AEF", "parent_id": 100, "level": 2 },
            { "id": 103, "name": "\u79FB\u52A8\u7AEF", "parent_id": 100, "level": 2 },
            { "id": 104, "name": "\u6570\u636E\u4E0EAI", "parent_id": 100, "level": 2 },
            { "id": 105, "name": "\u6D4B\u8BD5", "parent_id": 100, "level": 2 },
            { "id": 106, "name": "\u8FD0\u7EF4/DevOps", "parent_id": 100, "level": 2 },
            { "id": 107, "name": "\u7F51\u7EDC\u5B89\u5168", "parent_id": 100, "level": 2 },
            { "id": 108, "name": "\u5D4C\u5165\u5F0F/\u786C\u4EF6", "parent_id": 100, "level": 2 },
            { "id": 200, "name": "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B", "parent_id": null, "level": 1 },
            { "id": 300, "name": "\u6280\u672F\u7BA1\u7406\u7C7B", "parent_id": null, "level": 1 }
          ];
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u804C\u4F4D\u5206\u7C7B\u5931\u8D25:", error);
        this.allCategories = [
          { "id": 100, "name": "\u6280\u672F\u5F00\u53D1\u7C7B", "parent_id": null, "level": 1 },
          { "id": 101, "name": "\u524D\u7AEF", "parent_id": 100, "level": 2 },
          { "id": 102, "name": "\u540E\u7AEF", "parent_id": 100, "level": 2 },
          { "id": 103, "name": "\u79FB\u52A8\u7AEF", "parent_id": 100, "level": 2 },
          { "id": 104, "name": "\u6570\u636E\u4E0EAI", "parent_id": 100, "level": 2 },
          { "id": 105, "name": "\u6D4B\u8BD5", "parent_id": 100, "level": 2 },
          { "id": 106, "name": "\u8FD0\u7EF4/DevOps", "parent_id": 100, "level": 2 },
          { "id": 107, "name": "\u7F51\u7EDC\u5B89\u5168", "parent_id": 100, "level": 2 },
          { "id": 108, "name": "\u5D4C\u5165\u5F0F/\u786C\u4EF6", "parent_id": 100, "level": 2 },
          { "id": 200, "name": "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B", "parent_id": null, "level": 1 },
          { "id": 300, "name": "\u6280\u672F\u7BA1\u7406\u7C7B", "parent_id": null, "level": 1 }
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
    f: $data.showCategoryTabs
  }, $data.showCategoryTabs ? {
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
