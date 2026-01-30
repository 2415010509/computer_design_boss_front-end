"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_job = require("../../../common/api/job.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      jobId: "",
      jobDetail: {}
    };
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id;
      this.getJobDetail();
    }
  },
  methods: {
    async getJobDetail() {
      try {
        const res = await common_api_job.jobApi.getJobDetail(this.jobId);
        if (res && res.length > 0) {
          this.jobDetail = res[0];
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u804C\u4F4D\u8BE6\u60C5\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25",
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
  return {
    a: common_vendor.t($data.jobDetail.title),
    b: common_vendor.t($data.jobDetail.salary_min),
    c: common_vendor.t($data.jobDetail.salary_max),
    d: common_vendor.t($data.jobDetail.edu_req),
    e: common_vendor.t($data.jobDetail.exp_req),
    f: common_vendor.t($options.getEmpTypeText($data.jobDetail.emp_type)),
    g: common_vendor.t($data.jobDetail.description || "\u6682\u65E0\u63CF\u8FF0"),
    h: common_vendor.t($data.jobDetail.requirements || "\u6682\u65E0\u8981\u6C42")
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss/computer_design_boss/computer_design_boss_front-end/pages/job/detail/index.vue"]]);
wx.createPage(MiniProgramPage);
