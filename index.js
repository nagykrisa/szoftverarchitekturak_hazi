var model = require('./model.js');
var http = require('http');
var url = require('url');
var fs = require('fs');


setImmediate(function(){model.initModel();},0);


http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  openHTML( "./view" + q.pathname, res );
  console.log("./view" + q.pathname); //returns '/default.htmv'
}).listen(8080);

console.log('Pelda alkalmazas elindult!');
console.log('localhost:8080 on elerheto');

function openHTML(filename = "./view/index.html", res){
  fs.readFile( filename, function(err, data) {
    if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found" + "  Azt mondom nincs ilyen html file!"  + err);
    }  
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}
