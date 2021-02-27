USE employee_trackerDB;
-- Data for department table
INSERT INTO department (name) values ("Sales"), ("Legal"), ("IT"), ("Finance"), ("Marketing"), ("Engineering");

-- Data for role table
INSERT INTO role (title, salary, department_id) values ("Salesperson", 80000, 1), ("Lawyer", 190000, 2), ("Software Engineer", 120000, 6), ("Accountant", 125000, 4), ("Manager", 100000, 1), ("Administrator", 90000, 3);

-- Data for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ("John", "Doe", 1, 5), ("Ashley", "Chan", 5, 5), ("Mike", "Rodriguez", 1, 5), ("Kevin", "Tupik", 6, 6), ("Malia", "Brown", 4, 5), ("Sarah", "Lourd", 2, 5), ("Tom", "Allen", 2, 5);