module.exports = (app) => {
  const question = require("../controllers/questions/questions.controller");
  const router = require("express").router;

  router.post("/questions/addquestion", question.addQuestions);

  app.use("/api", router);
};
