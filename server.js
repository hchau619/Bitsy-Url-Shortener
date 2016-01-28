var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config')
var app = express();
var port = process.env.PORT || 8080;
var Key = require('./app/models/KeyModel');

// Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Include routes
require('./app/routes')(app);

// Start server
app.listen(port, function(){
	console.log('Now listening on port ' + port);
});

// Database setup
mongoose.connect(config.dbUrl);
var db = mongoose.connection;

db.on('error', function(err){
	console.log(err);
});

db.once('open', function() {
  var val = {id:'key', value: config.initKey};
  var opt = {upsert: true};
  var query = {id: "key"};

  Key.update(query, val, opt , function (err, key) {
	  if (err) return console.error(err);
	});
});

// expose app           
exports = module.exports = app;