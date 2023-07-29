const express = require("express");
const app = express();
const cors = require("cors");
var path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql");
dotenv.config();
let dateNow = null;
const session = require("express-session");

const mime = require("mime");
// Set up session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: true,
  })
);
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

// Define a custom middleware function to check the session ID
function checkSession(req, res, next) {
  // Check if the session ID is undefined or not present
  if (!req.session || !req.session.userId) {
    // User is not logged in, redirect to the home page or login page
    return res.redirect("/"); // Replace "/" with the URL of your home page or login page
  }

  // User is logged in, continue to the next middleware or route handler
  next();
}

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
  const { username, password, user_id } = req.body;

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
        req.session.userId = user_id;
        console.log("ID : " + req.session.userId);
        res.json({ userId: user_id }); // Sending the userId as JSON response
      } else {
        // Invalid login credentials
        res.status(401).send("Invalid username or password");
      }
    });
  });
});
app.get("/getUserId/:username", (req, res) => {
  let username = req.params.username;
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
    const query = "SELECT user_id FROM users WHERE username = ?";
    connection.query(query, username, (err, result) => {
      // console.log(result);
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

app.get("/getSessionId/", checkSession, (req, res) => {
  const userId = req.session.userId;

  // Use the userId as needed
  console.log("User ID:", userId);

  // Render the destination page
  res.json({ userId: userId });
});

// this gets all the results from mysql and turns them into json,
// they then get fetched from javascript and sent into another route
// that redirects it to a file.
app.get("/getUserTasks/:id", checkSession, (req, res) => {
  const id = req.params.id;
  console.log("Posted Login");
  console.log(id);
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
      // console.log(result);
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

app.get("/getUserTask/:user_id/:task_id", checkSession, (req, res) => {
  const user_id = req.params.user_id;
  const task_id = req.params.task_id;
  console.log("User Task " + task_id);

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
    const query = "SELECT * FROM tasks WHERE user_id = ? AND task_id = ?";
    const values = [user_id, task_id];
    connection.query(query, values, (err, result) => {
      // console.log(result);
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

app.get("/getUsername/:id", checkSession, (req, res) => {
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

app.get("/loggedIn/", checkSession, (req, res) => {
  res.sendFile(`./frontEndFiles/loggedIn/index.html`, {
    root: path.join(__dirname, "../"),
  });
});

app.put("/editTask/:userId/:taskId/", (req, res) => {
  const userId = req.params.userId;
  const taskId = req.params.taskId;

  const { taskTitle, taskDescription, dayDoneBy } = req.body;
  console.log(
    userId +
      " " +
      taskId +
      " " +
      taskTitle +
      " " +
      taskDescription +
      " " +
      dayDoneBy
  );
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
      "UPDATE tasks SET taskTitle = ?,taskDescription = ?,toBeDoneBy = ? WHERE user_id = ? AND task_id = ? ";
    const values = [taskTitle, taskDescription, dayDoneBy, userId, taskId];
    console.log("VALUES : " + values);
    connection.query(query, values, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error searching data in MySQL database: " + err.stack);
        res.status(500).send("Error searching data in MySQL database.");
        return;
      }

      res.json(result); // Return the matching results as JSON
    });
  });
});

app.delete("/deleteTask/:userId/:taskId/", checkSession, (req, res) => {
  const userId = req.params.userId;
  const taskId = req.params.taskId;

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

    const query = "DELETE FROM tasks WHERE user_id = ? AND task_id = ? ";
    const values = [userId, taskId];
    console.log("VALUES : " + values);
    connection.query(query, values, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error searching data in MySQL database: " + err.stack);
        res.status(500).send("Error searching data in MySQL database.");
        return;
      }

      res.json(result); // Return the matching results as JSON
    });
  });
});

app.post("/createTask/", checkSession, (req, res) => {
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
    let user_id = req.body.userId;
    let taskName = req.body.taskName;
    let taskDesc = req.body.taskDesc;
    let doneBy = req.body.dateToBeDoneBy;
    let taskCreated = req.body.taskCreated;
    console.log(req.body.taskCreated);
    console.log(req.body.dateToBeDoneBy);
    console.log(user_id);
    const values = [user_id, taskName, taskDesc, taskCreated, doneBy];

    const query =
      "INSERT INTO tasks (user_id,taskTitle,taskDescription,dayCreated,toBeDoneBy) VALUES (?,?,?,?,?)";
    connection.query(query, values, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error inserting data into MySQL database: " + err.stack);
        res.status(500).send("Error inserting data into MySQL database.");
        return;
      }
      res.redirect(`/?valid=loggedIn`);
      // res.status(200).send("Data presnted from MySQL database.");
    });
  });
});

app.listen(3308, console.log("Up and Running"));
