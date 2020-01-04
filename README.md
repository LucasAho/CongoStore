# CongoStore
Amazon like storefront on CLI, done for week 12 of DU web dev bootcamp. This program will list an inventory of store items held in a mysql database and allow a user to select items to purchase. By "buying" an item, the user's command will also decrease the database inventory accordingly. To run your own version of the Congo Store, they will need to install the node packages inquirer and mysql, and follow the gifs at the base of the README to see Congo's functionality. User will also need their own database. 

## App Purpose and Function
This CLI allows a user to see listed store items and choose which items and how many of each item to buy. The user can use the app by typing 
    "node bamazonCustomer.js" which will be followed by a list of items with IDs.
    * User must enter a number from 1-10 corrosponding to each id
    * User will then be asked for a quantity of the item they plan to purchase
    * Finally, a user may either repeat the process and continue shopping, or checkout and get a receipt which includes costs and item names.

## File Infrastructure

    bamazonCustomer.js is the file which runs all front end user interaction, including inquirer and requests from the mysql database. 

    The CLI connects to a database named "bamazon_db" which holds the table "products". 

### Screenshots and Gifs of Functions

#### Customer Interface
Gif of shopping process             
* ![Gif of Customer App](https://github.com/LucasAho/CongoStore/blob/master/assets/bamazonGIF.gif)
