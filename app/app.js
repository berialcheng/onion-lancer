var express = require('express');
var multiparty = require('multiparty');
var cons = require('consolidate');
var path = require('path');

var user = require('./user');

var app = express();

app.post('/signin', function (req, resp) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        if(err){
            resp.writeHead(302, {
                'Location': '/error.html'
                //add other headers here...
            });
        }else{
            if (fields.username && fields.password) {
                user.login(fields.username[0],fields.password[0], req.connection.remoteAddress );
            } else  {
                resp.writeHead(302, {
                    'Location': '/error.html'
                    //add other headers here...
                });
            }
        }
        resp.end();
    });
});

app.use(express.static('public'));
app.use('/.well-known/acme-challenge', express.static('acme-challenge'));

app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, '..') + '/views');

app.get('/proxy.pac', function(req, resp){
    resp.render('pac', { title: 'Hey'});
});

exports = module.exports = app;