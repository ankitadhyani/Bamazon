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

//Export bamazonCustomerView() API to other js files
exports.customerView = bamazonCustomerView();



/*************************************************************************************************
 * Function: bamazonCustomerView()
 * This function displays all items in sale and lets user select an item to buy
 *************************************************************************************************/

function bamazonCustomerView() {

    //console.log("Inside bamazonCustomerView()");

    let queryString = "SELECT * FROM products";

    let query = connection.query(queryString, function (err, res) {

        if (err) throw err;

        console.log("\t\t---- Items available for sale ---- \n");

        console.log("\t" + "ITEM ID" + "\t|\t" + "ITEM NAME" + "\t\t|\t" + "ITEM PRICE");
        console.log("\t" + "-------" + "\t|\t" + "---------" + "\t\t|\t" + "----------");

        res.forEach(item =>
            console.log("\t" + item.item_id + "\t|\t" + item.product_name + "\t\t|\t" + item.price.toFixed(2))
        );

        console.log("\n\n");

        //Use inquirer to ask user if user would like to run the app again to buy an item or exit
        inquirer
            .prompt({
                name: 'runAgain',
                type: 'confirm',
                message: 'Do you want to buy items?',
                default: true
            })
            .then(function (userReponse) {

                if (userReponse.runAgain) {

                    //Call function to buy an item from the sales items list
                    buyItem();
                } else {
                    console.log("\n\n\tExiting the app!!\n\n");
                    connection.end();
                }
            })
            .catch(function (err) {
                console.log(err);
            });

    });

} //End of bamazonCustomerView()




/*************************************************************************************************
 * Function: buyItem()
 * This function lets user select an item to buy and no of units to buy
 *************************************************************************************************/

async function buyItem() {

    // console.log("Inside buyItem()");

    console.log("\n\nWhich item would you like to buy?\n");

    // Use inquirer to ask user for information about which product they want to buy
    const itemInfo = await getItemIdAndUnitsToBuyPrompt();


    let queryString = `SELECT * FROM products WHERE item_id= ?`;

    let query = await connection.query(queryString, itemInfo.item_id, function (err, buyResp) {

        if (err) throw err;

        // console.log(buyResp);

        // Check if the store has enough of the product to meet the customer's request
        if (buyResp[0].stock_quantity < itemInfo.noOfUnites) {

            // console.log(buyResp[0].stock_quantity + " || " + itemInfo.noOfUnites);
            console.log(`\n\n\tInsufficient quantity of ${buyResp[0].product_name} in stock!`);

            //Call customer view
            console.log("\n");
            bamazonCustomerView();

        } else {

            //Update the SQL database to reflect the remaining quantity
            let updatedStockQuantity = parseInt(buyResp[0].stock_quantity) - parseInt(itemInfo.noOfUnites);
            //console.log("updatedStockQuantity = " + updatedStockQuantity);


            //Once the update goes through, show the customer the total cost of their purchase.
            const totalCostOfPurchase = parseInt(itemInfo.noOfUnites) * parseFloat(buyResp[0].price);


            //Update the SQL database to reflect the added quantity
            queryString = `UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?`;

            query = connection.query(queryString, [updatedStockQuantity, totalCostOfPurchase, itemInfo.item_id], function (err, res) {

                if (err) throw err;


                console.log("\n\nThank you, your order has been placed.");
                console.log(`\nTotal cost of your purchase of ${itemInfo.noOfUnites} unit(s) of '${buyResp[0].product_name}' is $${totalCostOfPurchase.toFixed(2)}.`);

                console.log("\n\nBuy more items...");

                //Call customer view
                console.log("\n");
                bamazonCustomerView();
            });

        }

    });

} //End of buyItem()





/*************************************************************************************************
 * Function: getItemIdAndUnitsToBuyPrompt()
 * Function that uses inquirer to ask user for information about which product they want 
 * to buy and what quantity
 *************************************************************************************************/

function getItemIdAndUnitsToBuyPrompt() {

    // console.log("Inside getItemIdAndUnitsToBuyPrompt()");

    return inquirer.prompt([{
            //Ask user the item ID of the product they would like to buy
            name: "item_id",
            type: "input",
            message: "Enter Item Id:",
            validate: function (itemIdInput) {
                //Check to see whether the Item id entered is a number and within the range
                if (!isNaN(itemIdInput)) {

                    // console.log("\n isItemIsInRange = " + isItemIsInRange(itemIdInput));

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
    ]);

} //End of getItemIdAndUnitsToBuyPrompt()



/*************************************************************************************************
 * Function: isItemIsInRange(itemIdInput)
 * Function that checks to see whether the item id entered by the user is a valid item id 
 *************************************************************************************************/

async function isItemIsInRange(itemIdInput) {

    // let inRange = false;

    // console.log("Inside isItemIsInRange(itemIdInput)");

    let queryString = `SELECT * FROM products WHERE item_id = ?`;

    let query = await connection.query(queryString, itemIdInput, function (err, resp) {

        if (err) throw err;

        // If user gets a response for the input item id then return true else return false
        if (resp[0]) {

            console.log("\nValid data");
            // inRange = true;
            return true;

        } else {
            console.log("\nIn-Valid data");
            return false;
        }

    });

    // return inRange;

} //End of isItemIsInRange(itemIdInput)