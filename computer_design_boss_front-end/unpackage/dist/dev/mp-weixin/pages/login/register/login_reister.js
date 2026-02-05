"use strict";
var __defProp = Object.defineProperty;
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
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      registerForm: {
        mobile: "",
        sms_code: "",
        password: "",
        confirm_password: ""
      },
      basicInfoForm: {
        real_name: "",
        gender: 0,
        birth_date: "",
        city: "",
        email: ""
      },
      educationForm: {
        degree: "",
        school_name: "",
        major: "",
        graduation_year: ""
      },
      cityOptions: [
        { value: "\u5317\u4EAC", text: "\u5317\u4EAC" },
        { value: "\u4E0A\u6D77", text: "\u4E0A\u6D77" },
        { value: "\u5E7F\u5DDE", text: "\u5E7F\u5DDE" },
        { value: "\u6DF1\u5733", text: "\u6DF1\u5733" },
        { value: "\u676D\u5DDE", text: "\u676D\u5DDE" },
        { value: "\u6210\u90FD", text: "\u6210\u90FD" },
        { value: "\u6B66\u6C49", text: "\u6B66\u6C49" },
        { value: "\u897F\u5B89", text: "\u897F\u5B89" },
        { value: "\u91CD\u5E86", text: "\u91CD\u5E86" },
        { value: "\u5357\u4EAC", text: "\u5357\u4EAC" }
      ],
      degreeOptions: [
        { value: "high_school", text: "\u9AD8\u4E2D" },
        { value: "college", text: "\u4E13\u79D1" },
        { value: "bachelor", text: "\u672C\u79D1" },
        { value: "master", text: "\u7855\u58EB" },
        { value: "doctor", text: "\u535A\u58EB" }
      ],
      jobIntentForm: {
        job_direction: "",
        expected_city: "",
        expected_salary_min: "",
        expected_salary_max: "",
        available_time: ""
      },
      registerStep: 2,
      loading: false
    };
  },
  computed: {
    isBasicInfoFormValid() {
      const { real_name, birth_date, city, email } = this.basicInfoForm;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const realNameValid = real_name.trim().length > 0;
      const birthDateValid = birth_date.trim().length > 0;
      const cityValid = city.trim().length > 0;
      const emailValid = email.trim() === "" || emailRegex.test(email);
      return realNameValid && birthDateValid && cityValid && emailValid;
    },
    isEducationFormValid() {
      const { degree, school_name, major, graduation_year } = this.educationForm;
      const degreeValid = degree.trim().length > 0;
      const schoolNameValid = school_name.trim().length > 0;
      const majorValid = major.trim().length > 0;
      const graduationYearValid = graduation_year.trim().length === 4 && !isNaN(graduation_year);
      return degreeValid && schoolNameValid && majorValid && graduationYearValid;
    },
    isJobIntentFormValid() {
      const { expected_salary_min, expected_salary_max } = this.jobIntentForm;
      if (expected_salary_min && isNaN(expected_salary_min)) {
        return false;
      }
      if (expected_salary_max && isNaN(expected_salary_max)) {
        return false;
      }
      return true;
    }
  },
  onLoad(options) {
    if (options.registerData) {
      this.registerForm = JSON.parse(decodeURIComponent(options.registerData));
    }
  },
  methods: {
    handleDegreeChange(e) {
      this.educationForm.degree = e.detail.value;
    },
    handleDateChange(e) {
      this.basicInfoForm.birth_date = e.detail.value;
    },
    handleCityChange(e) {
      this.basicInfoForm.city = e.detail.value;
    },
    nextRegisterStep() {
      if (this.registerStep === 2 && this.isBasicInfoFormValid) {
        this.registerStep = 3;
      } else if (this.registerStep === 3 && this.isEducationFormValid) {
        this.registerStep = 4;
      }
    },
    prevRegisterStep() {
      if (this.registerStep > 2) {
        this.registerStep--;
      } else {
        common_vendor.index.navigateBack();
      }
    },
    async completeRegister() {
      this.loading = true;
      try {
        const registerData = __spreadValues(__spreadValues(__spreadValues({
          mobile: this.registerForm.mobile,
          sms_code: this.registerForm.sms_code,
          password: this.registerForm.password
        }, this.basicInfoForm), this.educationForm), this.jobIntentForm);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockResponse = {
          code: 200,
          message: "\u6CE8\u518C\u6210\u529F",
          data: {
            token: "mock-jwt-token-987654321",
            user_info: {
              user_id: "987654321",
              mobile: this.registerForm.mobile,
              email: this.basicInfoForm.email,
              real_name: this.basicInfoForm.real_name,
              gender: this.basicInfoForm.gender,
              birth_date: this.basicInfoForm.birth_date,
              city: this.basicInfoForm.city,
              avatar_url: "",
              status: 1,
              job_status: 1,
              register_time: new Date().toISOString()
            },
            resume_info: {
              resume_id: "resume-001",
              user_id: "987654321",
              status: this.registerStep === 4 ? 1 : 0,
              create_time: new Date().toISOString(),
              education: {
                degree: this.educationForm.degree,
                school_name: this.educationForm.school_name,
                major: this.educationForm.major,
                graduation_year: this.educationForm.graduation_year
              },
              job_intent: this.registerStep === 4 ? {
                job_direction: this.jobIntentForm.job_direction,
                expected_city: this.jobIntentForm.expected_city,
                expected_salary_min: this.jobIntentForm.expected_salary_min,
                expected_salary_max: this.jobIntentForm.expected_salary_max,
                available_time: this.jobIntentForm.available_time
              } : null
            }
          }
        };
        if (mockResponse.code === 200) {
          common_vendor.index.setStorageSync("token", mockResponse.data.token);
          common_vendor.index.setStorageSync("userInfo", mockResponse.data.user_info);
          common_vendor.index.setStorageSync("resumeInfo", mockResponse.data.resume_info);
          common_vendor.index.showToast({
            title: mockResponse.message,
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index_index"
            });
          }, 1500);
        }
      } catch (error) {
        console.error("\u6CE8\u518C\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u6CE8\u518C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_uni_date_picker = common_vendor.resolveComponent("uni-date-picker");
  const _component_uni_data_picker = common_vendor.resolveComponent("uni-data-picker");
  (_component_uni_icons + _component_uni_date_picker + _component_uni_data_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.registerStep === 2
  }, $data.registerStep === 2 ? {
    b: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    }),
    c: $data.basicInfoForm.real_name,
    d: common_vendor.o(($event) => $data.basicInfoForm.real_name = $event.detail.value),
    e: $data.basicInfoForm.gender === 0 ? 1 : "",
    f: common_vendor.o(($event) => $data.basicInfoForm.gender = 0),
    g: $data.basicInfoForm.gender === 1 ? 1 : "",
    h: common_vendor.o(($event) => $data.basicInfoForm.gender = 1),
    i: $data.basicInfoForm.gender === 2 ? 1 : "",
    j: common_vendor.o(($event) => $data.basicInfoForm.gender = 2),
    k: common_vendor.p({
      type: "calendar",
      size: "24",
      color: "#999"
    }),
    l: common_vendor.o($options.handleDateChange),
    m: common_vendor.o(($event) => $data.basicInfoForm.birth_date = $event),
    n: common_vendor.p({
      type: "date",
      placeholder: "\u8BF7\u9009\u62E9\u51FA\u751F\u65E5\u671F",
      modelValue: $data.basicInfoForm.birth_date
    }),
    o: common_vendor.p({
      type: "location",
      size: "24",
      color: "#999"
    }),
    p: common_vendor.o($options.handleCityChange),
    q: common_vendor.o(($event) => $data.basicInfoForm.city = $event),
    r: common_vendor.p({
      localdata: $data.cityOptions,
      placeholder: "\u8BF7\u9009\u62E9\u6240\u5728\u57CE\u5E02",
      modelValue: $data.basicInfoForm.city
    }),
    s: common_vendor.p({
      type: "email",
      size: "24",
      color: "#999"
    }),
    t: $data.basicInfoForm.email,
    v: common_vendor.o(($event) => $data.basicInfoForm.email = $event.detail.value),
    w: common_vendor.o((...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args)),
    x: !$options.isBasicInfoFormValid,
    y: common_vendor.o((...args) => $options.nextRegisterStep && $options.nextRegisterStep(...args))
  } : {}, {
    z: $data.registerStep === 3
  }, $data.registerStep === 3 ? {
    A: common_vendor.p({
      type: "book",
      size: "24",
      color: "#999"
    }),
    B: common_vendor.o($options.handleDegreeChange),
    C: common_vendor.o(($event) => $data.educationForm.degree = $event),
    D: common_vendor.p({
      localdata: $data.degreeOptions,
      placeholder: "\u8BF7\u9009\u62E9\u5B66\u5386",
      modelValue: $data.educationForm.degree
    }),
    E: common_vendor.p({
      type: "office",
      size: "24",
      color: "#999"
    }),
    F: $data.educationForm.school_name,
    G: common_vendor.o(($event) => $data.educationForm.school_name = $event.detail.value),
    H: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#999"
    }),
    I: $data.educationForm.major,
    J: common_vendor.o(($event) => $data.educationForm.major = $event.detail.value),
    K: common_vendor.p({
      type: "calendar",
      size: "24",
      color: "#999"
    }),
    L: $data.educationForm.graduation_year,
    M: common_vendor.o(($event) => $data.educationForm.graduation_year = $event.detail.value),
    N: common_vendor.o((...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args)),
    O: !$options.isEducationFormValid,
    P: common_vendor.o((...args) => $options.nextRegisterStep && $options.nextRegisterStep(...args))
  } : {}, {
    Q: $data.registerStep === 4
  }, $data.registerStep === 4 ? {
    R: common_vendor.p({
      type: "briefcase",
      size: "24",
      color: "#999"
    }),
    S: $data.jobIntentForm.job_direction,
    T: common_vendor.o(($event) => $data.jobIntentForm.job_direction = $event.detail.value),
    U: common_vendor.p({
      type: "location",
      size: "24",
      color: "#999"
    }),
    V: $data.jobIntentForm.expected_city,
    W: common_vendor.o(($event) => $data.jobIntentForm.expected_city = $event.detail.value),
    X: $data.jobIntentForm.expected_salary_min,
    Y: common_vendor.o(($event) => $data.jobIntentForm.expected_salary_min = $event.detail.value),
    Z: $data.jobIntentForm.expected_salary_max,
    aa: common_vendor.o(($event) => $data.jobIntentForm.expected_salary_max = $event.detail.value),
    ab: common_vendor.p({
      type: "time",
      size: "24",
      color: "#999"
    }),
    ac: $data.jobIntentForm.available_time,
    ad: common_vendor.o(($event) => $data.jobIntentForm.available_time = $event.detail.value),
    ae: common_vendor.o((...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args)),
    af: common_vendor.o((...args) => $options.completeRegister && $options.completeRegister(...args)),
    ag: !$options.isJobIntentFormValid,
    ah: common_vendor.o((...args) => $options.completeRegister && $options.completeRegister(...args))
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1776d0fe"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/login/register/login_reister.vue"]]);
wx.createPage(MiniProgramPage);
