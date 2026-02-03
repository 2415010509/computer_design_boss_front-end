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
        console.log("\u804C\u4F4D\u8BE6\u60C5\u8FD4\u56DE\u6570\u636E:", res);
        if (Array.isArray(res) && res.length > 0) {
          this.jobDetail = res[0];
        } else if (res && typeof res === "object" && Object.keys(res).length > 0) {
          this.jobDetail = res;
        } else {
          this.jobDetail = {};
        }
        try {
          if (this.jobDetail.require_list && typeof this.jobDetail.require_list === "string") {
            this.jobDetail.require_list = JSON.parse(this.jobDetail.require_list);
          }
          if (this.jobDetail.welfare_list && typeof this.jobDetail.welfare_list === "string") {
            this.jobDetail.welfare_list = JSON.parse(this.jobDetail.welfare_list);
          }
        } catch (error) {
          console.error("JSON\u89E3\u6790\u5931\u8D25:", error);
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
    getEmpTypeText(type) {
      const typeMap = {
        "1": "\u5168\u804C",
        "2": "\u517C\u804C",
        "3": "\u5B9E\u4E60"
      };
      return typeMap[type] || "\u5168\u804C";
    },
    formatDate(dateString) {
      if (!dateString)
        return "";
      try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      } catch (error) {
        console.error("\u65E5\u671F\u683C\u5F0F\u5316\u5931\u8D25:", error);
        return dateString;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
  return common_vendor.e({
    a: common_vendor.t(((_a = $data.jobDetail) == null ? void 0 : _a.title) || "\u6682\u65E0\u804C\u4F4D\u4FE1\u606F"),
    b: common_vendor.t(((_b = $data.jobDetail) == null ? void 0 : _b.salary_min) ? `${($data.jobDetail.salary_min / 1e3).toFixed(0)}k-${((_c = $data.jobDetail) == null ? void 0 : _c.salary_max) ? ($data.jobDetail.salary_max / 1e3).toFixed(0) : "?"}k` : "\u85AA\u8D44\u9762\u8BAE"),
    c: common_vendor.t(((_d = $data.jobDetail) == null ? void 0 : _d.edu_req) || "\u5B66\u5386\u4E0D\u9650"),
    d: common_vendor.t(((_e = $data.jobDetail) == null ? void 0 : _e.exp_req) || "\u7ECF\u9A8C\u4E0D\u9650"),
    e: common_vendor.t(((_f = $data.jobDetail) == null ? void 0 : _f.emp_type) ? $options.getEmpTypeText($data.jobDetail.emp_type) : "\u5168\u804C"),
    f: common_vendor.t(((_g = $data.jobDetail) == null ? void 0 : _g.description) || "\u6682\u65E0\u63CF\u8FF0"),
    g: Array.isArray((_h = $data.jobDetail) == null ? void 0 : _h.require_list) && $data.jobDetail.require_list.length > 0
  }, Array.isArray((_i = $data.jobDetail) == null ? void 0 : _i.require_list) && $data.jobDetail.require_list.length > 0 ? {
    h: common_vendor.f($data.jobDetail.require_list, (req, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(req),
        c: index
      };
    })
  } : {
    i: common_vendor.t(((_j = $data.jobDetail) == null ? void 0 : _j.require_list) || "\u6682\u65E0\u8981\u6C42")
  }, {
    j: (_k = $data.jobDetail) == null ? void 0 : _k.address
  }, ((_l = $data.jobDetail) == null ? void 0 : _l.address) ? {
    k: common_vendor.t($data.jobDetail.district || ""),
    l: common_vendor.t($data.jobDetail.address)
  } : {}, {
    m: (_m = $data.jobDetail) == null ? void 0 : _m.welfare_list
  }, ((_n = $data.jobDetail) == null ? void 0 : _n.welfare_list) ? common_vendor.e({
    n: Array.isArray((_o = $data.jobDetail) == null ? void 0 : _o.welfare_list) && $data.jobDetail.welfare_list.length > 0
  }, Array.isArray((_p = $data.jobDetail) == null ? void 0 : _p.welfare_list) && $data.jobDetail.welfare_list.length > 0 ? {
    o: common_vendor.f($data.jobDetail.welfare_list, (welfare, index, i0) => {
      return {
        a: common_vendor.t(welfare),
        b: index
      };
    })
  } : {
    p: common_vendor.t((_q = $data.jobDetail) == null ? void 0 : _q.welfare_list)
  }) : {}, {
    q: (_r = $data.jobDetail) == null ? void 0 : _r.salary_desc
  }, ((_s = $data.jobDetail) == null ? void 0 : _s.salary_desc) ? {
    r: common_vendor.t($data.jobDetail.salary_desc)
  } : {}, {
    s: (_t = $data.jobDetail) == null ? void 0 : _t.publish_time
  }, ((_u = $data.jobDetail) == null ? void 0 : _u.publish_time) ? {
    t: common_vendor.t($options.formatDate($data.jobDetail.publish_time))
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/job/detail/job_detail_index.vue"]]);
wx.createPage(MiniProgramPage);
