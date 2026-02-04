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
      allCategories: [],
      subCategoryList: [],
      jobList: [],
      allJobs: [],
      hasMore: true,
      currentPage: 1,
      pageSize: 10,
      currentCategory: "",
      currentEmpType: "",
      keyword: "",
      selectedSubCategories: [],
      selectedEmpType: 0,
      showCategoryTabs: false,
      empTypeList: [
        { id: 0, name: "\u5168\u90E8" },
        { id: 1, name: "\u5168\u804C" },
        { id: 2, name: "\u517C\u804C" },
        { id: 3, name: "\u5B9E\u4E60" }
      ]
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
        const networkType = await new Promise((resolve) => {
          common_vendor.index.getNetworkType({
            success: (res2) => resolve(res2.networkType)
          });
        });
        console.log("\u5F53\u524D\u7F51\u7EDC\u72B6\u6001:", networkType);
        if (networkType === "none") {
          common_vendor.index.showToast({
            title: "\u5F53\u524D\u65E0\u7F51\u7EDC\u8FDE\u63A5",
            icon: "none"
          });
          return;
        }
        const res = await common_api_job.jobApi.getAllJobs();
        console.log("\u540E\u7AEF\u8FD4\u56DE\u539F\u59CB\u6570\u636E:", res);
        console.log("\u6570\u636E\u7C7B\u578B:", typeof res);
        console.log("\u662F\u5426\u4E3A\u6570\u7EC4:", Array.isArray(res));
        console.log("\u662F\u5426\u6709data\u5C5E\u6027:", res && "data" in res);
        let jobsData = [];
        console.log("res\u7684\u503C:", res);
        console.log("res\u7684\u7C7B\u578B:", typeof res);
        console.log("res\u662F\u5426\u4E3Anull:", res === null);
        console.log("res\u662F\u5426\u4E3Aundefined:", res === void 0);
        if (res !== null && res !== void 0) {
          console.log("res\u6709\u503C\uFF0C\u5F00\u59CB\u5904\u7406...");
          if (Array.isArray(res)) {
            jobsData = res;
            console.log("\u6210\u529F\u83B7\u53D6jobs\u6570\u636E\uFF0C\u957F\u5EA6:", res.length);
            if (jobsData.length > 0) {
              console.log("\u7B2C\u4E00\u6761\u6570\u636E\u7ED3\u6784:", jobsData[0]);
              console.log("\u662F\u5426\u5305\u542Bcategory_id:", "category_id" in jobsData[0]);
              console.log("category_id\u503C:", jobsData[0].category_id);
            }
          } else if (typeof res === "object" && Object.keys(res).length > 0) {
            if (res.list && Array.isArray(res.list)) {
              jobsData = res.list;
              console.log("\u4ECEres.list\u83B7\u53D6jobs\u6570\u636E\uFF0C\u957F\u5EA6:", res.list.length);
              if (jobsData.length > 0) {
                console.log("\u7B2C\u4E00\u6761\u6570\u636E\u7ED3\u6784:", jobsData[0]);
                console.log("\u662F\u5426\u5305\u542Bcategory_id:", "category_id" in jobsData[0]);
                console.log("category_id\u503C:", jobsData[0].category_id);
              }
            } else if (res.data && Array.isArray(res.data)) {
              jobsData = res.data;
              console.log("\u4ECEres.data\u83B7\u53D6jobs\u6570\u636E\uFF0C\u957F\u5EA6:", res.data.length);
              if (jobsData.length > 0) {
                console.log("\u7B2C\u4E00\u6761\u6570\u636E\u7ED3\u6784:", jobsData[0]);
                console.log("\u662F\u5426\u5305\u542Bcategory_id:", "category_id" in jobsData[0]);
                console.log("category_id\u503C:", jobsData[0].category_id);
              }
            } else if (res.jobs && Array.isArray(res.jobs)) {
              jobsData = res.jobs;
              console.log("\u4ECEres.jobs\u83B7\u53D6jobs\u6570\u636E\uFF0C\u957F\u5EA6:", res.jobs.length);
              if (jobsData.length > 0) {
                console.log("\u7B2C\u4E00\u6761\u6570\u636E\u7ED3\u6784:", jobsData[0]);
                console.log("\u662F\u5426\u5305\u542Bcategory_id:", "category_id" in jobsData[0]);
                console.log("category_id\u503C:", jobsData[0].category_id);
              }
            } else {
              console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u65E0\u6CD5\u63D0\u53D6\u6709\u6548\u6570\u636E", res);
              common_vendor.index.showToast({
                title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
                icon: "none"
              });
              jobsData = [];
            }
          } else {
            console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u65E0\u6548\u6570\u636E\u683C\u5F0F", res);
            common_vendor.index.showToast({
              title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
              icon: "none"
            });
            jobsData = [];
          }
        } else {
          console.log("\u540E\u7AEF\u8FD4\u56DE\u7A7A\u6570\u636E");
          common_vendor.index.showToast({
            title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u540E\u7AEF\u65E0\u6570\u636E\u8FD4\u56DE",
            icon: "none"
          });
          jobsData = [];
        }
        if (jobsData.length === 0) {
          console.log("\u4ECE\u540E\u7AEF\u83B7\u53D6\u7684\u6570\u636E\u4E3A\u7A7A\uFF0C\u4F7F\u7528\u6A21\u62DF\u6570\u636E");
          jobsData = this.getMockJobsData();
        }
        console.log("jobsData\u7684\u7C7B\u578B:", typeof jobsData);
        console.log("jobsData\u662F\u5426\u4E3A\u6570\u7EC4:", Array.isArray(jobsData));
        console.log("jobsData\u7684\u957F\u5EA6:", jobsData.length);
        jobsData = jobsData.map((job) => __spreadProps(__spreadValues({}, job), {
          category_id: job.category_id && job.category_id !== "" ? Number(job.category_id) : null
        }));
        this.allJobs = jobsData;
        this.jobList = jobsData;
        console.log("\u5B58\u50A8\u7684\u6240\u6709\u804C\u4F4D:", this.allJobs);
        console.log("allJobs\u7684\u7C7B\u578B:", typeof this.allJobs);
        console.log("allJobs\u662F\u5426\u4E3A\u6570\u7EC4:", Array.isArray(this.allJobs));
        console.log("allJobs\u7684\u957F\u5EA6:", this.allJobs.length);
        console.log("jobList\u7684\u957F\u5EA6:", this.jobList.length);
        if (this.allJobs.length > 0) {
          console.log("\u7B2C\u4E00\u4E2A\u804C\u4F4D\u7684\u6570\u636E\u7ED3\u6784:", this.allJobs[0]);
          console.log("\u7B2C\u4E00\u4E2A\u804C\u4F4D\u7684\u5206\u7C7BID:", this.allJobs[0].category_id);
          console.log("\u5206\u7C7BID\u7C7B\u578B:", typeof this.allJobs[0].category_id);
        }
      } catch (error) {
        this.allJobs = [];
        this.jobList = [];
        console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25:", error);
        console.error("\u9519\u8BEF\u8BE6\u60C5:", error.message, error.stack);
        if (error.message && error.message.includes("Packet sequence number wrong")) {
          common_vendor.index.showToast({
            title: "\u7F51\u7EDC\u8FDE\u63A5\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
            icon: "none"
          });
        } else {
          common_vendor.index.showToast({
            title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25",
            icon: "none"
          });
        }
      }
    },
    goToCategory(categoryId) {
      console.log("=== \u70B9\u51FB\u5206\u7C7B\u5F00\u59CB ===");
      console.log("\u70B9\u51FB\u7684\u5206\u7C7BID:", categoryId);
      console.log("\u70B9\u51FB\u7684\u5206\u7C7BID\u7C7B\u578B:", typeof categoryId);
      this.currentCategory = categoryId;
      console.log("\u8BBE\u7F6E\u540E\u7684currentCategory:", this.currentCategory);
      console.log("\u8BBE\u7F6E\u540E\u7684currentCategory\u7C7B\u578B:", typeof this.currentCategory);
      console.log("\u68C0\u67E5\u662F\u5426\u4E3A\u6280\u672F\u5F00\u53D1\u7C7B:");
      console.log('categoryId === "100":', categoryId === "100");
      console.log("categoryId === 100:", categoryId === 100);
      if (categoryId === "100" || categoryId === 100) {
        this.showCategoryTabs = true;
        console.log("\u83B7\u53D6\u6280\u672F\u5F00\u53D1\u7684\u5B50\u5206\u7C7B:");
        this.subCategoryList = this.allCategories.filter((category) => {
          const parentId = category.parent_id;
          const isMatch = parentId && (parentId.toString() === "100" || parentId === 100);
          console.log("\u5206\u7C7B:", category.name, "parent_id:", parentId, "\u7C7B\u578B:", typeof parentId, "\u662F\u5426\u5339\u914D:", isMatch);
          return isMatch;
        });
        console.log("\u83B7\u53D6\u5230\u7684\u5B50\u5206\u7C7B\u6570\u91CF:", this.subCategoryList.length);
      } else {
        this.showCategoryTabs = false;
        this.subCategoryList = [];
      }
      this.selectedSubCategories = [];
      this.selectedEmpType = 0;
      this.keyword = "";
      console.log("\u91CD\u7F6E\u540E\u7684\u7B5B\u9009\u6761\u4EF6:");
      console.log("selectedSubCategories:", this.selectedSubCategories);
      console.log("selectedEmpType:", this.selectedEmpType);
      console.log("keyword:", this.keyword);
      console.log("\u51C6\u5907\u5E94\u7528\u7B5B\u9009...");
      this.applyFilters();
      console.log("=== \u70B9\u51FB\u5206\u7C7B\u7ED3\u675F ===");
    },
    selectSubCategory(categoryId) {
      const numCategoryId = Number(categoryId);
      const index = this.selectedSubCategories.indexOf(numCategoryId);
      if (index === -1) {
        this.selectedSubCategories.push(numCategoryId);
      } else {
        this.selectedSubCategories.splice(index, 1);
      }
      console.log("\u9009\u62E9\u7684\u5B50\u5206\u7C7B:", this.selectedSubCategories);
      this.applyFilters();
    },
    selectEmpType(typeId) {
      this.selectedEmpType = typeId;
      this.applyFilters();
    },
    onSearchInput() {
      this.applyFilters();
    },
    applyFilters() {
      console.log("=== \u5E94\u7528\u7B5B\u9009\u5F00\u59CB ===");
      console.log("\u5F53\u524D\u5206\u7C7B:", this.currentCategory);
      console.log("\u5F53\u524D\u5206\u7C7B\u7C7B\u578B:", typeof this.currentCategory);
      console.log("\u5168\u90E8\u804C\u4F4D\u6570:", this.allJobs.length);
      console.log("\u524D3\u4E2A\u804C\u4F4D\u4FE1\u606F:");
      for (let i = 0; i < Math.min(3, this.allJobs.length); i++) {
        console.log(`\u804C\u4F4D${i + 1}:`, this.allJobs[i].title, "\u5206\u7C7BID:", this.allJobs[i].category_id, "\u7C7B\u578B:", typeof this.allJobs[i].category_id);
      }
      let filteredJobs = [...this.allJobs];
      console.log("\u7B5B\u9009\u524D\u804C\u4F4D\u6570:", filteredJobs.length);
      if (this.currentCategory) {
        console.log("=== \u5206\u7C7B\u7B5B\u9009\u5F00\u59CB ===");
        console.log("\u5F53\u524D\u5206\u7C7BID:", this.currentCategory);
        console.log("\u5F53\u524D\u5206\u7C7BID\u7C7B\u578B:", typeof this.currentCategory);
        console.log("\u7B5B\u9009\u524D\u804C\u4F4D\u603B\u6570:", filteredJobs.length);
        const currentCatNum = Number(this.currentCategory);
        const matchedJobs = [];
        filteredJobs = filteredJobs.filter((job) => {
          if (!job || job.category_id === null) {
            console.log("\u8DF3\u8FC7\u65E0\u6548\u804C\u4F4D\u6570\u636E:", job);
            return false;
          }
          const jobCategoryId = job.category_id;
          console.log("\u804C\u4F4D:", job.title, "\u5206\u7C7BID:", jobCategoryId, "\u7C7B\u578B:", typeof jobCategoryId);
          if (currentCatNum === 100 && this.selectedSubCategories.length > 0) {
            console.log("\u5B50\u5206\u7C7B\u7B5B\u9009\u6761\u4EF6:", this.selectedSubCategories);
            const isMatch = this.selectedSubCategories.includes(jobCategoryId);
            console.log("\u5B50\u5206\u7C7B\u5339\u914D\u7ED3\u679C:", isMatch);
            if (isMatch) {
              matchedJobs.push(job);
            }
            return isMatch;
          } else {
            const jobCatStr = jobCategoryId.toString();
            const currentCatStr = this.currentCategory.toString();
            console.log("=== \u5355\u4E2A\u804C\u4F4D\u6BD4\u8F83 ===");
            console.log("\u804C\u4F4D\u6807\u9898:", job.title);
            console.log("\u804C\u4F4D\u5206\u7C7BID:", jobCategoryId, "\u7C7B\u578B:", typeof jobCategoryId);
            console.log("\u5F53\u524D\u5206\u7C7BID:", this.currentCategory, "\u7C7B\u578B:", typeof this.currentCategory);
            console.log("\u8F6C\u6362\u540E\u7684\u5F53\u524D\u5206\u7C7BID:", currentCatNum, "\u7C7B\u578B:", typeof currentCatNum);
            console.log("\u804C\u4F4D\u5206\u7C7B\u5B57\u7B26\u4E32:", jobCatStr, "\u957F\u5EA6:", jobCatStr.length);
            console.log("\u5F53\u524D\u5206\u7C7B\u5B57\u7B26\u4E32:", currentCatStr, "\u957F\u5EA6:", currentCatStr.length);
            console.log("\u5B57\u7B26\u4E32\u6BD4\u8F83:", jobCatStr, "startsWith", currentCatStr);
            console.log("\u6BD4\u8F83\u7ED3\u679C:", jobCatStr.startsWith(currentCatStr));
            const exactMatch = jobCategoryId === currentCatNum;
            const startsWithMatch = jobCatStr.startsWith(currentCatStr);
            console.log("=== \u5339\u914D\u7ED3\u679C\u5206\u6790 ===");
            console.log("jobCategoryId:", jobCategoryId, "\u7C7B\u578B:", typeof jobCategoryId);
            console.log("currentCatNum:", currentCatNum, "\u7C7B\u578B:", typeof currentCatNum);
            console.log("\u5B8C\u5168\u5339\u914D\u6761\u4EF6:", `${jobCategoryId} === ${currentCatNum}`);
            console.log("\u5B8C\u5168\u5339\u914D\u7ED3\u679C:", exactMatch);
            console.log("jobCatStr:", jobCatStr, "\u957F\u5EA6:", jobCatStr.length);
            console.log("currentCatStr:", currentCatStr, "\u957F\u5EA6:", currentCatStr.length);
            console.log("\u524D\u7F00\u5339\u914D\u6761\u4EF6:", `${jobCatStr}.startsWith(${currentCatStr})`);
            console.log("\u524D\u7F00\u5339\u914D\u7ED3\u679C:", startsWithMatch);
            const isMatch = exactMatch || startsWithMatch;
            console.log("\u6700\u7EC8\u5339\u914D\u7ED3\u679C:", isMatch);
            if (!isMatch) {
              console.log("=== \u4E0D\u5339\u914D\u539F\u56E0\u5206\u6790 ===");
              console.log("jobCategoryId\u548CcurrentCatNum\u662F\u5426\u76F8\u7B49:", jobCategoryId === currentCatNum);
              console.log("jobCatStr\u662F\u5426\u4EE5currentCatStr\u5F00\u5934:", jobCatStr.startsWith(currentCatStr));
              console.log("jobCatStr.substring(0, currentCatStr.length):", jobCatStr.substring(0, currentCatStr.length));
              console.log("currentCatStr:", currentCatStr);
              console.log("\u4E24\u4E2A\u5B57\u7B26\u4E32\u662F\u5426\u76F8\u7B49:", jobCatStr.substring(0, currentCatStr.length) === currentCatStr);
            }
            if (isMatch) {
              matchedJobs.push(job);
              console.log("\u6DFB\u52A0\u5230\u5339\u914D\u5217\u8868");
            } else {
              console.log("\u672A\u5339\u914D");
            }
            return isMatch;
          }
        });
        console.log("\u5339\u914D\u7684\u804C\u4F4D\u5217\u8868:", matchedJobs);
        console.log("\u5206\u7C7B\u7B5B\u9009\u540E\u804C\u4F4D\u6570:", filteredJobs.length);
        console.log("=== \u5206\u7C7B\u7B5B\u9009\u7ED3\u675F ===");
      }
      console.log("=== \u5E94\u7528\u5C31\u4E1A\u7C7B\u578B\u7B5B\u9009 ===");
      console.log("\u5F53\u524D\u5C31\u4E1A\u7C7B\u578B\u7B5B\u9009:", this.selectedEmpType);
      if (this.selectedEmpType !== 0) {
        const beforeCount = filteredJobs.length;
        filteredJobs = filteredJobs.filter((job) => {
          const empTypeMatch = job.emp_type && Number(job.emp_type) === Number(this.selectedEmpType);
          console.log("\u804C\u4F4D:", job.title, "emp_type:", job.emp_type, "\u5339\u914D\u7ED3\u679C:", empTypeMatch);
          return empTypeMatch;
        });
        console.log(`\u5C31\u4E1A\u7C7B\u578B\u7B5B\u9009\u540E\u804C\u4F4D\u6570: ${beforeCount} \u2192 ${filteredJobs.length}`);
      }
      console.log("=== \u5E94\u7528\u5173\u952E\u8BCD\u641C\u7D22 ===");
      console.log("\u5F53\u524D\u5173\u952E\u8BCD:", this.keyword);
      if (this.keyword) {
        const beforeCount = filteredJobs.length;
        const keywordLower = this.keyword.toLowerCase();
        filteredJobs = filteredJobs.filter((job) => {
          const titleMatch = job.title && job.title.toLowerCase().includes(keywordLower);
          const companyMatch = job.company && job.company.toLowerCase().includes(keywordLower);
          const descriptionMatch = job.description && job.description.toLowerCase().includes(keywordLower);
          const isMatch = titleMatch || companyMatch || descriptionMatch;
          console.log("\u804C\u4F4D:", job.title, "\u5339\u914D\u7ED3\u679C:", isMatch);
          return isMatch;
        });
        console.log(`\u5173\u952E\u8BCD\u641C\u7D22\u540E\u804C\u4F4D\u6570: ${beforeCount} \u2192 ${filteredJobs.length}`);
      }
      console.log("=== \u66F4\u65B0\u804C\u4F4D\u5217\u8868 ===");
      console.log("\u6700\u7EC8\u7B5B\u9009\u7ED3\u679C:", filteredJobs.length);
      this.jobList = filteredJobs;
      console.log("jobList\u957F\u5EA6:", this.jobList.length);
      console.log("=== \u5E94\u7528\u7B5B\u9009\u7ED3\u675F ===");
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
          this.allCategories = res;
          const parentCategories = res.filter((category) => !category.parent_id || category.parent_id === null);
          if (parentCategories.length > 0) {
            this.categoryList = parentCategories.map((category) => __spreadProps(__spreadValues({}, category), {
              icon: `/static/category/${this.getCategoryIcon(category.id)}.png`
            }));
          } else {
            this.categoryList = mainCategories;
            this.generateMockSubCategories();
          }
        } else {
          this.categoryList = mainCategories;
          this.generateMockSubCategories();
        }
      }).catch((error) => {
        console.error("\u83B7\u53D6\u804C\u4F4D\u5206\u7C7B\u5931\u8D25:", error);
        this.categoryList = mainCategories;
        this.generateMockSubCategories();
      });
    },
    generateMockSubCategories() {
      this.allCategories = [
        { id: 100, name: "\u6280\u672F\u5F00\u53D1", parent_id: null },
        { id: 200, name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1", parent_id: null },
        { id: 300, name: "\u6280\u672F\u7BA1\u7406", parent_id: null },
        { id: 101, name: "\u524D\u7AEF\u5F00\u53D1", parent_id: 100 },
        { id: 102, name: "\u540E\u7AEF\u5F00\u53D1", parent_id: 100 },
        { id: 103, name: "\u79FB\u52A8\u5F00\u53D1", parent_id: 100 },
        { id: 104, name: "\u6D4B\u8BD5\u5F00\u53D1", parent_id: 100 },
        { id: 105, name: "\u4EBA\u5DE5\u667A\u80FD", parent_id: 100 },
        { id: 106, name: "\u5927\u6570\u636E", parent_id: 100 },
        { id: 107, name: "\u4E91\u8BA1\u7B97", parent_id: 100 },
        { id: 108, name: "\u8FD0\u7EF4\u5F00\u53D1", parent_id: 100 }
      ];
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
    },
    getMockJobsData() {
      console.log("\u8C03\u7528getMockJobsData\u65B9\u6CD5");
      const mockData = [
        { id: 1, title: "\u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08", company: "\u79D1\u6280\u6709\u9650\u516C\u53F8", category_id: 101, emp_type: 1, description: "\u8D1F\u8D23\u516C\u53F8\u7F51\u7AD9\u524D\u7AEF\u5F00\u53D1\uFF0C\u4F7F\u7528Vue\u6846\u67B6" },
        { id: 2, title: "\u540E\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08", company: "\u4E92\u8054\u7F51\u79D1\u6280", category_id: 102, emp_type: 1, description: "\u8D1F\u8D23Java\u540E\u7AEF\u5F00\u53D1\uFF0C\u719F\u6089Spring\u6846\u67B6" },
        { id: 3, title: "UI\u8BBE\u8BA1\u5E08", company: "\u8BBE\u8BA1\u5DE5\u4F5C\u5BA4", category_id: 201, emp_type: 2, description: "\u8D1F\u8D23\u4EA7\u54C1UI\u8BBE\u8BA1\uFF0C\u719F\u6089Figma\u5DE5\u5177" },
        { id: 4, title: "\u4EA7\u54C1\u7ECF\u7406", company: "\u521B\u65B0\u79D1\u6280", category_id: 301, emp_type: 1, description: "\u8D1F\u8D23\u4EA7\u54C1\u89C4\u5212\u548C\u9700\u6C42\u5206\u6790" },
        { id: 5, title: "\u79FB\u52A8\u7AEF\u5F00\u53D1", company: "\u79FB\u52A8\u79D1\u6280", category_id: 103, emp_type: 3, description: "\u8D1F\u8D23React Native\u79FB\u52A8\u5E94\u7528\u5F00\u53D1" },
        { id: 6, title: "\u6D4B\u8BD5\u5DE5\u7A0B\u5E08", company: "\u8F6F\u4EF6\u6D4B\u8BD5", category_id: 104, emp_type: 1, description: "\u8D1F\u8D23\u81EA\u52A8\u5316\u6D4B\u8BD5\u548C\u6027\u80FD\u6D4B\u8BD5" },
        { id: 7, title: "\u6570\u636E\u5206\u6790\u5E08", company: "\u6570\u636E\u5206\u6790", category_id: 106, emp_type: 2, description: "\u8D1F\u8D23\u4E1A\u52A1\u6570\u636E\u5206\u6790\u548C\u53EF\u89C6\u5316" },
        { id: 8, title: "\u8FD0\u7EF4\u5DE5\u7A0B\u5E08", company: "\u4E91\u670D\u52A1", category_id: 108, emp_type: 1, description: "\u8D1F\u8D23\u670D\u52A1\u5668\u8FD0\u7EF4\u548C\u76D1\u63A7" },
        { id: 9, title: "AI\u5DE5\u7A0B\u5E08", company: "\u4EBA\u5DE5\u667A\u80FD", category_id: 105, emp_type: 3, description: "\u8D1F\u8D23\u673A\u5668\u5B66\u4E60\u6A21\u578B\u5F00\u53D1" },
        { id: 10, title: "\u4E91\u8BA1\u7B97\u5DE5\u7A0B\u5E08", company: "\u4E91\u8BA1\u7B97", category_id: 107, emp_type: 1, description: "\u8D1F\u8D23\u4E91\u5E73\u53F0\u67B6\u6784\u8BBE\u8BA1" }
      ];
      console.log("\u6A21\u62DF\u6570\u636E\u751F\u6210\u6210\u529F\uFF0C\u957F\u5EA6:", mockData.length);
      console.log("\u6A21\u62DF\u6570\u636E:", mockData);
      return mockData;
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
    d: common_vendor.f($data.bannerList, (banner, index, i0) => {
      return {
        a: banner.imageUrl,
        b: index
      };
    }),
    e: common_vendor.f($data.categoryList, (category, k0, i0) => {
      return {
        a: category.icon,
        b: common_vendor.t(category.name),
        c: category.id,
        d: common_vendor.o(($event) => $options.goToCategory(category.id), category.id)
      };
    }),
    f: $data.showCategoryTabs && $data.subCategoryList.length > 0
  }, $data.showCategoryTabs && $data.subCategoryList.length > 0 ? {
    g: common_vendor.f($data.subCategoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.o(($event) => $options.selectSubCategory(category.id), category.id),
        d: $data.selectedSubCategories.includes(category.id) ? 1 : ""
      };
    })
  } : {}, {
    h: common_vendor.f($data.empTypeList, (type, k0, i0) => {
      return {
        a: common_vendor.t(type.name),
        b: type.id,
        c: common_vendor.o(($event) => $options.selectEmpType(type.id), type.id),
        d: $data.selectedEmpType === type.id ? 1 : ""
      };
    }),
    i: common_vendor.o((...args) => $options.scrollToJobList && $options.scrollToJobList(...args)),
    j: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: job.id,
        b: "fd2dfda4-1-" + i0,
        c: common_vendor.p({
          data: job
        })
      };
    }),
    k: $data.hasMore
  }, $data.hasMore ? {
    l: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    m: common_vendor.o((...args) => $options.goToAddJob && $options.goToAddJob(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/index/index_index.vue"]]);
wx.createPage(MiniProgramPage);
