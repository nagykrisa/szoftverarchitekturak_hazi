var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  fs.readFile('example_html.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);
console.log('Pelda alkalmazas elindult!');
console.log('localhost:8080 on elerheto');
        