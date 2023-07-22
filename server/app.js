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
  let passedVariable = req.query.valid;
  console.log("Passed Variable :");
  console.log(passedVariable);
  if (passedVariable == "loggedIn") {
    folder = "loggedIn";
  } else if (passedVariable == "undefined") {
    folder = "notLoggedIn";
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
// maybe the url is not always / because i sendfile

app.post("/createUser", (req, res) => {
  let userName = req.body.usernameRegistered;
  let email = req.body.emailRegistered;
  let password = req.body.passwordRegistered;

  let dateObj = new Date();
  // let month = dateObj.getUTCMonth() + 1; //months from 1-12
  // let day = dateObj.getUTCDate();
  // let year = dateObj.getUTCFullYear();
  // let dateCreated = year + month + day;

  let nbTasks = 0;
  // params is what is sent through the browser
  // body is sent through javascript
  // query is sent by html form elements
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
      "INSERT INTO users (username,user_password,user_email,dateCreated,nbTasks) VALUES (?,?,?,?,?)";
    const values = [userName, password, email, dateObj, nbTasks];

    connection.query(query, values, (err, result) => {
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

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Your logic to verify the login credentials against the MySQL database

  // Perform a database query and compare the entered username and password
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
      "SELECT * FROM users WHERE username = ? AND user_password = ?";
    const values = [username, password];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error executing the query:", err);
        res.status(500).send("Error executing the query");
        return;
      }

      // Process the results
      if (results.length > 0) {
        // The login credentials are correct
        // res.send("Login successful");
        res.redirect("/?valid=loggedIn");
      } else {
        // Invalid login credentials
        res.status(401).send("Invalid username or password");
      }
    });
  });
});

// this gets all the results from mysql and turns them into json,
// they then get fetched from javascript and sent into another route
// that redirects it to a file.
app.get("/getUserTasks/:id", (req, res) => {
  const id = req.params.id;
  console.log("Posted Login");

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
    // get username from params from url?
    const query = "SELECT * FROM tasks WHERE user_id = ?";
    connection.query(query, id, (err, result) => {
      console.log(result);
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error inserting data into MySQL database: " + err.stack);
        res.status(500).send("Error inserting data into MySQL database.");
        return;
      }
      console.log("Data gotten from MySQL database.");
      res.json(result); // Send the result as JSON response
    });
  });
});

app.get("/getUsername/:id", (req, res) => {
  const id = req.params.id;
  console.log("getting username");

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
    // get username from params from url?
    const query = "SELECT username FROM users WHERE user_id = ?";
    connection.query(query, id, (err, result) => {
      console.log(result);
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error inserting data into MySQL database: " + err.stack);
        res.status(500).send("Error inserting data into MySQL database.");
        return;
      }
      console.log("Data gotten from MySQL database.");
      res.json(result); // Send the result as JSON response
    });
  });
});

app.get("/loggedIn", (req, res) => {
  res.sendFile(`./frontEndFiles/loggedIn/index.html`, {
    root: path.join(__dirname, "../"),
  });
});

app.put("/editTask/:userId/:taskId/", (req, res) => {});

app.listen(3308, console.log("Up and Running"));
