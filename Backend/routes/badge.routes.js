module.exports = (app) => {
  const badge = require("../controllers/badge/badge.controller");
  const router = require("express").Router();

  router.post("/badge/assign", function (req, res) {
    badge.saveBadges(req, res);
  });

  app.use("/api", router);
};
