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

//Export bamazonManagerView() API to other js files
exports.managerView = bamazonManagerView();

/*************************************************************************************************
 * Function: managerView()
 * This function gives the entry point to the Manager to select which option Manager would 
 * like to go with
 * "View Products for Sale" || "View Low Inventory" || "Add to Inventory" || "Add New Product"
 *************************************************************************************************/

function bamazonManagerView() {

    //Take user input
    inquirer.prompt({
            type: "list",
            message: "Enter your choice?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit app"],
            name: "view"
        })
        .then(function (inquirerResponse) {

            //Call function with user option to execute desired operation
            switch (inquirerResponse.view) {

                case 'View Products for Sale':
                    viewProductsForSale(true);
                    break;

                case 'View Low Inventory':
                    viewLowInventory();
                    break;

                case 'Add to Inventory':
                    addToInventory();
                    break;

                case 'Add New Product':
                    addNewProduct();
                    break;

                default:
                    console.log("\n\n\tExiting the app!!\n\n");
                    connection.end();

            }

        })
        .catch(function (err) {
            console.log(err);
        });

} //End of bamazonManagerView()


/*************************************************************************************************
 * Function: viewProductsForSale(runMgrView)
 * runMgrView : true/false
 * The app should list every available item: the item IDs, names, prices, and quantities.
 *************************************************************************************************/

function viewProductsForSale(runMgrView, cb) {

    // console.log("Inside viewProductsForSale()");

    let queryString = "SELECT * FROM products";

    let query = connection.query(queryString, function (err, res) {

        if (err) throw err;

        console.log("\n\n");
        console.log("\t\t\t\t---- Products for sale ---- \n");

        console.log("\tITEM ID" + "\t\t|\t" + "ITEM NAME" + "\t\t|\t" + "ITEM PRICE" + "\t|\t" + "QUANTITY");
        console.log("\t-------" + "\t\t|\t" + "---------" + "\t\t|\t" + "----------" + "\t|\t" + "--------");

        res.forEach(item =>
            console.log("\t" + item.item_id + "\t\t|\t" + item.product_name + "\t\t|\t" + item.price.toFixed(2) + "\t\t|\t" + item.stock_quantity)
        );

        if (runMgrView) {
            //Call manager view
            console.log("\n\n");
            bamazonManagerView();
        } else {
            cb();
        }

    });


} //End of viewProductsForSale()


/*************************************************************************************************
 * Function: viewLowInventory()
 * This function will list all items with an inventory count lower than five.
 *************************************************************************************************/

function viewLowInventory() {

    // console.log("Inside viewLowInventory()");

    let queryString = "SELECT * FROM products WHERE stock_quantity < 5";

    let query = connection.query(queryString, function (err, res) {

        if (err) throw err;

        console.log("\n\n");
        console.log("\t\t\t---- Low Inventory Products ---- \n");

        console.log("\t" + "ITEM ID" + "\t\t|\t" + "ITEM NAME" + "\t\t|\t" + "QUANTITY");
        console.log("\t" + "-------" + "\t\t|\t" + "---------" + "\t\t|\t" + "--------");

        res.forEach(item =>
            console.log("\t" + item.item_id + "\t\t|\t" + item.product_name + "\t\t|\t" + item.stock_quantity)
        );

        //Call manager view
        console.log("\n\n");
        bamazonManagerView();

    });
} //End of viewLowInventory()


/*************************************************************************************************
 * Function: addToInventory()
 * This function should display a prompt that will let the manager "add more" of any item 
 * currently in the store.
 *************************************************************************************************/

function addToInventory() {

    // console.log("Inside addToInventory()");

    //Ask Manager which product he wants to add more to
    console.log("\n\nWhich item would you like to add more to?\n");

    //Display all the items for sale to the Manager
    viewProductsForSale(false, async function () {
        console.log("\n\n");

        const itemInfo = await addToInventoryPrompt();

        let queryString = `SELECT * FROM products WHERE item_id=${itemInfo.item_id}`;

        let query = connection.query(queryString, function (err, res) {

            if (err) throw err;

            console.log("\n\n");

            const productName = res[0].product_name;
            let updatedStockQuantity = parseInt(res[0].stock_quantity) + parseInt(itemInfo.noOfUnites);

            //Update the SQL database to reflect the added quantity
            let queryString = `UPDATE products SET stock_quantity = ? WHERE item_id = ?`;

            let query = connection.query(queryString, [updatedStockQuantity, itemInfo.item_id], function (err, res) {

                if (err) throw err;

                console.log(`\n\tStock Quantity increased to ${updatedStockQuantity} for ${productName}.`);

                //Call manager view
                console.log("\n\n");
                bamazonManagerView();

            });

        });
    });



} //End of addToInventory()


//Function that takes in item id and its respective no of units to be added to the stock -----------------
async function addToInventoryPrompt() {

    return inquirer.prompt([{
            //Ask user the item ID of the product they would like to buy
            name: "item_id",
            type: "input",
            message: "Item Id?",
            validate: async function (itemIdInput) {
                //Check to see whether the Item id entered is a number and within the range
                if (!isNaN(itemIdInput)) {

                    const inRange = await isItemInRange(itemIdInput);
                    // console.log("\n isItemInRange = " + inRange);
                    if(inRange)
                        return true;

                } else {
                    return "Please provide a valid item id!";
                }
            }
        },
        {
            // Ask how many units of the product manager would like to add
            name: "noOfUnites",
            message: "How much quantity you would like to add?",
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

} //End of addToInventoryPrompt()

/*************************************************************************************************
 * Function: addNewProduct()
 * This function allows the manager to add a completely new product to the store.
 *************************************************************************************************/


async function addNewProduct() {

    // console.log("Inside addNewProduct()");
    console.log("\n");
    const newItemInfo = await addNewProductPrompt();


    const queryString = "INSERT INTO products SET ?";

    const query = connection.query(queryString, newItemInfo, function (err, res) {

        if (err) throw err;

        console.log("\n\n\tItem successfully created in database!");

        //Call manager view
        console.log("\n\n");
        return bamazonManagerView();;
    });


} //End of addNewProduct()


//Function that takes in a new item for sale -----------------
function addNewProductPrompt() {

    // ask user for information about new item to be inserted into database
    return inquirer.prompt([{
            name: "product_name",
            message: "Product name:",
            type: "input",
            validate: function (inputValue) {
                if (inputValue !== "") {
                    return true;
                } else {
                    return "Please provide a product name";
                }
            }
        },
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
            name: "price",
            message: "Price:",
            type: "input",
            validate: function (inputValue) {
                if (!isNaN(inputValue) && inputValue >= 0) {
                    return true;
                } else {
                    return "Please provide a valid price";
                }
            }
        },
        {
            name: "stock_quantity",
            message: "Stock Quantity:",
            type: "input",
            validate: function (inputValue) {
                if (!isNaN(inputValue) && inputValue >= 0) {
                    return true;
                } else {
                    return "Please provide a valid quantity";
                }
            }
        }
    ]);

}// End of addNewProductPrompt()


/*************************************************************************************************
 * Function: isItemIsInRange(itemIdInput)
 * Function that checks to see whether the item id entered by the user is a valid item id 
 *************************************************************************************************/

function isItemInRange(itemIdInput) {

    // console.log("Inside isItemIsInRange(itemIdInput)");

    return new Promise((resolve,reject) => {

        let queryString = `SELECT * FROM products WHERE item_id = ?`;

        let query = connection.query(queryString, [itemIdInput], function (err, resp) {

            if (err) {
                console.log(err);
                return reject(err);
            }

            // If user gets a response for the input item id then return true else return false
            if (resp[0]) {

                // console.log("\nValid data");
                return resolve(true)

            } else {
                // console.log("\nIn-Valid data");
                return resolve(false);
            }

        });

    });
    

} //End of isItemIsInRange(itemIdInput)