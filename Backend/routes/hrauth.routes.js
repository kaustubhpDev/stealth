module.exports = (app) => {
  const hr = require("../controllers/auth/hrauth.controller");
  const router = require("express").Router();

  // HR Signup
  router.post("/hr/signup", function (req, res) {
    hr.signup(req, res);
  });

  // HR Login
  router.post("/hr/login", function (req, res) {
    hr.login(req, res);
  });

  app.use("/api", router);
};
