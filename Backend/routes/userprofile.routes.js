module.exports = (app) => {
  const userprofile = require("../controllers/userprofile/userprofile.controller");
  const router = require("express").router;

  router.post("/user/saveprofile", userprofile.saveprofile);

  app.use("/api", router);
};
    