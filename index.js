var http = require('http');
var https = require('https');
var fs = require('fs');
var net = require('net');
var url = require('url');
var path = require('path');
var multiparty = require('multiparty');
var form = new multiparty.Form();

//  https://nodejs.org/api/http.html

var whiteList = [];

function request(req, resp) {
    var u = url.parse(req.url);

    console.log("on request ...", req.url);

    var header=req.headers['authorization']||'',        // get the header
        token=header.split(/\s+/).pop()||'',            // and the encoded auth token
        auth=new Buffer(token, 'base64').toString(),    // convert from base64
        parts=auth.split(/:/),                          // split on colon
        username=parts[0],
        password=parts[1];

    if(req.url.indexOf("proxy.pac") > -1) {
        var folder = path.resolve(__dirname, '.');

        fs.readFile(path.join(folder, "pac", "proxy.pac"), function (err, data) {
            if (err) {
                resp.writeHeader(404, {
                    'content-type': 'text/html;charset="utf-8"'
                });
                resp.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
                resp.end();
            } else {
                resp.writeHeader(200, {
                    'content-type': 'text/html;charset="utf-8"'
                });
                resp.write(data);
                resp.end();
            }
        });
    }else if(req.url == "/"){
        var folder = path.resolve(__dirname, '.');

        fs.readFile(path.join(folder, "html", "index.html"), function(err,data){
            if(err){
                resp.writeHeader(404,{
                    'content-type' : 'text/html;charset="utf-8"'
                });
                resp.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
                resp.end();
            }else{
                resp.writeHeader(200,{
                    'content-type' : 'text/html;charset="utf-8"',
                    'Set-Cookie': 'myCookie=test'
                });
                resp.write(data);
                resp.end();
            }
        });
    }else if(req.url.indexOf("/.well-known/acme-challenge/") > -1){
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
    }else if(req.url == "/signin"){
        //console.log(req);
        form.parse(req, function (err, fields, files) {
            if(fields.username[0] == "onion" && fields.password[0] == "lancer"){
                console.log("signin success");
                if(whiteList.filter(function(ip){return ip == req.connection.remoteAddress}).length < 1){
                    whiteList.push(req.connection.remoteAddress)
                }
            }
        });
        resp.end();
    }else{
        var options = {
            hostname: u.hostname,
            port: u.port || 80,
            path: u.path,
            method: req.method,
            headers: req.headers
        };

        console.log("%s %s:%s%s", options.method, options.hostname, options.port, options.path);

        return;
        var forwardReq = http.request(options, function (forwardResp) {
            resp.writeHead(forwardResp.statusCode, forwardResp.headers);
            forwardResp.pipe(resp);
        }).on('error', function (e) {
            resp.end();
        });

        req.pipe(forwardReq);
    }
}

function connect(req, socket, headers) {
    var u = url.parse('http://' + req.url);

    var options = {
        hostname : u.hostname,
        port     : u.port
    };

    console.log("%s %s:%s  %s" , "CONNECT", options.hostname, options.port, headers, req.connection.remoteAddress);

    if(whiteList.filter(function(ip){return ip == req.connection.remoteAddress}).length < 1){
        console.log("ip not in white list");
        socket.end();
    }

    var forwardSocket = net.connect(options.port, options.hostname, function() {
        socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        forwardSocket.pipe(socket);
    }).on('error', function(e) {
        console.log(e);
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
    .listen(8080, '0.0.0.0', function(){
        console.log("8080 listen");

        // var cookie = 'something=anything'
        //
        // // make a request to a tunneling proxy
        // var options = {
        //     port: 8080,
        //     hostname: '127.0.0.1',
        //     method: 'CONNECT',
        //     path: 'www.baidu.com:80',
        //     rejectUnauthorized: false
        // };
        //
        // var req = http.request(options);
        // req.setHeader("abc", "abc");
        // req.setHeader("Cookie", cookie);
        // req.end();
        //
        // req.on('connect', function(res, socket, head){
        //     console.log('got connected!');
        //
        //     // make a request over an HTTP tunnel
        //     socket.write('GET / HTTP/1.1\r\n' +
        //         'Host: www.baidu.com:80\r\n' +
        //         'Connection: close\r\n' +
        //         '\r\n');
        //     socket.on('data', function(chunk){
        //         console.log(chunk.toString());
        //     });
        //     socket.on('end', function(){
        //         //proxy.close();
        //     });
        // });
    });

https.createServer(options)
    .on('request', request)
    .on('connect', connect)
    .listen(8443, '0.0.0.0', function(){
        console.log("8443 listen");

        // var cookie = 'something=anything'
        //
        // // make a request to a tunneling proxy
        // var options = {
        //     port: 8443,
        //     hostname: '127.0.0.1',
        //     method: 'CONNECT',
        //     path: 'www.baidu.com:80',
        //     rejectUnauthorized: false
        // };
        //
        // var req = https.request(options);
        // req.setHeader("abc", "abc");
        // req.setHeader("Cookie", cookie);
        // req.end();
        //
        // req.on('connect', function(res, socket, head){
        //     console.log('got connected!');
        //
        //     // make a request over an HTTP tunnel
        //     socket.write('GET / HTTP/1.1\r\n' +
        //         'Host: www.baidu.com:80\r\n' +
        //         'Connection: close\r\n' +
        //         '\r\n');
        //     socket.on('data', function(chunk){
        //         console.log(chunk.toString());
        //     });
        //     socket.on('end', function(){
        //         //proxy.close();
        //     });
        // });
    });
