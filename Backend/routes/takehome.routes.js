module.exports = (app) => {
  const takehomeassignment = require("../controllers/takehome/takehome.controller");
  const router = require("express").Router();

  router.post("/assignment/save", function (req, res) {
    takehomeassignment.savetakehomeassignment(req, res);
  });

  app.use("/api", router);
};
