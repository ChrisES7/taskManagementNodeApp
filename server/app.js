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
