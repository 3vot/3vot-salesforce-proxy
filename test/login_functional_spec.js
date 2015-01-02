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

    Login(app,{route: "/login"});

    app.get("/services/oauth2/authorize", function(req,res){ res.send( res.redirect( req.query.redirect_uri + "?state=" + req.query.state  ) ) } );

    app.post("/services/oauth2/token", function(req,res){ res.send( { "code": "123" } ) } );

    app.get("/", function(req,res){res.send(200);});

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
      done()
    });
  });
  
  it('should login with password', function(done){
    
    request.get("http://localhost:4000/login/salesforce/password")
    .set("tokens", JSON.stringify( {SALESFORCE_CLIENT_ID: "123", SALESFORCE_CLIENT_SECRET: "123", SALESFORCE_REDIRECT_URL: "http://localhost:4000/login/salesforce/callback"}))
    .on('error', function(error){ console.log("error" ); })
    .send({username: "u", password: "p", login_server: "localhost:4000"})
    .end( function(res){
      if( res.error ) return console.log(res.error);
      done();
    }); 

  });

  it('should login with oauth leg1', function(done){
    
    request.get("http://localhost:4000/login/salesforce/login")
    .set("tokens", JSON.stringify({ SALESFORCE_CLIENT_ID: "123", SALESFORCE_CLIENT_SECRET: "123", SALESFORCE_REDIRECT_URL: "http://localhost:4000/login/salesforce/callback"}))
    .on('error', function(error){ console.log("error" ); })
    .query({app_url: "http://localhost:4000/", profile: "rodco", login_server: "localhost:4000"})
    .end( function(res){
      if( res.error ) return console.log(res.error);
      done();
    }); 

  });


});