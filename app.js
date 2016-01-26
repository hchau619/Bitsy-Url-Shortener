var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = 3000;
var initKey = 10*Math.pow(36,3);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');
var Schema = mongoose.Schema;

// Setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));


var urlSchema = new Schema({
	
});



// From: http://rickyrosario.com/blog/javascript-startswith-and-endswith-implementation-for-strings/
String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

// Generate short and store in db
function shortenUrl(inputUrl, baseUrl, res){
	var incr = Math.floor((Math.random() * 10) + 1);
	client.incrby('next', incr, function(err, num) {
		var key = num.toString(36); // Convert to base 36 string
		var shortUrl = baseUrl+key;
		//Set keys for bi-directional search
		client.setnx('short:'+ key, inputUrl);
		client.setnx('long:' + inputUrl, shortUrl);
		//Return short and top hits
		client.zrevrange('hits', 0, 9, 'withscores', function(err, topTen) {
			res.render('index', {output: shortUrl, top: formatHits(topTen)});
		});
			
	});
}

//Format top 10 hits to display
function formatHits(topTen){
	var output = [];
	for (var i = 0; i < topTen.length; i=i+2) {
		output.push({url: topTen[i], hits: topTen[i+1]});
	}
	return output;
}

// Route for index
app.get('/', function(req,res){
	//client.zrevrange('hits',0,9,'withscores', function(err, topTen){
		res.render('index', {top: formatHits(topTen)});
	//});
});

// Route for URL submission
app.post('/', function(req,res){
	var inputUrl = req.body.url;
	var baseUrl = 'http://' + req.get('host') +'/';

	//If input is short
	if(inputUrl.startsWith(baseUrl)){
		var shrt = inputUrl.replace(baseUrl,'');
		client.get('short:'+ shrt, function(err,outputUrl){
			if(outputUrl){ //if there is a long for the short url
				client.zrevrange('hits',0,9,'withscores', function(err, topTen){
					//Return long url and top hits
					res.render('index', {output: outputUrl, top: formatHits(topTen)});
				});
			}else{ //No long for short
				client.zrevrange('hits',0,9,'withscores', function(err, topTen){
					//Return top hits
					res.render('index', {top: formatHits(topTen), error: 'No such shortened URL'});
				});
			}
		});
	}else {//input is long
		client.get('long:'+inputUrl, function(err,outputUrl){
			if(outputUrl){ //if there exist short for long
				client.zrevrange('hits',0,9,'withscores', function(err, topTen){
					//Return short and top hits
					res.render('index', {output: outputUrl, top: formatHits(topTen)});
				});
			}else{//No short for long yet
				shortenUrl(inputUrl,baseUrl,res);
			}
		});
	}
});

//Keeps track of short url hits
app.get('/:key', function(req, res) {
	var key = req.params.key;
	client.get('short:'+key, function(err,longUrl){
		if(longUrl){
			client.get('long:' + longUrl, function(err, shortUrl) {
				client.zincrby('hits',1, shortUrl);
				res.redirect('http://'+longUrl);
			});
		}else{
			res.redirect('/');
		}
	});
});


//Create server
app.listen(port, console.log('Now listening on port: %s', port));
module.exports = app;
