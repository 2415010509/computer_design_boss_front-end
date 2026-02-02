"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
      categoryList: [],
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
    this.getJobCategories();
  },
  onPullDownRefresh() {
    this.onRefresh();
  },
  methods: {
    async getRecommendJobs() {
      try {
        console.log("\u5F00\u59CB\u8BF7\u6C42\u63A8\u8350\u804C\u4F4D...");
        const res = await common_api_job.jobApi.getAllJobs();
        console.log("\u540E\u7AEF\u8FD4\u56DE\u539F\u59CB\u6570\u636E:", res);
        console.log("\u6570\u636E\u7C7B\u578B:", typeof res);
        console.log("\u662F\u5426\u4E3A\u6570\u7EC4:", Array.isArray(res));
        console.log("\u662F\u5426\u6709data\u5C5E\u6027:", res && "data" in res);
        if (res) {
          if (Array.isArray(res)) {
            this.jobList = res;
            console.log("\u6210\u529F\u8BBE\u7F6EjobList\uFF0C\u957F\u5EA6:", res.length);
          } else if (typeof res === "object" && Object.keys(res).length > 0) {
            if (res.list && Array.isArray(res.list)) {
              this.jobList = res.list;
              console.log("\u4ECEres.list\u8BBE\u7F6EjobList\uFF0C\u957F\u5EA6:", res.list.length);
            } else if (res.data && Array.isArray(res.data)) {
              this.jobList = res.data;
              console.log("\u4ECEres.data\u8BBE\u7F6EjobList\uFF0C\u957F\u5EA6:", res.data.length);
            } else if (res.jobs && Array.isArray(res.jobs)) {
              this.jobList = res.jobs;
              console.log("\u4ECEres.jobs\u8BBE\u7F6EjobList\uFF0C\u957F\u5EA6:", res.jobs.length);
            } else {
              this.jobList = [];
              console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u65E0\u6CD5\u63D0\u53D6\u6709\u6548\u6570\u636E", res);
              common_vendor.index.showToast({
                title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
                icon: "none"
              });
            }
          } else {
            this.jobList = [];
            console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u65E0\u6548\u6570\u636E\u683C\u5F0F", res);
            common_vendor.index.showToast({
              title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25",
              icon: "none"
            });
          }
        } else {
          this.jobList = [];
          console.log("\u540E\u7AEF\u8FD4\u56DE\u7A7A\u6570\u636E");
        }
      } catch (error) {
        this.jobList = [];
        console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25:", error);
        console.error("\u9519\u8BEF\u8BE6\u60C5:", error.message, error.stack);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25",
          icon: "none"
        });
      }
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/job/list/job_list_index"
      });
    },
    goToCategory(categoryId) {
      this.currentCategory = categoryId;
      this.getJobsByCategory();
    },
    async getJobsByCategory() {
      try {
        const res = await common_api_job.jobApi.getJobsByCategory(this.currentCategory);
        console.log("\u83B7\u53D6\u5206\u7C7B\u804C\u4F4D\u539F\u59CB\u6570\u636E:", res);
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
              console.error("\u83B7\u53D6\u5206\u7C7B\u804C\u4F4D\u5931\u8D25: \u65E0\u6CD5\u63D0\u53D6\u6709\u6548\u6570\u636E", res);
              common_vendor.index.showToast({
                title: "\u83B7\u53D6\u5206\u7C7B\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
                icon: "none"
              });
            }
          } else {
            this.jobList = [];
          }
        } else {
          this.jobList = [];
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u5206\u7C7B\u804C\u4F4D\u5931\u8D25:", error);
        this.jobList = [];
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
      this.getJobCategories();
      common_vendor.index.stopPullDownRefresh();
    },
    goToAddJob() {
      common_vendor.index.navigateTo({
        url: "/pages/job/add/job_add_index"
      });
    },
    getJobCategories() {
      const mainCategories = [
        { id: "100", name: "\u6280\u672F\u5F00\u53D1", icon: "/static/category/tech.png" },
        { id: "200", name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1", icon: "/static/category/design.png" },
        { id: "300", name: "\u6280\u672F\u7BA1\u7406", icon: "/static/category/product.png" }
      ];
      common_api_job.jobApi.getJobCategories().then((res) => {
        if (res && Array.isArray(res)) {
          const parentCategories = res.filter((category) => !category.parent_id || category.parent_id === null);
          if (parentCategories.length > 0) {
            this.categoryList = parentCategories.map((category) => __spreadProps(__spreadValues({}, category), {
              icon: `/static/category/${this.getCategoryIcon(category.id)}.png`
            }));
          } else {
            this.categoryList = mainCategories;
          }
        } else {
          this.categoryList = mainCategories;
        }
      }).catch((error) => {
        console.error("\u83B7\u53D6\u804C\u4F4D\u5206\u7C7B\u5931\u8D25:", error);
        this.categoryList = mainCategories;
      });
    },
    getCategoryIcon(categoryId) {
      const iconMap = {
        "100": "tech",
        "200": "design",
        "300": "product",
        "1001": "tech",
        "1002": "design",
        "1003": "market"
      };
      return iconMap[categoryId] || "tech";
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
        b: "fd2dfda4-1-" + i0,
        c: common_vendor.p({
          data: job
        })
      };
    }),
    g: $data.hasMore
  }, $data.hasMore ? {
    h: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    i: common_vendor.o((...args) => $options.goToAddJob && $options.goToAddJob(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/index/index_index.vue"]]);
wx.createPage(MiniProgramPage);
