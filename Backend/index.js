const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = express();
const port = 3000;
const client = require("./config/dbConfig");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`server running on port ${port}.`);
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});
app.get("/", (request, response) => {
  response.json({ message: "hey , i am running" });
});
