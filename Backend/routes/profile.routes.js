module.exports = (app) => {
  const profile = require("../controllers/profile/profile.controller");
  const router = require("express").Router();
  router.post("/profile/saveskills", function (req, res) {
    profile.saveSkills(req, res);
  });
  router.post("/profile/saveexperience", function (req, res) {
    profile.saveExperience(req, res);
  });
  router.post("/profile/saveeducation", function (req, res) {
    profile.saveEducation(req, res);
  });
  router.post("/profile/savepreferences", function (req, res) {
    profile.savePreferences(req, res);
  });
  router.post("/profile/savedescription", function (req, res) {
    profile.saveUserDescription(req, res);
  });
  router.get("/profile/userdetails", function (req, res) {
    profile.getUsersWithDetails(req, res);
  });
  router.post("/profile/userdetailsbyid", function (req, res) {
    profile.getUserDetails(req, res);
  });

  app.use("/api", router);
};
