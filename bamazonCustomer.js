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

stonkCheck = (id , num) => {
    
    connection.query("SELECT * FROM products WHERE ID="+ id, function(err, resp) {
        if (err) throw err;
        var stonkLeft = resp[0].stock_quantity;
        var stonkWant = num;
        if (stonkLeft >= stonkWant) {
            console.log("stonks");
        } else {
            console.log("out of stonks, only " + stonkLeft + " remaining");
        }
    });
    connection.end();  
}

amountQuery = (ans) => {
    inquirer.prompt({
        message: "How much of item " + ans + " would you like to purchase? \n",
        name: "ItemAmount",
        type: "input", 
        validate: value => {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }).then(answer => {
        stonkCheck(ans , answer.ItemAmount);
        
    });
}

runFunc = () => {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        
        res.forEach(element => {
            console.log("ID: " + element.id + " || Name: " + element.product_name + " || Price: " + element.price);
            console.log("The quantity left is: " + element.stock_quantity);
        });
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
        })
        
    });
    
    
}