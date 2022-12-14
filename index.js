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
        viewEmployees();
      }

      if (menuSelect === "Add Employee") {
        console.log("You chose add employee.");
        addEmployee();
      }

      if (menuSelect === "Update Employee Role") {
        console.log("You chose update employee role.");
        updateRole();
      }

      if (menuSelect === "View All Roles") {
        console.log("You chose view all roles");
        viewRoles();
      }

      if (menuSelect === "Add Role") {
        console.log("You chose add role");
        addRole();
      }

      if (menuSelect === "View All Departments") {
        console.log("You chose view all departments");
        viewDepartments();
      }

      if (menuSelect === "Add Department") {
        console.log("You chose add department");
        addDepartment();
      }

      if (menuSelect === "Quit") {
        console.log("You chose to quit. Goodbye!");
        connection.end();
      }
    });
};

//function to view all employees
viewEmployees = () => {
  const sql = `SELECT employees.id, 
    employees.first_name, 
    employees.last_name, 
    role.title, 
    department.department_name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employees
    LEFT JOIN role ON employees.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    menuPrompt();
  });
};

//function to add employee
addEmployee = () => {
  connection.query("SELECT * FROM employees", (err, emplSel) => {
    if (err) throw err;
    const employeeSelect = [
      {
        name: "None",
        value: 0,
      },
    ];
    emplSel.forEach(({ first_name, last_name, id }) => {
      employeeSelect.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    connection.query("SELECT * FROM role", (err, roleSel) => {
      if (err) throw err;
      const roleSelect = [];
      roleSel.forEach(({ title, id }) => {
        roleSelect.push({
          name: title,
          value: id,
        });
      });

      let questions = [
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "role_id",
          choices: roleSelect,
          message: "What is the employee's role?",
        },
        {
          type: "list",
          name: "manager_id",
          choices: employeeSelect,
          message: "Who is the employee's manager?",
        },
      ];

      inquirer
        .prompt(questions)
        .then((response) => {
          const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?)`;
          let manager_id =
            response.manager_id !== 0 ? response.manager_id : null;
          connection.query(
            query,
            [
              [
                response.first_name,
                response.last_name,
                response.role_id,
                manager_id,
              ],
            ],
            (err, res) => {
              if (err) throw err;
              console.log(
                `Succesfully added employee ${response.first_name} ${response.last_name} with id ${res.insertId}`
              );
              menuPrompt();
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
};

//function to update employee rolee
updateRole = () => {
  connection.query("SELECT * FROM employees", (err, emplSel) => {
    if (err) throw err;
    const employeeSelect = [];
    emplSel.forEach(({ first_name, last_name, id }) => {
      employeeSelect.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    connection.query("SELECT * FROM role", (err, roleSel) => {
      if (err) throw err;
      const roleSelect = [];
      roleSel.forEach(({ title, id }) => {
        roleSelect.push({
          name: title,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeSelect,
          message: "Whose role do you want to update?",
        },
        {
          type: "list",
          name: "role_id",
          choices: roleSelect,
          message: "What is the employee's new role?",
        },
      ];

      inquirer
        .prompt(questions)
        .then((response) => {
          const query = `UPDATE employees SET ? WHERE ?? = ?;`;
          connection.query(
            query,
            [{ role_id: response.role_id }, "id", response.id],
            (err, res) => {
              if (err) throw err;

              console.log("Succesfully updated employee's role.");
              menuPrompt();
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
};

//function to view all roles
viewRoles = () => {
  const sql = `SELECT role.id, role.title, department.department_name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    menuPrompt();
  });
};

//function to add role
addRole = () => {
  const depSelect = [];
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    res.forEach((dep) => {
      let questO = {
        name: dep.department_name,
        department_id: dep.id,
      };
      depSelect.push(questO);
    });

    let questions = [
      {
        type: "input",
        name: "title",
        message: "What is the new role's title?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the new role's salary?",
      },
      {
        type: "list",
        name: "department",
        choices: depSelect,
        message: "What department does this role belong to?",
      },
    ];

    inquirer
      .prompt(questions)
      .then((response) => {
        const query = `INSERT INTO role (title, salary, department_id) VALUES (?)`;
        connection.query(
          query,
          [[response.title, response.salary, response.deparment]],
          (err, res) => {
            if (err) throw err;
            console.log(
              `Succesfully added ${response.title} role at id ${res.insertId}`
            );
            menuPrompt();
          }
        );
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

//function to view all departments
viewDepartments = () => {
  const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    menuPrompt();
  });
};

//function to add department
addDepartment = () => {
  let questions = [
    {
      type: "input",
      name: "department_name",
      message: "What is the new department name?",
    },
  ];

  inquirer
    .prompt(questions)
    .then((response) => {
      const query = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(query, [response.department_name], (err, res) => {
        if (err) throw err;
        console.log(
          `Succesfully added ${response.department_name} department as id ${res.insertId}`
        );
        menuPrompt();
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
