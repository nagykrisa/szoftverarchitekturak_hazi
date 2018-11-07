var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
}).listen(8080);
console.log('Pelda alkalmazas elindult!');
console.log('localhost:8080 on elerheto');
        