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

connection.connect(function(err) {
    if (err) throw err;
    runFunc();
})
runFunc = () => {
    console.log("Hi I am an init function with no purpose, but soon i will start inquirer with inquierer.prompt({ ");
}