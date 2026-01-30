"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null
    };
  },
  onShow() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
    },
    login() {
      common_vendor.index.showToast({
        title: "\u767B\u5F55\u529F\u80FD\u5F00\u53D1\u4E2D",
        icon: "none"
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.login && $options.login(...args)),
    b: common_vendor.p({
      type: "person",
      size: "30",
      color: "#666"
    }),
    c: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    d: common_vendor.p({
      type: "clock",
      size: "30",
      color: "#666"
    }),
    e: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    f: common_vendor.p({
      type: "settings",
      size: "30",
      color: "#666"
    }),
    g: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss/computer_design_boss/computer_design_boss_front-end/pages/user/index.vue"]]);
wx.createPage(MiniProgramPage);
