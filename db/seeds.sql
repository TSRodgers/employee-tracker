INSERT INTO department
    (department_name)
values
    ("Administration"),
    ("Development"), 
    ("Marketing"), 
    ("Human Resources"), 
    ("Customer Service"), 
    ("Accounting");

SELECT * FROM department;

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("CEO", 999999, 1),
    ("SR. Dev", 130000, 2),
    ("JR. Dev", 60000, 2),
    ("Regional Sales Manager", 150000, 3),
    ("Salesperson", 75000, 3),
    ("HR Manager", 130000, 4),
    ("HR Recruiter", 77000, 4),
    ("Customer Experience Specialist", 50000, 5),
    ("Customer Service Agent", 30000, 5),
    ("Director of acounting", 170000, 6),
    ("Accountant", 70000, 6);

SELECT * FROM role;

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Traci", "Halcomb", 1, null),
    ("Lila", "Ramos", 2, 1),
    ("Yvonne", "Hayes", 3, 2),
    ("Patrick", "Maillet", 4, 1),
    ("Mark", "Bassham", 5, 4),
    ("Michael", "Elsner", 6, 1),
    ("Janet", "Barnhill", 7, 6),
    ("Rita", "Kendall", 8, 1),
    ("Tania", "Feinstein", 9, 1),
    ("Andy", "Bryant", 10, 1),
    ("Joanne", "Roberts", 11, 10);

SELECT * FROM employees;