module.exports = (app) => {
  const auth = require("../controllers/auth/auth.controller");
  var router = require("express").Router();

  router.post("/signup", function (req, res) {
    auth.signup(req, res);
  });
  router.post("/login", function (req, res) {
    auth.login(req, res);
  });

  app.use("/api", router);
};
