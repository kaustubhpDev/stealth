const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const client = require("./config/dbConfig");
const server = require("http").createServer(app);
require("dotenv").config();
const { connection } = require("./config/Db");
const mongoose = require("mongoose");
// const auth = require("./routes/userRoutes");
const chat = require("./routes/messageRoutes");

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
// app.use("/auth", auth);
app.use("/chat", chat);

//routes
require("./routes/auth.routes")(app);
require("./routes/question.routes")(app);
require("./routes/takehome.routes")(app);
require("./routes/hrauth.routes")(app);
require("./routes/hrauth.routes")(app);

app.listen(port, () => {
  console.log(`server is running on port ${port}`), connection();
});

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
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
