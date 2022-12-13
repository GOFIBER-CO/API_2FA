const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
var cors = require("cors");
const app = express();

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

//import routes
app.use("/api/user", userRoute);

app.use("/api/secret", secretRouter);

const server = require("http").Server(app);

server.listen(port, (req, res) => {
  console.log("server listening on port " + port);
});
