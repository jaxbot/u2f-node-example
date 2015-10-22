var express = require('express');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var app = express();
var https = require('https');
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(5000);
