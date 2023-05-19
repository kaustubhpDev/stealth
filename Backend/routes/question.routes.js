module.exports = (app) => {
  const question = require("../controllers/questions/questions.controller");
  const router = require("express").Router();

  router.post("/questions/addquestion", function (req, res) {
    question.addQuestion(req, res);
  });

  app.use("/api", router);
};
