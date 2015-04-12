// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.post('/feedme', function(request, response) {
	var fooditem = request.body.fooditem;
	var toInsert = {
		"fooditem": fooditem,
	};
	db.collection('fooditems', function(error1, coll) {
		var id = coll.insert(toInsert, function(error2, saved) {
			if (error2) {
				response.send(500);
			}
			else {
				console.log("Jake, it's okay...");
				response.send(200);
			}
	    });
	});
});

app.post('/sendLocation', function(request, response) {
	var login = request.body.login;
	var lat = request.body.lat;
	var lng = request.body.lng;
	var toInsert = {
		"login": login,
		"lat": lat,
		"lon": lng,
	};

	db.collection('locations', function(error1, coll) {
		var id = coll.insert(toInsert, function(error2, saved) {
			if (error2 || ) {
				response.send("{'error':'Whoops, something is wrong with your data!'}");
			}
			else {
				x = coll.find().toArray(); 
					response.send(JSON.stringify(x));
			}
	    });
	});
});

app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('locations', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>What Did You Feed Me?</h1>";
				for (var count = 0; count < cursor.length; count++) {
					indexPage += "<p>You fed me " + cursor[count].login + "!</p>";
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

app.get('/jackson', function(request, response){
	response.set('Content-Type', 'text/html');
	response.send("Hi Jackson");
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);
