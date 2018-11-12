
/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'), 
	path = require('path'),
	config = require('./config/index.js')(),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	Admin = require('./controllers/Admin'),
	Home = require('./controllers/Home'),
	Package_Management = require('./controllers/Packages_C.js'),
	Storage_Management = require('./controllers/Storages_C.js'),
	Truck_Management = require('./controllers/Trucks_C.js'),
	Request_Table = require('./controllers/Request_Table'),
	Result_Table = require('./controllers/Result_Table'),
	uri="mongodb:/@szallitocluster-shard-00-00-csfys.mongodb.net:27017,szallitocluster-shard-00-01-csfys.mongodb.net:27017,szallitocluster-shard-00-02-csfys.mongodb.net:27017/test?ssl=true&replicaSet=SzallitoCluster-shard-0&authSource=admin&retryWrites=true";
// all environments
// app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/templates');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('fast-delivery-site'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
}
MongoClient.connect(uri,{ useNewUrlParser: true }, function(err, client) {
	if(err) {
		console.log(err);
		console.log('Sorry, there is no mongo db server running.');
	} else {
		console.log("0");
		var attachDB = function(req, res, next) {
			req.db = client.db("Szallitmanyozas");
			next();
		};
		app.all('/admin*', attachDB, function(req, res, next) {
			console.log("1");
			Admin.run(req, res, next);
		});			
		app.all('/request_table', attachDB, function(req, res, next) {
			console.log("2.1");
			Request_Table.run(req, res, next);
		});	
		app.all('/result_table', attachDB, function(req, res, next) {
			console.log("2.2");
			Result_Table.run(req, res, next);
		});	

		//kezelői felviteli felületek kezdete	(add,remove)
		app.all('/packages', attachDB, function(req, res, next) {
			console.log("3.1");
			Package_Management.run(req, res, next);
		});	
		app.all('/storages', attachDB, function(req, res, next) {
			console.log("3.2");
			Storage_Management.run(req, res, next);
		});	
		app.all('/trucks', attachDB, function(req, res, next) {
			console.log("3.3");
			Truck_Management.run(req, res, next);
		});	
		//kezelői felviteli felületek vége (add,remove)

		app.all('/', attachDB, function(req, res, next) {
			console.log("4");
			Home.run(req, res, next);
		});		
		http.createServer(app).listen(config.port, function() {
		  	console.log(
		  		'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
		  		'\nExpress server listening on port ' + config.port
		  	);
		});
	}
});