module.exports = (app) => {
  const hr = require("../controllers/hr/hr.controller");
  const router = require("express").Router();

  router.post("/hr/createjob", function (req, res) {
    hr.createJob(req, res);
  });

  router.post("/hr/addcandidate", function (req, res) {
    hr.saveInterviewedCandidate(req, res);
  });

  router.post("/hr/shortlist", function (req, res) {
    hr.saveShortlistedCandidate(req, res);
  });
  router.get("/hr/goblistedbyhr", function (req, res) {
    hr.getAllJobs(req, res);
  });

  app.use("/api", router);
};
