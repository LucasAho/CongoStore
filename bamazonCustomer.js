//Node packages required
var inquirer = require("inquirer");
var mysql = require("mysql");

//Connection to mysql 
var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "gitsql",
    database: "bamazon_db"
});

//Starts init function with connection
connection.connect(err => {
    if (err) throw err;
    runFunc();
});

//Function displays user receipt
receiptDisplay = () => {
        var totalCost = receipt.Cost.reduce((a, b) => a + b, 0);
        console.log(receipt, "Total cost: " + totalCost.toFixed(2));
        connection.end()
}

//Receipt object starts as empty
var receipt = {
    Item: [],
    Cost: []
}

//Constructor builds a receipt as user shops.
function StonkMath (id, name, amt, cost) {
    this.id = id;
    this.productName = name;
    this.amtRequested = amt;
    this.costPerUnit = cost;
    this.transactionCost = amt * cost;
}

//Function updates mysql database
updateStonk = (num, id) => {
    connection.query("SELECT * FROM products WHERE ID = ?", [id], err=> {
        if (err) throw err;
        connection.query("UPDATE products SET stock_quantity = ? WHERE ID = ?" , [num,id], function(err) {
            if (err) throw err;
        });    
    });    
}

//Function checks if user would like to checkout
pathCheck = () => {
    inquirer.prompt({
        message: "Item added to cart. Would you like to continue shopping?",
        name: "ShopPath",
        type: "confirm",
        default: false
    }).then (ans => {
        switch (ans.ShopPath) {
            case ans.ShopPath = false:
                receiptDisplay();
                break;
            case ans.ShopPath = true:
                firstPrompt();
                break;
        }
    }); 
}

//Function checks for suffiecient quantity and then notifies user or adds item to cart
stonkCheck = (id , num) => {
    
    connection.query("SELECT * FROM products WHERE ID = ?", [id], function(err, resp) {
        if (err) throw err;
        var stonkLeft = resp[0].stock_quantity;
        if (stonkLeft >= num) {  
            var newItem = new StonkMath(resp[0].id, resp[0].product_name, num, resp[0].price);  
            receipt.Item.push(newItem.productName);
            receipt.Cost.push(newItem.transactionCost);
            var newStonk = stonkLeft - num;
            pathCheck();
            updateStonk(newStonk, id);            
        } else {
            console.log("Sorry, we do not have enough in stock, we have " + stonkLeft + " units of item remaining");
            firstPrompt();
        }
    });
      
}

//Function asks user for quantity to purchase
amountQuery = (ans) => {
    inquirer.prompt({
        message: "How much of item " + ans + " would you like to purchase? \n",
        name: "ItemAmount",
        type: "input", 
        validate: value => {
            if (isNaN(value) === false && value > 0) {
                return true;
            }
            return false;
        }
    }).then(answer => {
        stonkCheck(ans , answer.ItemAmount);
    });
}

//Prompt asks user  what they would like to purchase and gives an input field
firstPrompt = () => {
    inquirer.prompt({
        message: "What is the ID of the item you would like to purchase \n",
        name: "ItemID",
        type: "input",
        validate: value => {
            if (isNaN(value) === false && value <= 10 && value > 0) {
                return true;i
            }
            return false;
        }
    }).then(answer => {
        var itemID = answer.ItemID;
        amountQuery(itemID);
    });
    
}

//Function initializes store, listing all items and calling the inquierer prompts
runFunc = () => {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        
        res.forEach(element => {
            console.log("ID: " + element.id + " || Name: " + element.product_name + " || Price: " + element.price + "\n");
        });
        firstPrompt();
    });
    
    
}