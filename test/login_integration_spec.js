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
    app.use(express.session());

    Login(app,{route: "/login/salesforce"});

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
      done()
    });
  });
  
  it('should login with password', function(done){
    this.timeout(9000);
    request.get("http://localhost:4000/login/salesforce/password")
    .query( { profile: "3vot", provider: "salesforce_test" } )
    .send( { username: "one.dev@3vot.com", password: "monomono" } )
    .on('error', function(error){ console.log("error" ); })
    .end( function(res){
      if( res.error ){ res.error.should.equal(null); return console.log(res.error); done(); }
      done();
    }); 
  });

  it('should redirecto to SF', function(done){
    this.timeout(9000);
    request.get("http://localhost:4000/login/salesforce/login")
    .query( { profile: "3vot" } )
    .send()
    .on('error', function(error){ console.log("error" ); })
    .end( function(res){
      if( res.error ){ res.error.should.equal(null); return console.log(res.error); done(); }
      done();
    }); 
  });

 

});