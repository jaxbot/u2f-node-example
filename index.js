var express = require('express');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var app = express();
var https = require('https');
var fs = require('fs');

var u2f = require('u2f');

var APP_ID = "https://localhost:4433";

app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.engine('html', engines.hogan);

var Sessions = {};

app.get('/', function(req, res) {
  if (!req.cookies.userid) {
    res.cookie('userid', Math.floor(Math.random() * 100000));
  }
  res.render('index.html');
});
app.get('/register', function(req, res) {
  res.render('register.html');
});
app.get('/secretstuff', function(req, res) {
  res.render('secret.html');
});
app.get('/api/register_token', function(req, res) {
  var authRequest = u2f.request(APP_ID);
  Sessions[req.cookies.userid] = { authRequest: authRequest };
  res.send(JSON.stringify(authRequest));
});
app.post('/api/register', function(req, res) {
  console.log(req.body);
  var checkRes = u2f.checkRegistration(Sessions[req.cookies.userid].authRequest, req.body);
  console.log(checkRes);
});

app.listen(5000);
var privateKey = fs.readFileSync('../wiistuff/server.key');
var certificate = fs.readFileSync('../wiistuff/server.crt');

var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(4433);
