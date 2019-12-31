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
})



runFunc = () => {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        
        res.forEach(element => {
            console.log("ID: " + element.id + " || Name: " + element.product_name + " || Price: " + element.price);
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
            console.log(answer);
        })
        connection.end();
    });
    
    
}