USE employee_trackerDB;
-- Data for department table
INSERT INTO department (id, name) values (1, "Sales"), (2, "Legal"), (3, "IT"), (4, "Finance"), (5, "Marketing"), (6, "Engineering");

-- Data for role table
INSERT INTO role (id, title, salary, department_id) values (1, "Salesperson", 80000, 1), (2, "Lawyer", 190000, 2), (3, "Software Engineer", 120000, 6), (4, "Accountant", 125000, 4), (5, "Manager", 100000, 1), (6, "Administrator", 90000, 3);

-- Data for employee table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) values (1, "John", "Doe", 1, 5), (2, "Ashley", "Chan", 5), (3, "Mike", "Rodriguez", 1, 5), (4, "Kevin", "Tupik", 6, 6), (5, "Malia", "Brown", 4), (6, "Sarah", "Lourd", 2), (7, "Tom", "Allen", 2)
