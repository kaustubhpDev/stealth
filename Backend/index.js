const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = express();
const cors = require("cors");
const port = 8081;
const client = require("./config/dbConfig");
const server = require("http").createServer(app);

//app definitions
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors());

//routes
require("./routes/auth.routes")(app);
require("./routes/question.routes")(app);
require("./routes/takehome.routes")(app);

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
