// Include the mysql npm package
var mysql = require("mysql");

// Include the inquirer npm package
var inquirer = require("inquirer");

// Include the dotenv npm package
require('dotenv').config();

// connect to your database using mysql.createConnection()
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: process.env.DB_PWD,
    database: "bamazon_DB"
});

//Export bamazonSupervisorView() API to other js files
exports.supervisorView = bamazonSupervisorView();



/*************************************************************************************************
 * Function: bamazonSupervisorView()
 * This function gives the entry point to the Supervisor view
 * View Product Sales by Department" || "Create New Department"
 *************************************************************************************************/

function bamazonSupervisorView() {

    //console.log("Inside bamazonSupervisorView()");

    //Take user input
    inquirer.prompt({
        type: "list",
        message: "Enter your choice?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit app"],
        name: "view"
    })
    .then(function (inquirerResponse) {

        //Call function with user option to execute desired operation
        switch (inquirerResponse.view) {

            case 'View Product Sales by Department':
                viewProductSalesByDepartment();
                break;

            case 'Create New Department':
                createNewDepartment();
                break;

            default:
                console.log("\n\n\tExiting the app!!\n\n");
                connection.end();
                
        }

    })
    .catch(function (err) {
        console.log(err);
    });

} //End of bamazonSupervisorView()




/*************************************************************************************************
 * Function: viewProductSalesByDepartment()
 * When a supervisor selects View Product Sales by Department, the app should display a summarized 
 * table in their terminal/bash window
 *************************************************************************************************/

function viewProductSalesByDepartment() {

    let queryString = "SELECT ANY_VALUE(d.department_id) AS department_id, d.department_name AS department_name, "; queryString += "ANY_VALUE(d.over_head_costs) AS over_head_costs, SUM(p.product_sales) as product_sales, ";queryString += "ANY_VALUE(SUM(p.product_sales) - ANY_VALUE(d.over_head_costs)) AS total_profit ";
    queryString += "FROM departments d LEFT JOIN products p ";
    queryString += "ON (d.department_name = p.department_name) ";
    queryString += "WHERE d.department_name = p.department_name";
    queryString += " GROUP BY d.department_name";

    // console.log(queryString);

    let query = connection.query(queryString, function (err, res) {

        if (err) throw err;


        console.log("\n\n");
        console.log("\t\t\t\t\t\t---- View Product Sales by Department ---- \n");

        console.log("\tdepartment_id" + "\t|\t" + "department_name" + "\t\t|\t" + "over_head_costs" + "\t\t|\t" + "product_sales" + "\t|\t" + "total_profit");

        console.log("\t-------------" + "\t|\t" + "---------------" + "\t\t|\t" + "---------------" + "\t\t|\t" + "-------------" + "\t|\t" + "------------");

        res.forEach(data =>
            console.log("\t" + data.department_id + "\t\t|\t" + data.department_name + "\t\t|\t" + data.over_head_costs + "\t\t\t|\t" + data.product_sales.toFixed(2) + "\t\t|\t" + data.total_profit.toFixed(2)) 
        );

        //Call supervisor view
        console.log("\n\n");
        bamazonSupervisorView();
    });

} //End of viewProductSalesByDepartment()





/*************************************************************************************************
 * Function: createNewDepartment()
 * 
 *************************************************************************************************/

async function createNewDepartment() {

    // console.log("Inside createNewDepartment()");
    console.log("\n\n");

    const newDepartmentInfo = await addNewDepartmentPrompt();

    const queryString = "INSERT INTO departments SET ?";

    const query = connection.query(queryString, newDepartmentInfo, function (err, res) {

        if (err) throw err;

        console.log("\n\n\tDepartment successfully created in database!");

        //Call supervisor view
        console.log("\n\n");
        return bamazonSupervisorView();;
    });

} //End of createNewDepartment()


//Function that takes in a new department info -----------------
function addNewDepartmentPrompt() {

    // ask user for information about new department to be inserted into database
    return inquirer.prompt([
        {
            name: "department_name",
            message: "Department name:",
            type: "input",
            validate: function (inputValue) {
                if (inputValue !== "") {
                    return true;
                } else {
                    return "Please provide a department name";
                }
            }
        },
        {
            name: "over_head_costs",
            message: "Over head costs:",
            type: "input",
            validate: function (inputValue) {
                if (!isNaN(inputValue) && inputValue >= 0) {
                    return true;
                } else {
                    return "Please provide a valid over head cost";
                }
            }
        }
    ]);

} //End of addNewDepartmentPrompt()