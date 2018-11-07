var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  fs.readFile('example_html.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
  var adr = req.url;
  console.log(adr);
  var q = url.parse(adr, true);
  console.log(q.host); //returns 'localhost:8080'
  console.log(q.pathname); //returns '/default.htm'
  console.log(q.search); //returns '?year=2017&month=february'
  var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
  console.log(qdata.month); //returns 'february'
}).listen(8080);
console.log('Pelda alkalmazas elindult!');
console.log('localhost:8080 on elerheto');