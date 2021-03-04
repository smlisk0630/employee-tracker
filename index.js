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
      return;
    });
  return;
}
// Returns joined table of employees (joining all 3 tables)
// Then returns to first prompt
const employeeSearch = () => {
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

// Functions to view employees by dept
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

// Function to get employees
async function getEmployees() {
  return await connection.query(
    `SELECT employee.id,  employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) LEFT JOIN employee manager ON (manager.id = employee.manager_id);`
  );
}

// Function to get all roles
async function getRoles() {
  return await connection.query(`SELECT * FROM role;`);
}

// Functions to view employees by manager
async function getAllManagers() {
  // Gets all employee managers and groups by manager id
  return await connection.query(
    "SELECT employee.manager_id, employee.first_name, employee.last_name FROM employee LEFT JOIN role ON role.department_id = department_id GROUP BY employee.manager_id, employee.first_name, employee.last_name"
  );
}
async function getEmployeesByManager(manager) {
  return connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.manager_id AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE manager_id = ?;",
    manager
  );
}
async function managerSearch() {
  let mangr = [];
  let managerChoices;
  mangr = await getEmployees();
  managerChoices = await mangr.map(({ first_name, last_name, id }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { employee } = await inquirer.prompt({
    name: "employee",
    type: "list",
    message: "Which manager would you like to search for?",
    choices: managerChoices,
  });
  const managers = await // Passes in employee from line 152
  getEmployeesByManager(employee);
  console.table(managers);
  runSearch();
}

async function addAnEmployee(employee) {
  // add employee
  return await connection.query(
    "INSERT INTO employee SET ?",
    employee
  );
}

// Functions to add employee
async function addEmployee() {
  const employee = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employee's last name?",
    },
    {
      name: "empRole",
      type: "list",
      message: "What is the employee's role?",
      choices: [
        "Sales Lead",
        "Salesperson",
        "Lead Engineer",
        "Software Engineer",
        "Account Manager",
        "Accountant",
        "Legal Team Lead",
        "Lawyer",
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
    },
  ]);
  // Contains rows from the role and employee tables
  const allRoles = await getRoles();
  const allManagers = await getAllManagers();
  // Filters through all roles and managers and returns employee title (role) and manager's name
  const filterRole = allRoles.filter(
    (role) => role.title === employee.empRole
  )[0];
  const filterManager = allManagers.filter(
    (manager) =>
      manager.first_name + " " + manager.last_name === employee.empMang
  )[0];
  // Sets id and manager id properties from filter variables as id properties for employee object
  employee.role_id = filterRole.id;
  employee.manager_id = filterManager.manager_id;
  // Deletes empRole and empMang properties from employee object
  delete employee.empRole;
  delete employee.empMang;

  await addAnEmployee(employee);
  const allEmployees = await getEmployees();
  console.table(allEmployees);
  runSearch();
}

// Functions to remove employee
async function removeEmployee(employee) {
  return await connection.query(
    "DELETE FROM employee WHERE id = ?;", employee
  );
}

async function removeanEmployee() {
let emps = [];
let deleteChoice;
deleteChoice = await emps.map(({ first_name, last_name, id }) => ({
  name: `${first_name} ${last_name}`,
  value: id,
}));
const { employee } = await inquirer.prompt({
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
    });
const employees = await // Passes in employee from line 152
removeEmployee(employee);
console.table(employees);
runSearch();
}
//Functions to update employee role
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

// Functions to update employee manager
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
