"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "JobCard",
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    formatSalary(min, max) {
      if (min && max) {
        return `${(min / 1e3).toFixed(0)}-${(max / 1e3).toFixed(0)}K`;
      }
      return "\u85AA\u8D44\u9762\u8BAE";
    },
    goToDetail(data) {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail/index?id=${data.id}`
      });
    },
    getCompanyName(data) {
      const companyMap = {
        "1": "\u82B1\u65D7\u91D1\u878D\u4FE1\u606F\u670D\u52A1\uFF08\u4E2D\u56FD\uFF09\u6709\u9650\u516C\u53F8",
        "2": "\u4E2D\u56FD\u79FB\u52A8\u901A\u4FE1\u6709\u9650\u516C\u53F8\u5728\u7EBF\u8425\u9500\u670D\u52A1\u4E2D\u5FC3",
        "3": "Victoria's Secret"
      };
      return companyMap[data.company_id] || "\u672A\u77E5\u516C\u53F8";
    },
    getJobTags(data) {
      if (data.welfare_list) {
        return Array.isArray(data.welfare_list) ? data.welfare_list : JSON.parse(data.welfare_list);
      }
      return ["\u4E94\u9669\u4E00\u91D1", "\u5F39\u6027\u5DE5\u4F5C", "\u5E26\u85AA\u5E74\u5047"];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.data.title),
    b: common_vendor.t($options.formatSalary($props.data.salary_min, $props.data.salary_max)),
    c: common_vendor.t($options.getCompanyName($props.data)),
    d: common_vendor.t($props.data.exp_req || "\u7ECF\u9A8C\u4E0D\u9650"),
    e: common_vendor.t($props.data.edu_req || "\u5B66\u5386\u4E0D\u9650"),
    f: common_vendor.f($options.getJobTags($props.data), (tag, k0, i0) => {
      return {
        a: common_vendor.t(tag),
        b: tag
      };
    }),
    g: common_vendor.t($props.data.city_name || "\u57CE\u5E02"),
    h: common_vendor.o(($event) => _ctx.$emit("click", $props.data))
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0b59c612"], ["__file", "D:/.aboss/computer_design_boss/computer_design_boss_front-end/component/job/job-card.vue"]]);
wx.createComponent(Component);
