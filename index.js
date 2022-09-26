//Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

require("dotenv").config();

//connect to databse
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected: " + connection.threadId);
  connected();
});

//runs after connected to database
connected = () => {
  console.log("***********************************");
  console.log("*                                 *");
  console.log("*        EMPLOYEE MANAGER         *");
  console.log("*                                 *");
  console.log("***********************************");
};
