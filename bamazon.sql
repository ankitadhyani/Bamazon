
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

    -- product_sales
    product_sales DECIMAL(10, 2) DEFAULT 0.0,

    -- make item_id the unique key of this table
    PRIMARY KEY (item_id)
);


-- create table 
CREATE TABLE departments(

    -- department_id
    department_id INTEGER NOT NULL AUTO_INCREMENT,

    -- department_name
    department_name VARCHAR(50) NOT NULL,

    -- over_head_costs (A dummy number you set for each department)
    over_head_costs DECIMAL(10, 2) NOT NULL,

    -- make department_id the unique key of this table
    PRIMARY KEY (department_id)

);
