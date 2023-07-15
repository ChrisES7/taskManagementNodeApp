const express = require("express");
const app = express();
const cors = require("cors");
var path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql");
dotenv.config();
let dateNow = null;

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

app.listen(3308, console.log("Up and Running"));
