"use strict";
var common_api_request = require("./request.js");
const jobApi = {
  getAllJobs: () => {
    return common_api_request.request({
      url: "/job/Job_List_all",
      method: "GET"
    });
  },
  getJobsByCategory: (categoryId) => {
    return common_api_request.request({
      url: "/job/job_lis_one_type",
      method: "POST",
      data: { category_id: categoryId }
    });
  },
  getJobsByCategoryAndType: (categoryId, empType) => {
    return common_api_request.request({
      url: "/job/job_list_two_given",
      method: "POST",
      data: { category_id: categoryId, emp_type: empType }
    });
  },
  searchJobs: (keyword) => {
    return common_api_request.request({
      url: "/job/job_search",
      method: "POST",
      data: { user_input: keyword }
    });
  },
  getJobDetail: (jobId) => {
    return common_api_request.request({
      url: "/job/job_details",
      method: "POST",
      data: { id: jobId }
    });
  }
};
exports.jobApi = jobApi;
