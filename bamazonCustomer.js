const mysql = require('mysql');
var prompt = require('prompt');

const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

var itemId = '';
var productName = 'josh';
var department = '';
var itemPrice = 0;
var qtyAvailable = 0;
var orderQuantity = 0;

var buySchema = {
    properties: {
        ID: {
            type: 'integer',
            required: true
        },
        Quantity: {
            type: 'integer',
            required: true
        }
    }
};

connection.connect();
allProducts();


function allProducts() {
    connection.query('SELECT * From products',
       function (error, results, fields) {
            if (error) throw error;
            results.forEach(function (product) {
            console.log(product.item_id +': '+product.product_name+' - $'+product.price);
            });
            buyPrompt();
        });
}
function buyPrompt() {
    prompt.start();
    prompt.get(buySchema, function (err, result) {
        buyProduct(result.ID, result.Quantity);
    });
}

function buyProduct(item, qty) {
    productSearch(item, qty);
}

function productSearch(item, qty) {
    connection.query('SELECT * From products WHERE ?',
        {item_id: item},
        function (error, results) {
            if (error) {
                throw error
            } else {
                // console.log(results[0].product_name);
                itemId = results[0].item_id;
                productName = results[0].product_name;
                department = results[0].department_name;
                itemPrice = results[0].price;
                qtyAvailable = results[0].stock_quantity;
                orderQuantity = qty;
                console.log(itemId+' : '+productName);
                order();
            }
        });

}

function order() {
    if(orderQuantity > qtyAvailable) {
        console.log('Insufficent Quantity: only '+qtyAvailable+' available');
    } else {
        console.log('Your Order total is: $'+ (orderQuantity * itemPrice));
        connection.query('Update products set ? WHERE ?',
            [
                {stock_quantity: qtyAvailable - orderQuantity},
                {item_id: itemId}
            ]);
    }
}