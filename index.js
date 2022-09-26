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
  menuPrompt();
};

// "main menu" prompt
const menuPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuSelect",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      const { menuSelect } = answer;

      if (menuSelect === "View All Employees") {
        console.log("You chose view all employees.");
      }

      if (menuSelect === "Add Employee") {
        console.log("You chose add employee.");
      }

      if (menuSelect === "Update Employee Role") {
        console.log("You chose update employee role.");
      }

      if (menuSelect === "View All Roles") {
        console.log("You chose view all roles");
      }

      if (menuSelect === "Add Role") {
        console.log("You chose add role");
      }

      if (menuSelect === "View All Departments") {
        console.log("You chose view all departments");
      }

      if (menuSelect === "Add Department") {
        console.log("You chose add department");
      }

      if (menuSelect === "Quit") {
        console.log("You chose to quit. Goodbye!");
        connection.end();
      }
    });
};
