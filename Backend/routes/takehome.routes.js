module.exports = (app) => {
  const takehomeassignment = require("../controllers/takehome/takehome.controller");
  const router = require("express").router;

  router.post(
    "/takehomeassignment/submit",
    takehomeassignment.savetakehomeassignment
  );
  app.use("/api", router);
};
