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
const userRoute = require("./api/routes/authentication/userRoute");
const secretRouter = require("./api/routes/secretRoute");
const groupRouter = require("./api/routes/groupRoute");
const groupProfileRouter = require("./api/routes/groupProfileRouter");
const roleRoute = require("./api/routes/roleRoute");
const actionRoute = require("./api/routes/actionRoute");
const roleActionRoute = require("./api/routes/roleActionRoute");
const postRoute = require("./api/routes/postRoute");
const categoryRoute = require("./api/routes/categoryRoute");
const tagRoute = require("./api/routes/tagRoute");
const bannerRoute = require("./api/routes/bannerRoute");
const appRoute = require("./api/routes/appRoute");
const menuRoute = require("./api/routes/menuRoute");
const feedbackRoute = require("./api/routes/feedbackRoute");
const shortCodeRoute = require("./api/routes/shortCodeRoute");
const schemaRoute = require("./api/routes/schemaRoute");
const profileRoute = require("./api/routes/profileRoute");

// const appRoute = require("./api/routes/appRoute");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//import routes
app.use("/api/role", roleRoute);
app.use("/api/action", actionRoute);
app.use("/api/roleaction", roleActionRoute);
app.use("/api/post", postRoute);
app.use("/api/category", categoryRoute);
app.use("/api/tag", tagRoute);
app.use("/api/banner", bannerRoute);
app.use("/api/menu", menuRoute);
app.use("/api/app", appRoute);
app.use("/api/shortcode", shortCodeRoute);
app.use("/api/schema", schemaRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/app", appRoute);
app.use("/api/profile", profileRoute);

//import routes
app.use("/api/user", userRoute);

app.use("/api/secret", secretRouter);
app.use("/api/group", groupRouter);
//Group profile
app.use("/api/group-profile", groupProfileRouter);
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  console.log("Connected");
});

global._io = io;

server.listen(port, (req, res) => {
  console.log("server listening on port " + port);
});
