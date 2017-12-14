/*jslint node: true */
/* eslint-env node */
'use strict';

// Require express, socket.io, and vue
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var csv = require("csvtojson");

var ingredientsDataName = "ingredients";
var transactionsDataName = "transactions";
var defaultLanguage = "en";
var premadeDataName = "premade";

// Pick arbitrary port for server
var port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));
// Serve vue from node_modules as vue/

app.use('/vue', express.static(path.join(__dirname, '/node_modules/vue/dist/')));
// Serve diner.html as root page

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/ordering.html'));
});
// Serve kitchen.html as subpage
app.get('/kitchen', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/kitchen.html'));
});

app.get('/ingredients', function(req, res){
    res.sendFile(path.join(__dirname, 'views/ingredients.html'));
});


// Store data in an object to keep the global namespace clean
function Data() {
  this.data = {};
  this.orders = {};
}

Data.prototype.getUILabels = function (lang) {
  var ui = require("./data/ui_" + (lang || defaultLanguage) + ".json");
  return ui;
};

/*
  Returns a JSON object array of ingredients with the fields from
  the CSV file, plus a calculated amount in stock, based on
  transactions.
*/
Data.prototype.getIngredients = function () {
  var d = this.data;
  return d[ingredientsDataName].map(function (obj) {
    obj.stock = d[transactionsDataName].reduce(function (sum, trans) {
      if (trans.ingredient_id === obj.ingredient_id) {
        return sum + trans.change;
      } else {
        return sum;
      }
    }, 0);
    return obj;
  });
};

Data.prototype.getPremade = function () {
  var d = this.data;
  return d[premadeDataName]
};

/*
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeData = function (table) {
  this.data[table] = [];
  var d = this.data[table];

  csv({checkType: true})
    .fromFile("data/" + table + ".csv")
    .on("json", function (jsonObj) {
      d.push(jsonObj);
    })
    .on("end", function () {
      console.log("Data for", table, "done");
    });
};

Data.prototype.makeTransaction = function(order, changeUnit){
      var transactions = this.data[transactionsDataName],
    //find out the currently highest transaction id
    transId =  transactions[transactions.length - 1].transaction_id,
    i = order.ingredients,
    k;

  for (k = 0; k < i.length; k += 1) {
    transId += 1;
    transactions.push({transaction_id: transId,
                       ingredient_id: i[k].ingredient_id,
                       change: changeUnit});
  }
};

//when the staff is changing the stock
Data.prototype.makeStockTransaction = function(item, changeUnit){
    var transactions = this.data[transactionsDataName],
    transId =  transactions[transactions.length - 1].transaction_id;
    transactions.push({transaction_id: transId, ingredient_id: item, change: changeUnit})
};
  


/*
  Adds an order to to the queue and makes an withdrawal from the
  stock. If you have time, you should think a bit about whether
  this is the right moment to do this.
*/

  Data.prototype.getOrderNumber = function () {
    this.currentOrderNumber += 1;
    return "#" + this.currentOrderNumber;
  }

  function Data() {
    this.data = {};
    this.orders = {};
    this.currentOrderNumber = 1000;
  };

Data.prototype.addOrder = function (order) {
     var orderId = this.getOrderNumber();
    this.orders[orderId] = order.order;
    this.orders[orderId].done = false;
    this.orders[orderId].inMade = false;
    this.makeTransaction(order.order, -1);
    return orderId;
};
Data.prototype.getAllOrders = function () {
  return this.orders;
};

Data.prototype.markOrderDone = function (orderId) {
  this.orders[orderId].done = true;
};

Data.prototype.cancelOrder = function(orderId){
    this.orders[orderId].done = true;
    this.makeTransaction(this.orders[orderId], 1);
};

Data.prototype.markOrderInMade = function(orderId){
    this.orders[orderId].inMade = true;
};

Data.prototype.unmarkOrderInMade = function(orderId){
    this.orders[orderId].inMade = false;
};

Data.prototype.plusIngredientsStock = function(item){
    this.makeStockTransaction(item, +1000)
   
};

Data.prototype.minusIngredientsStock = function(item){
    this.makeStockTransaction(item, -1000)
};



var data = new Data();
// Load initial ingredients. If you want to add columns, do it in the CSV file.
data.initializeData(ingredientsDataName);
// Load initial stock. Make alterations in the CSV file.
data.initializeData(transactionsDataName);
// Load initial stock. Make alterations in the CSV file.
data.initializeData(premadeDataName);

io.on('connection', function (socket) {
  // Send list of orders and text labels when a client connects
  socket.emit('initialize', { orders: data.getAllOrders(),
                          uiLabels: data.getUILabels(),
                          ingredients: data.getIngredients(),
                            premade: data.getPremade()});

  // When someone orders something
  socket.on('order', function (order) {
    var orderNumber = data.addOrder(order);
    socket.emit('orderNumber', orderNumber);
    io.emit('currentQueue', { orders: data.getAllOrders(),
                          ingredients: data.getIngredients(),
                          premade: data.getPremade()});
  });
  // send UI labels in the chosen language
  socket.on('switchLang', function (lang) {
    socket.emit('switchLang', data.getUILabels(lang));
  });
  // when order is marked as done, send updated queue to all connected clients Here it recives order done.
  socket.on('orderDone', function (orderId) {
    data.markOrderDone(orderId);

      //emitting to all concected client to were the que is. Wha to happen when an order i cancelled
    io.emit('currentQueue', {orders: data.getAllOrders() });
  });

    socket.on('cancelOrder', function (orderId){
    
    data.cancelOrder(orderId);
    
    io.emit('currentQueue', {orders: data.getAllOrders(), ingredients: data.getIngredients() });

});

    socket.on('orderInMade', function(orderId){
        data.markOrderInMade(orderId);
        io.emit('currentQueue', {orders: data.getAllOrders() });
    });
    
    socket.on('notInMade', function(orderId){
        data.unmarkOrderInMade(orderId);
        io.emit('currentQueue', {orders: data.getAllOrders()});
    });
    
    socket.on('minusIngredient', function(item){
        data.minusIngredientsStock(item);
        io.emit('currentQueue', {orders: data.getAllOrders(), ingredients: data.getIngredients() });
    });
    
    socket.on('plusIngredient', function(item){
        data.plusIngredientsStock(item);
        io.emit('currentQueue', {orders: data.getAllOrders(), ingredients: data.getIngredients() });
    });
});
//socket.on('History', function()){
//          socket.emit('History', data)
//          }




var server = http.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
