# Bamazon

This project gives user an option to select one of the following views-
1. Customer
2. Manager
3. Supervisor

### Customer view:
* This view displays all the items for sale in 'products' table.
* If user wantes to buy an item from the list he/she should enter the item id (based on the table data) and no. of units to be bought.
* The above operation continues till the point user exits.


### Manager view:
* Here the manager is given 4 operations to select from-

1. View Products for Sale
2. View Low Inventory
3. Add to Inventory
4. Add New Product

### Supervisor view:
* Here the supervisor is given 2 operations to select from-

1. View Product Sales by Department
2. Create New Department



At the completion of each operation, the application will ask the user if he/she wants to run the application again using 'inquirer' prompt or exit.



## Technologies used

Built with Node.js, Express and mySQL. 


## Run application
$ npm install
[Create DB]
$ node bamazon.js



## Screenshots
![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/01_Bamazon_HomePage.png "Bamazon_HomePage")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/02_Bamazon_CustomerView.png "Bamazon_CustomerView")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/03_Bamazon_CustomerView_BuyItem.png "Bamazon_CustomerView_BuyItem")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/04_Bamazon_ManagerView.png "Bamazon_ManagerView")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/05_Bamazon_ManagerView_ViewProductsForSale.png "Bamazon_ManagerView_ViewProductsForSale")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/06_Bamazon_ManagerView_ViewLowInventory.png "Bamazon_ManagerView_ViewLowInventory")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/07_Bamazon_ManagerView_AddToInventory.png "Bamazon_ManagerView_AddToInventory")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/08_Bamazon_ManagerView_AddNewProduct.png "Bamazon_ManagerView_AddNewProduct")

![alt text](https://github.com/ankitadhyani/Bamazon/blob/master/snapshots/09_Bamazon_SupervisorView_Complete.png "Bamazon_SupervisorView_Complete")



