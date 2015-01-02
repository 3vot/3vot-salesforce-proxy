var express = require('express');
var should = require("should");
var request = require('superagent');

var express = require('express')
var http = require('http')

var Q = require("q");

var Login = require("../src/login")

var Controller = require("../src/controller")


var app = express();
app.set('port', 3001);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('some secret'));
app.use(express.cookieSession( {secret: "abc", proxy: true} ));
app.use(app.router);

Login(app, {route: "/v1/login"});
Controller(app, {route: "/v1/salesforce"} )

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// One the Browser use this url: 
// http://localhost:3001/v1/login/salesforce_sandbox/login?profile=3vot&app_url=http://localhost:3001/v1/salesforce?query=select%20id%20from%20account