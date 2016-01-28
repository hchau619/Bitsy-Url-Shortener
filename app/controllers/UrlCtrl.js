var mongoose = require('mongoose');
var Key = require('../models/KeyModel');
var Url = require('../models/UrlModel');

// Generate short and store in db
exports.shortenUrl = function(req, res){
	var newKey;
	var incr = Math.floor((Math.random() * 10) + 1);
	var inputUrl = req.body.url;
	var baseUrl = "http://" + req.get("host") +"/";

	// Checks if short url already exist
	Url.find({long: inputUrl}, function(err, url){
		if(err){
			console.log(err);
			res.send({error: "something wrong"});
		}
		else if(url.length == 0){
			genShortUrl();
		}
		else{
			res.send(url[0]);
		}
	});

	function genShortUrl(){
		console.log("gen short");
		Key.find({id:"key"},function(err, key){
			// make new key
			newKey = key[0].value + incr;

			// update key
			key[0].value = newKey;
			key[0].save();

			// generate short url
			var keyString = newKey.toString(36);
			var shortUrl = baseUrl + keyString;

			var result = { short: shortUrl, long: inputUrl};
			saveUrls(result, keyString );
			res.send(result);
		});	
	}

	function saveUrls(urls, id){
		urls.hits = 0;
		urls.id = id;
		var url = new Url(urls);
		url.save();
	}
};

exports.getTopTen = function(req, res){
	var result = { topTen: []};

	Url.list({start: 0, limit: 10, sort: 'hits'},function(err,count,results){
		var len = results.length;
	  if(err) throw err
	  	console.log(results);
	  // Format in decending order
	  for(var i = 0; i < len; i++){
    	result.topTen[i] = {
    		long: results[len-1-i].long, 
    		short: results[len-1-i].short, 
    		hits: results[len-1-i].hits
    	};
	  }

  	res.send(result);
	})
};

exports.updateHits = function(req, res){

	var val = { $inc : { 'hits' : 1 }};
	var opt = {upsert: true};
  var query = { id: req.params.key};

  Url.update(query,val, function (err, key) {
	  if (err){
	  	console.log(err);
	  }else{
	  	getLong(req.params.key, function(err, long){
	  		if(err){
	  			console.log(err);
	  		}else{
	  			res.redirect('http://'+long[0].long);
	  		}
	  	});
	  }
	});
};

function getLong(shortKey, cb){
	Url.find({id: shortKey}, cb);
}