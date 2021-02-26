USE employee_trackerDB;
-- Data for department table
INSERT INTO department (name) values ("Sales"), ("Legal"), ("IT"), ("Finance"), ("Marketing"), ("Engineering");

-- Data for role table
INSERT INTO role (title, salary) values ("Salesperson", 80000), ("Lawyer", 190000), ("Software Engineer", 120000), ("Accountant", 125000), ("Manager", 100000), ("Administrator", 90000);

-- Data for employee table
INSERT INTO employee (first_name, last_name) values ("John", "Doe"), ("Ashley", "Chan"), ("Mike", "Rodriguez"), ("Kevin", "Tupik"), ("Malia", "Brown"), ("Sarah", "Lourd"), ("Tom", "Allen")
