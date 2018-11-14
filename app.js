
// Module dependencies.
var express = require('express'),
	http = require('http'), 
	path = require('path'),
	config = require('./config/index.js')(),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	Admin = require('./controllers/Admin'),
	Calculation = require('./controllers/Calculation_C'),
	Package_Management = require('./controllers/Packages_C.js'),
	Storage_Management = require('./controllers/Storages_C.js'),
	Truck_Management = require('./controllers/Trucks_C.js'),
	uri="mongodb+srv://" + config.mongo.host + ":" + config.mongo.key + "@szallitocluster-csfys.mongodb.net/test?retryWrites=true";
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
// start
MongoClient.connect(uri,{ useNewUrlParser: true }, function(err, client) {
	if(err) {
		console.log(err);
		console.log('Sorry, there is no mongo db server running.');
	} else {
		var attachDB = function(req, res, next) {
			req.db = client.db("Szallitmanyozas");
			next();
		};
		app.all('/admin*', attachDB, function(req, res, next) {
			Admin.run(req, res, next);
		});
		app.all('/packages', attachDB, function(req, res, next) {
			Package_Management.run(req, res, next);
		});	
		app.all('/storages', attachDB, function(req, res, next) {
			Storage_Management.run(req, res, next);
		});	
		app.all('/trucks', attachDB, function(req, res, next) {
			Truck_Management.run(req, res, next);
		});	
		app.all('/', attachDB, function(req, res, next) {
			Calculation.run(req, res, next);
		});
		http.createServer(app).listen(config.port, function() {
		  	console.log(
		  		'Successfully connected to mongodb://' + config.mongo.host,
		  		'\nExpress server listening on port ' + config.port
		  	);
		});
	}
});
//TODOOO
///Style:todo ---> formokat kozepre igatítani kulturalt formaban
///           ---> Submit gombok középre és kulturalt formaban
///           ---> Navbar sajat style kitalalasa
///           ---> Tickbox-ra valami fancy nézet
///           ---> footert rendberakni
///Calculation---> BackGomb?()
