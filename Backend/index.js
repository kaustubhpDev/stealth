const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = express();
const cors = require("cors");
const port = 8081;
const client = require("./config/dbConfig");

//app definitions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//routes
require("./routes/auth.routes")(app);
require("./routes/question.routes")(app);

app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to postgres");
  }
});
app.get("/", (request, response) => {
  response.json({ message: "hey , i'm uplevel's server" });
});
