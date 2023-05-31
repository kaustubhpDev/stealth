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
  router.post("/hr/filtercandidates", function (req, res) {
    hr.filterCandidates(req, res);
  });
  router.post("/hr/shortlistedjobs", function (req, res) {
    hr.getShortlistedJobs(req, res);
  });
  router.get("/hr/joblisted", function (req, res) {
    hr.getAllJobs(req, res);
  });
  router.post("/hr/joblistedbyhr", function (req, res) {
    hr.getAllHrJobs(req, res);
  });

  app.use("/api", router);
};
