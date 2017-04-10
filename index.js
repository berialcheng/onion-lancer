var http = require('http');
var https = require('https');
var fs = require('fs');
var net = require('net');
var url = require('url');
var path = require('path');

function request(req, resp) {
    console.log("on request ...");

    var u = url.parse(req.url);

    if(req.url.indexOf("/.well-known/acme-challenge/") > -1){
        var folder = path.resolve(__dirname, '.');
        var targetFile = req.url.split("/.well-known/acme-challenge/")[1];

        fs.readFile(path.join(folder, "acme-challenge", targetFile), function(err,data){
            if(err){
                resp.writeHeader(404,{
                    'content-type' : 'text/html;charset="utf-8"'
                });
                resp.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
                resp.end();
            }else{
                resp.writeHeader(200,{
                    'content-type' : 'text/html;charset="utf-8"'
                });
                resp.write(data);
                resp.end();
            }
        });
        return;
    }

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
    //key: fs.readFileSync('./certs/privkey.pem'),
    //cert: fs.readFileSync('./certs/fullchain.pem')
    key: fs.readFileSync('./certs/privkey.pem'),
    cert: fs.readFileSync('./certs/fullchain.pem')
};

http.createServer()
    .on('request', request)
    .on('connect', connect)
    .listen(8080, '0.0.0.0');

https.createServer(options)
    .on('request', request)
    .on('connect', connect)
    .listen(8443, '0.0.0.0');
