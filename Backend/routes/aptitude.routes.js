module.exports = (app) => {
  const aptitude = require("../controllers/aptitude/aptitude.controller");
  const router = require("express").router;

  router.post("/aptitude/submit", aptitude.saveAptitudeResult);

  app.use("/api", router);
};
