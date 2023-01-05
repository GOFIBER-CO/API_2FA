const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
var cors = require("cors");
const app = express();
const puppeteer = require("puppeteer");

app.use(morgan("combined"));
app.use(cors());
app.options("*", cors());
app.use(fileUpload());
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT;
const profileRoute = require("./api/routes/profileRoute");
app.use("/api/profile", profileRoute);

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  console.log("Connected");
  console.log(socket, "hâhah");
  socket.conn.on("clientDisconnectedBrower", (data) => {
    console.log(data, "clientDisconnectedBrower");
  });
});

global._io = io;

server.listen(port, (req, res) => {
  console.log("server listening on port " + port);
  // init();
});
