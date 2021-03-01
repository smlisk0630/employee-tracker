// Dependencies
const mysql = require("mysql");
const util = require("util");
const inquirer = require("inquirer");
require("console.table");
// Creates database connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345678",
  database: "employee_trackerDB",
});
// Throws error if error occurs; otherwise calls runSearch()
connection.connect();
connection.query = util.promisify(connection.query).bind(connection);
// First prompt
runSearch();
// Calls functions with additional prompts based on selection
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          employeeSearch();
          break;

        case "View All Employees by Department":
          deptSearch();
          break;

        case "View All Employees by Manager":
          managerSearch();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Manager":
          updateManager();
          break;

        case "Exit":
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
}
// Returns joined table of employees (joining all 3 tables)
// Then returns to first prompt
const employeeSearch = (answer) => {
  console.log(answer);
  // Queries database
  const query = `SELECT employee.id,  employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) LEFT JOIN employee manager ON (manager.id = employee.manager_id)`;
  // If error occurs, throw error
  // Otherwise, show the table with data in the console
  // Then return to first prompt
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    runSearch();
  });
};
async function getAllDepartments() {
  return await connection.query(
    "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
  );
}
async function getEmployeesByDept(department) {
  return connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
    department
  );
}
async function deptSearch() {
  let dept = [];
  let deptChoices;
  dept = await getAllDepartments();
  deptChoices = await dept.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { department } = await inquirer.prompt({
    name: "department",
    type: "list",
    message: "Which department would you like to search for?",
    choices: deptChoices,
  });
  const employees = await getEmployeesByDept(department);
  console.table(employees);
  runSearch();
}

// const managerSearch = () => {
//   inquirer
//     .prompt({
//         name: 'employee',
//         type: 'input',
//         message: 'Which manager would you like to search for?'
//     }).then(answer => {
//         const query = 'SELECT id, first_name, last_name FROM employee WHERE ?';

//         connection.query(query, { id: answer.id }, (err, data) => {
//             if(err) throw err;
//             console.table(data);
//             runSearch();
//         });
//     });
//     };

const addEmployee = () => {
  inquirer
    .prompt(
      {
        name: "fname",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lname",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "empRole",
        type: "list",
        message: "What is the employee's role?",
        choices: [
          "Salesperson",
          "Lawyer",
          "Software Engineer",
          "Accountant",
          "Manager",
          "Administrator",
        ],
      },
      {
        name: "empMang",
        type: "list",
        message: "Who is the employee's manager?",
        choices: [
          "John Doe",
          "Ashley Chan",
          "Mike Rodriguez",
          "Kevin Tupik",
          "Malia Brown",
          "Sarah Lourd",
          "Tom Allen",
        ],
      }
    )
    .then((answer) => {
      const query = `INSERT INTO employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) LEFT JOIN employee manager ON (manager.id = employee.manager_id)`;

      connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        runSearch();
      });
    });
};

const removeEmployee = () => {
  inquirer
    .prompt({
      name: "employee",
      type: "input",
      message: "Which employee would you like to remove?",
      choices: [
        "John Doe",
        "Ashley Chan",
        "Mike Rodriguez",
        "Kevin Tupik",
        "Malia Brown",
        "Sarah Lourd",
        "Tom Allen",
      ],
    })
    .then((answer) => {
      const query = `DELETE FROM employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) LEFT JOIN employee manager ON (manager.id = employee.manager_id)`;

      connection.query(query, { id: answer.id }, (err, data) => {
        if (err) throw err;
        console.table(data);
        runSearch();
      });
    });
};

// const updateRole = () => {
//   inquirer
//     .prompt({
//         name: 'employee',
//         type: 'input',
//         message: 'Which manager would you like to search for?'
//     }).then(answer => {
//         const query = 'SELECT id, name FROM department WHERE ?';

//         connection.query(query, { id: answer.id }, (err, data) => {
//             if(err) throw err;
//             console.table(data);
//             runSearch();
//         });
//     });
//     };

// const updateManager = () => {
//   inquirer
//     .prompt({
//         name: 'employee',
//         type: 'input',
//         message: 'Which manager would you like to search for?'
//     }).then(answer => {
//         const query = 'SELECT id, name FROM department WHERE ?';

//         connection.query(query, { id: answer.id }, (err, data) => {
//             if(err) throw err;
//             console.table(data);
//             runSearch();
//         });
//     });
//     };
