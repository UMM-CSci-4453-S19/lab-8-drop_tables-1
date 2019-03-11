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
app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'insert into transactions select * from till_buttons where button_id = ?;'
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql, id,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});
// Your other API handlers go here!
app.get("/void",function(req,res){
  var sql = 'truncate transactions';
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql, function(err,rows,fields){
     if(err){console.log("We have an truncation error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  })
});
app.get("/list",function(req,res){
  var sql = 'SELECT * FROM transactions';
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
app.get("/total",function(req,res){
  var sql = 'select sum(price) as total from transactions;';
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql,(function(res){return function(err,rows,fields){
     var totals = rows[0].total.toString();
     console.log(rows);
     console.log(rows[0]);
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(totals);
  }})(res));
});

app.listen(port);
