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

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "kikoso17",
  database: "todolist",
  authPlugin: "mysql_native_password",
  multipleStatements: true,
});

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
  // params is what is sent through the browser
  // const id = req.params.id;
  // const editName = req.params.name;
  // console.log(req.query.name);
  // console.log("editName: " + editName);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(
        "Error getting connection from MySQL database pool: " + err.stack
      );
      res
        .status(500)
        .send("Error getting connection from MySQL database pool.");
      return;
    }

    const query =
      "INSERT INTO users (user_id,username,user_password,user_email,dateCreated,nbTasks) VALUES (?,?,?,?,?)";
    const values = [userName, password, email, dateCreated, nbTasks];

    connection.query(query, values, (err, result) => {
      connection.release();

      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error inserting data into MySQL database: " + err.stack);
        res.status(500).send("Error inserting data into MySQL database.");
        return;
      }
      console.log("Data inserted into MySQL database.");
      //res.status(200).send("Data presnted from MySQL database.");

      // res.sendFile("index.html", { root: path.join(__dirname, "../") });
      res.redirect("/");
    });
  });
});

app.get("/login", (req, res) => {
  res.sendFile(`./frontEndFiles/notLoggedIn/login/login.html`, {
    root: path.join(__dirname, "../"),
  });
});

app.listen(3308, console.log("Up and Running"));
