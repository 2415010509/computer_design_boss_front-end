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
var common_vendor = require("../vendor.js");
var common_config = require("../config.js");
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: common_config.config.baseURL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: __spreadValues({
        "Content-Type": "application/json",
        "Authorization": common_vendor.index.getStorageSync("token") || ""
      }, options.header),
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data;
          if (data && typeof data === "object" && "code" in data && "data" in data) {
            if (data.code === 200) {
              resolve(data.data);
            } else {
              reject(data);
            }
          } else {
            resolve(data);
          }
        } else {
          console.error("HTTP\u8BF7\u6C42\u5931\u8D25:", res.statusCode, res.errMsg);
          reject(res.data || { error: `HTTP Error ${res.statusCode}` });
        }
      },
      fail: (err) => {
        console.error("\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25:", err);
        reject(err);
      }
    });
  });
};
exports.request = request;
