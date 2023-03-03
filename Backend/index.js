const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = express();
const port = 3000;
const client = require("./config/dbConfig");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
require("./routes/auth.routes")(app);

app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(" db connected ");
  }
});
app.get("/", (request, response) => {
  response.json({ message: "hey , i'm uplevel's server" });
});
