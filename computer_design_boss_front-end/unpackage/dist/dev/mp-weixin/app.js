"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/login/register/login_reister.js";
  "./pages/login/forget/login_forget.js";
  "./pages/index/index_index.js";
  "./pages/job/detail/job_detail_index.js";
  "./pages/job/add/job_add_index.js";
  "./pages/user/user_index.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/App.vue"]]);
const uniIcons = () => "./node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const uniDatePicker = () => "./node-modules/@dcloudio/uni-ui/lib/uni-datetime-picker/uni-datetime-picker.js";
const uniDataPicker = () => "./node-modules/@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker.js";
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.component("uni-icons", uniIcons);
  app.component("uni-date-picker", uniDatePicker);
  app.component("uni-data-picker", uniDataPicker);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
