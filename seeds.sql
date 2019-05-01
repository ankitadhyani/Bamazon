
USE bamazon_DB;


-- Insert rows with data into table 'products'
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ("Iphone X", "Electronics", 999.00, 200),
    ("Google home", "Electronics", 80.00, 50),
    ("xbox one", "Electronics", 499.00, 20),
    ("Dyson vaccum", "Home cleaning", 499.00, 10),
    ("Wall clock", "Home decor", 49.99, 49),
    ("Persian carpet", "Home decor", 300.00, 15),
    ("Pixel 3 phone", "Electronics", 899.98, 50),
    ("ipad mini 4", "Electronics", 300.00, 25),
    ("Mac book pro", "Electronics", 200.00, 20),
    ("Sectional sofa", "Furniture", 1200.49, 4);


-- Insert rows with data into table 'departments'
INSERT INTO departments (department_name, over_head_costs)
VALUES 
    ("Electronics", 10000),
    ("Home decor", 1000),
    ("Clothing", 60000);
