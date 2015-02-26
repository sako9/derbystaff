var express = require('express');
var config = require('./config');

var app = express();

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || config.port || 3000;
app.listen(port);