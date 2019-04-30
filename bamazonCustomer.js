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


console.log("**************************************************************");
console.log("*                      B A M A Z O N                         *");
console.log("**************************************************************");
console.log("\n");

//Call function to start the application
startApp();

/*************************************************************************************************
 * Function: startApp()
 * This function gives user the choise which view the user wants to see (Customer/Manager)
 *************************************************************************************************/

function startApp() {

    //Take user input
    inquirer.prompt({
            type: "list",
            message: "Enter your choice of Bamazon-View?",
            choices: ["Manager", "Customer"],
            name: "view"
        })
        .then(function (inquirerResponse) {

            //Call function with user option to execute desired operation
            switch (inquirerResponse.view) {

                case 'Manager':
                
                    console.log("--------------------------------------------------------------");
                    console.log("|                      MANAGER VIEW                          |");
                    console.log("--------------------------------------------------------------");
                    console.log("\n");

                    // Include the bamazonManager.js file
                    const manager = require('./bamazonManager');

                    //Call managerView() function from bamazonManager.js file
                    // manager.managerView();
                    break;

                case 'Customer':
                    customerView();
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


/*************************************************************************************************
 * Function: customerView()
 * This function displays all items in sale and lets user select an item to buy
 *************************************************************************************************/

function customerView() {

    console.log("--------------------------------------------------------------");
    console.log("|                      CUSTOMER VIEW                         |");
    console.log("--------------------------------------------------------------");
    console.log("\n");

    let queryString = "SELECT * FROM products";

    let query = connection.query(queryString, function (err, res) {

        if (err) throw err;

        console.log("\n\nItems available for sale:\n");

        console.log("\tITEM ID" + "\t|\t" + "ITEM NAME" + "\t\t|\t" + "ITEM PRICE");
        console.log("\t-------" + "\t|\t" + "---------" + "\t\t|\t" + "----------");

        res.forEach(item =>
            console.log(item.item_id + "\t|\t" + item.product_name + "\t\t|\t" + parseFloat(item.price)));


        console.log("\n\nWhich item would you like to buy?\n");

        // Using inquirer to ask user for information about which product they want to buy
        inquirer.prompt([{
                //Ask user the item ID of the product they would like to buy
                name: "item_id",
                type: "input",
                message: "Enter Item Id:",
                validate: function (itemIdInput) {
                    if (!isNaN(itemIdInput)) {

                        //TO-DO: Check to see whether the Item id entered is withing the range

                        return true;
                    } else {
                        return "Please provide a valid item id!";
                    }
                }
            },
            {
                // Ask how many units of the product user would like to buy
                name: "noOfUnites",
                message: "How many units you would like to buy?",
                type: "input",
                validate: function (noOfUnites) {
                    if (!isNaN(noOfUnites)) {
                        return true;
                    } else {
                        return "Please enter a valid quantity!";
                    }
                }
            }
        ]).then(function (itemInfo) {

            queryString = `SELECT * FROM products WHERE item_id=${itemInfo.item_id}`;

            query = connection.query(queryString, function (err, buyResp) {

                if (err) throw err;

                // console.log(buyResp);

                // Check if the store has enough of the product to meet the customer's request
                if (buyResp[0].stock_quantity < itemInfo.noOfUnites) {
                    // console.log(buyResp[0].stock_quantity + " || " + itemInfo.noOfUnites);
                    console.log(`Insufficient quantity of ${buyResp[0].product_name} in stock!`);
                } else {
                    //Update the SQL database to reflect the remaining quantity
                    buyResp[0].stock_quantity -= itemInfo.noOfUnites;

                    //Once the update goes through, show the customer the total cost of their purchase.
                    const totalCostOfPurchase = itemInfo.noOfUnites * buyResp[0].price;
                    console.log("\nThank you, your order has been placed.");
                    console.log(`\nTotal cost of your purchase of ${itemInfo.noOfUnites} unit(s) of '${buyResp[0].product_name}' is $${totalCostOfPurchase}.`);
                }
                //Start app again for user to buy other items
                customerView();

            });

            // logs the actual query being run
            // console.log(query.sql);

        });
        // connection.end();
    })

}