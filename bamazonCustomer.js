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

connection.connect(err => {
    if (err) throw err;
    runFunc();
});

receiptDisplay = () => {
        var totalCost = receipt.Cost.reduce((a, b) => a + b, 0);
        console.log(receipt, "Total cost: " + totalCost.toFixed(2));
        connection.end()
}

var receipt = {
    Item: [],
    Cost: []
}

function StonkMath (id, name, amt, cost) {
    this.id = id;
    this.productName = name;
    this.amtRequested = amt;
    this.costPerUnit = cost;
    this.transactionCost = amt * cost;
}

updateStonk = (num, id) => {
    connection.query("SELECT * FROM products WHERE ID = ?", [id], err=> {
        if (err) throw err;
        connection.query("UPDATE products SET stock_quantity = ? WHERE ID = ?" , [num,id], function(err) {
            if (err) throw err;
        });    
    });    
}

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

firstPrompt = () => {
    inquirer.prompt({
        message: "What is the ID of the item you would like to purchase \n",
        name: "ItemID",
        type: "input",
        validate: value => {
            if (isNaN(value) === false && value <= 10) {
                return true;
            }
            return false;
        }
    }).then(answer => {
        var itemID = answer.ItemID;
        amountQuery(itemID);
    });
    
}

runFunc = () => {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        
        res.forEach(element => {
            console.log("ID: " + element.id + " || Name: " + element.product_name + " || Price: " + element.price);
            console.log("The quantity left is: " + element.stock_quantity + "\n \n");
        });
        firstPrompt();
    });
    
    
}