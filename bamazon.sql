
-- create database 
DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

-- create table 
CREATE TABLE products(

    -- item_id (unique id for each product)
    item_id INTEGER NOT NULL AUTO_INCREMENT,

    -- product_name (Name of product)
    product_name VARCHAR(50) NOT NULL,

    -- department_name
    department_name VARCHAR(50) NOT NULL,

    -- price (cost to customer)
    price DECIMAL(10, 2) NOT NULL,

    -- stock_quantity (how much of the product is available in stores)
    stock_quantity INTEGER NOT NULL,

    -- make item_id the unique key of this table
    PRIMARY KEY (item_id)
);

-- Insert rows with data into table
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ("Iphone X", "electronics", 999.00, 200),
    ("Google home", "electronics", 80.00, 50),
    ("xbox one", "electronics", 499.00, 20),
    ("Dyson vaccum", "home cleaning", 499.00, 10),
    ("Wall clock", "home decor", 49.99, 49),
    ("Persian carpet", "home decor", 300.00, 15),
    ("Pixel 3 phone", "electronics", 899.98, 50),
    ("ipad mini 4", "tablet", 300.00, 25),
    ("Mac book pro", "electronics", 200.00, 20),
    ("Sectional sofa", "furniture", 1200.49, 4);
