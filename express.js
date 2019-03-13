var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.database = "create_tables"
credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM till_buttons';
  connection.query(sql,(function(res){return function(err,rows,fields){
     var dbfarr = new Array(rows.length);
     rows.forEach(function (item, index) {
   	dbfarr[index] = {"buttonID":item.button_id,
   		"left":item.leftPosition,
   		"top":item.topPosition,
   		"width":item.wide,
   		"label":item.label,
   		"invID":item.invID};
     })
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(dbfarr);
  }})(res));
});

// Gets the button information form our transaction table and puts it in a table
app.get("/transaction",function(req,res){
  // Setting up and making the SQL query
  var sql = 'SELECT * FROM transactions';
  connection.query(sql,(function(res){return function(err,rows,fields){
     var dbfarr = new Array(rows.length);
     // Loop over the response rows and put the information into an array of maps
     // We can then use this to create our buttons
     rows.forEach(function (item, index) {
       dbfarr[index] = {
        "buttonID":item.button_id,
        "item_id":item.item_id,
        "label":item.label,
        "price" :item.price
    }
  });
     if(err){
       console.log("We have an error:");
       console.log(err);
     }
     res.send(dbfarr);
  }})(res));
});

//when a button is clicked the according item is put in transactions
app.get("/click",function(req,res){
  var id = req.param('id');
  //inserts the item which the button_id refers to into the transactions table
  var sql = 'insert into transactions (button_id, label, invID, price) select button_id, label, invID, price from till_buttons where button_id = ?;'
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql, id,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});

//when a button is clicked the according item is removed from transactions
app.get("/deleteclick",function(req,res){
  var id = req.param('id');
  //removes the item which the item_id refers to in the transactions table
  var sql = 'delete from transactions where item_id = ?;'
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql, id,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an deletion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});

//deletes everything in transactions
app.get("/void",function(req,res){
  //truncates transactions
  var sql = 'truncate transactions';
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql, function(err,rows,fields){
     if(err){console.log("We have an truncation error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  })
});

//Adds all the prices in transactions
app.get("/total",function(req,res){
  //selects all the items in transactions and calculates the sum of their prices
  var sql = 'select sum(price) as total from transactions;';
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql,(function(res){return function(err,rows,fields){
     var total = rows[0].total;
     var totals = '0';
     if (total != null) {
       totals = total.toString();
     }
     console.log(rows);
     console.log(rows[0]);
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(totals);
  }})(res));
});

app.listen(port);
