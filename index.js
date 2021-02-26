// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
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
        // Queries database
        const query = 'SELECT role.id, employee.first_name, employee.last_name, role.title, role.department_id, role.salary, employee.manager_id FROM role JOIN employee ON role.id = employee.id WHERE ?';
        // If error occurs, throw error
        // Otherwise, show the table with data in the console
        // Then return to first prompt
        connection.query(query, { id: answer.id }, (err, data) => {
            if(err) throw err;
            console.table(data);
            runSearch();
        });
    
    };

    const deptSearch = () => {
        ​   inquirer.prompt({
            name: 'employee',
            type: 'input',
            message: 'Which department would you like to search for?'
        }).then(answer => {
            const query = 'SELECT id, name FROM department WHERE ?';
        
            connection.query(query, { id: answer.id }, (err, data) => {
                if(err) throw err;
                console.table(data);
                runSearch();
            });
        });
        };
