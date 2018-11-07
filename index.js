var http = require('http');
var dt = require('./dateModul');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("The date and time are currently: " + dt.myDateTime());
    res.end();
}).listen(8080);
console.log('Pelda alkalmazas elindult!');
console.log('localhost:8080 on elerheto');
        