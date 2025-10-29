require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");

const dbConnection = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync(__dirname + "/ca.pem"),
  },
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
