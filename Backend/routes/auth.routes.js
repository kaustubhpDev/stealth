const { isAuthenticatedUser } = require("../middlewares/Auth");

module.exports = (app) => {
  const auth = require("../controllers/auth/auth.controller");
  var router = require("express").Router();

  router.post("/signup", function (req, res) {
    auth.signup(req, res);
  });
  router.post("/login", function (req, res) {
    auth.login(req, res);
  });
  router.get("/verifyuser", isAuthenticatedUser, function (req, res) {
    auth.verifyuser(req, res);
  });

  app.use("/api", router);
};
