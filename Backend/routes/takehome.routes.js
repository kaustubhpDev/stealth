module.exports = (app) => {
  const takehomeassignment = require("../controllers/takehome/takehome.controller");
  const router = require("express").Router();

  router.post("/assignment/save", function (req, res) {
    takehomeassignment.savetakehomeassignment(req, res);
  });

  router.get("/assignment/getassignments", function (req, res) {
    takehomeassignment.getAllAssignments(req, res);
  });

  app.use("/api", router);
};
