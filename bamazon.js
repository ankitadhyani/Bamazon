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


console.log("************************************************************************");
console.log("*                           B A M A Z O N                              *");
console.log("************************************************************************");
console.log("\n");

//Call function to start the application
startApp();


/******************************************************************************************************
 * Function: startApp()
 * This function gives user the choise which view the user wants to see (Customer/Manager/Supervisor)
 ******************************************************************************************************/

function startApp() {

    //Take user input
    inquirer.prompt({
            type: "list",
            message: "Enter your choice of Bamazon-View?",
            choices: ["Customer", "Manager", "Supervisor"],
            name: "view"
        })
        .then(function (inquirerResponse) {

            //Call function with user option to execute desired operation
            switch (inquirerResponse.view) {

                case 'Customer':

                    console.log("------------------------------------------------------------------------");
                    console.log("|                           CUSTOMER VIEW                              |");
                    console.log("------------------------------------------------------------------------");
                    console.log("\n");

                    // Include the bamazonCustomer.js file
                    require('./bamazonCustomer');
                    break;

                case 'Manager':

                    console.log("------------------------------------------------------------------------");
                    console.log("|                           MANAGER VIEW                               |");
                    console.log("------------------------------------------------------------------------");
                    console.log("\n");

                    // Include the bamazonManager.js file
                    require('./bamazonManager');
                    break;

                case 'Supervisor':

                    console.log("------------------------------------------------------------------------");
                    console.log("|                         SUPERVISOR VIEW                              |");
                    console.log("------------------------------------------------------------------------");
                    console.log("\n");

                    // Include the bamazonSupervisor.js file
                    require('./bamazonSupervisor');
                    break;

                default:
                    console.log("Incorrect user input!!");
                    startApp();
            }

        })
        .catch(function (err) {
            console.log(err);
        });


} //End of startApp()
