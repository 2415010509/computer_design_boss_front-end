"use strict";
const config = {
  development: {
    baseURL: "http://localhost:5000/api",
    staticURL: "http://localhost:5000"
  },
  production: {
    baseURL: "https://api.yourdomain.com/api",
    staticURL: "https://yourdomain.com"
  }
};
const env = "development";
var config$1 = config[env];
exports.config = config$1;
