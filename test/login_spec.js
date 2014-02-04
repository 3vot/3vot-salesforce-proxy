var express = require('express');
var should = require("should");
var request = require('superagent');

var express = require('express')
var http = require('http')

var Q = require("q");


var Login = require("../src/login")

describe('Controller', function(){

  before(function(done) {
    var app = express();
    app.set('port', 4000);

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    Login(app,{route: "login/salesforce"});

    app.post("/services/oauth2/authorize", function(res,res){ res.send( { "status": "ok" } ) } );

    app.post("/services/oauth2/token", function(res,res){ res.send( { "code": "123" } ) } );



    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
      done()
    });
  });
  
  it('should login with password', function(done){
    var req = {tokens: {salesforce: {}} , session: {} };
    req.tokens.SALESFORCE_CLIENT_ID = "123";
    req.tokens.SALESFORCE_CLIENT_SECRET = "123";
    req.body = {username: "123", password: "123", login_server: "localhost:4000"};
    req.query = {};
    var res = {};
    res.send = function(){ done(); }
    res.status = function(){ throw "error" };
    
    Login.password(req,res,true);
  });

  it('should login leg 1', function(done){
    var req = {tokens: {salesforce: {}} , session: {} };
    req.tokens.SALESFORCE_CLIENT_ID = "123";
    req.tokens.SALESFORCE_CLIENT_SECRET = "123";
    req.tokens.SALESFORCE_REDIRECT_URL = "http://abc.com"
    req.body = {username: "123", password: "123", login_server: "localhost:4000"};
    req.query = {app_url: "http://abd124.com", profile: "anyProfile"};
    var res = {}
    res.redirect = function(){ done(); }
    res.status = function(){ throw "error" }; 
       
    Login.login(req,res,true);
  });
  
  it('should login leg 2', function(done){
    var req = { tokens: {salesforce: {}} , session: {} };
    req.tokens.SALESFORCE_CLIENT_ID = "123";
    req.tokens.SALESFORCE_CLIENT_SECRET = "123";
    req.tokens.SALESFORCE_REDIRECT_URL = "http://abc.com"
    req.body = {username: "123", password: "123", login_server: "localhost:4000"};
    req.query = {code: "12334556", profile: "anyProfile", state: '{"loginServer":"localhost:4000"}'};
    var res = {};
    res.redirect = function(){ done(); }
    res.status = function(){ throw "error" };
    
        
    Login.loginCallback(req,res,true);
  });
  
});