var http = require('http');
var https = require('https');
var fs = require('fs');
var net = require('net');
var url = require('url');

function request(req, resp) {
    var u = url.parse(req.url);

    var options = {
        hostname : u.hostname,
        port     : u.port || 80,
        path     : u.path,
        method   : req.method,
        headers  : req.headers
    };

    console.log("%s %s:%s%s" , options.method, options.hostname, options.port, options.path);

    var forwardReq = http.request(options, function(forwardResp) {
        resp.writeHead(forwardResp.statusCode, forwardResp.headers);
        forwardResp.pipe(resp);
    }).on('error', function(e) {
        resp.end();
    });

    req.pipe(forwardReq);
}

function connect(req, socket) {
    var u = url.parse('http://' + req.url);

    var options = {
        hostname : u.hostname,
        port     : u.port
    };

    console.log("%s %s:%s" , "CONNECT", options.hostname, options.port);

    var forwardSocket = net.connect(options.port, options.hostname, function() {
        socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        forwardSocket.pipe(socket);
    }).on('error', function(e) {
        socket.end();
    });

    socket.pipe(forwardSocket);
}

var options = {
    key: fs.readFileSync('./certs/private.pem'),
    cert: fs.readFileSync('./certs/public.crt')
};

https.createServer(options)
    .on('request', request)
    .on('connect', connect)
    .listen(8888, '0.0.0.0');
