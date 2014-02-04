var express = require('express');
var should = require("should");
var request = require('superagent');

var express = require('express')
var http = require('http')

var Q = require("q");

var Login = require("../src/login")

var app = express();
app.set('port', 3001);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

Login(app,{route: "/v1/login"});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});