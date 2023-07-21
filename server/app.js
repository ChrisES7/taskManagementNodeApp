const express = require("express");
const app = express();
const cors = require("cors");
var path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql");
dotenv.config();
let dateNow = null;

const mime = require("mime");

app.use(
  express.static("public", {
    setHeaders: (res, filePath) => {
      console.log(filePath);
      if (mime.getType(filePath) === "text/html") {
        res.setHeader("Content-Type", "text/html");
      } else if (mime.getType(filePath) === "text/css") {
        res.setHeader("Content-Type", "text/css");
      } else if (mime.getType(filePath) === "application/javascript") {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

app.use(express.static(__dirname + "/../"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let loggedIn = false;
let folder = "loggedIn";

app.get("/", (req, res) => {
  if (loggedIn) {
    folder = "loggedIn";
  } else {
    folder = "notLoggedIn";
  }

  res.sendFile(`./frontEndFiles/${folder}/index.html`, {
    root: path.join(__dirname, "../"),
  });
});

app.get("/register", (req, res) => {
  res.sendFile(`./frontEndFiles/notLoggedIn/register/register.html`, {
    root: path.join(__dirname, "../"),
  });
});

app.post("/createUser", (req, res) => {
  let userName = req.body.usernameRegistered;
  let email = req.body.emailRegistered;
  let password = req.body.passwordRegistered;

  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  let dateCreated = year + month + day;

  let nbTasks = 0;
});

app.get("/login", (req, res) => {
  res.sendFile(`./frontEndFiles/notLoggedIn/login/login.html`, {
    root: path.join(__dirname, "../"),
  });
});

app.listen(3308, console.log("Up and Running"));
