// Dependencies
const mysql = require("mysql");
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
connection.connect((err) => {
  if (err) throw err;
  runSearch();
});
// First prompt
// Calls functions with additional prompts based on selection
const runSearch = () => {
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
};
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
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    };

const deptSearch = () => {
  inquirer
    .prompt({
        name: 'employee',
        type: 'input',
        message: 'Which department would you like to search for?'
    }).then(answer => {
        const query = 'SELECT id, name FROM department WHERE ?';
    
        connection.query(query, { employee: answer.employee }, (err, data) => {
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    });
    };

const managerSearch = () => {
  inquirer
    .prompt({
        name: 'employee',
        type: 'input',
        message: 'Which manager would you like to search for?'
    }).then(answer => {
        const query = 'SELECT id, first_name, last_name FROM employee WHERE ?';

        connection.query(query, { id: answer.id }, (err, data) => {
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    });
    };

const addEmployee = () => {
  inquirer
    .prompt({
        name: 'employee',
        type: 'input',
        message: 'Which manager would you like to search for?'
    }).then(answer => {
        const query = 'SELECT id, name FROM department WHERE ?';
    
        connection.query(query, { id: answer.id }, (err, data) => {
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    });
    };

const removeEmployee = () => {
  inquirer
    .prompt({
        name: 'employee',
        type: 'input',
        message: 'Which manager would you like to search for?'
    }).then(answer => {
        const query = 'SELECT id, name FROM department WHERE ?';
    
        connection.query(query, { id: answer.id }, (err, data) => {
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    });
    };

const updateRole = () => {
  inquirer
    .prompt({
        name: 'employee',
        type: 'input',
        message: 'Which manager would you like to search for?'
    }).then(answer => {
        const query = 'SELECT id, name FROM department WHERE ?';
    
        connection.query(query, { id: answer.id }, (err, data) => {
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    });
    };

const updateManager = () => {
  inquirer
    .prompt({
        name: 'employee',
        type: 'input',
        message: 'Which manager would you like to search for?'
    }).then(answer => {
        const query = 'SELECT id, name FROM department WHERE ?';
    
        connection.query(query, { id: answer.id }, (err, data) => {
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    });
    };