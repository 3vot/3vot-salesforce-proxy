var express = require('express');
var should = require("should");
var request = require('superagent');

var express = require('express')
var http = require('http')

var Q = require("q");

var Controller = require("../src/controller");

var SalesforceAPI = require("../src/api")

describe('Controller', function(){

  before(function(done) {
    var app = express();
    app.set('port', 4000);

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    Controller(app, {route: "/salesforce"} );

    app.post("/services/data/v29.0/sobjects/Account/", function(res,res){ res.send( { "status": "ok" } ) } );

    app.patch("/services/data/v29.0/sobjects/Account/1", function(res,res){ res.send( { "status": "ok" } ) } );

    app.get("/services/data/v29.0/sobjects/Account/1", function(res,res){ res.send( { "status": "ok" } ) } );

    app.del("/services/data/v29.0/sobjects/Account/1", function(res,res){ res.send( { "status": "ok" } ) } );

    app.get("/services/data/v29.0/query", function(res,res){ res.send( { "status": "ok" } ) } );

    app.get("/services/data/v29.0/search", function(res,res){ res.send( { "status": "ok" } ) } );
    

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
      done()
    });
  });
  
  it('should execute retreive', function(done){
    request.get("http://localhost:4000/salesforce/Account/1")
    .set("Authorization", JSON.stringify({ instance_url: "http://localhost:4000", access_token: "12345" }))
    .on('error', function(error){ console.log("error" ); })
    .send({})
    .end( function(res){
      if( res.error ) console.log(res.error);
      done();
    }); 
  });

  it('should execute create', function(done){
    request.post("http://localhost:4000/salesforce/Account/")
    .set("Authorization", JSON.stringify({ instance_url: "http://localhost:4000", access_token: "12345" }))
    .on('error', function(error){ console.log("error" ); })
    .send({Name: "Account Name"})
    .end( function(res){
      if( res.error ) console.log(res.error);
      done();
    }); 
  });

  it('should execute update', function(done){
    request.put("http://localhost:4000/salesforce/Account/1")
    .set("Authorization", JSON.stringify({ instance_url: "http://localhost:4000", access_token: "12345" }))
    .on('error', function(error){ console.log("error" ); })
    .send({Name: "Account Name"})
    .end( function(res){
      if( res.error ) console.log(res.error);
      done();
    }); 
  });

  it('should execute del', function(done){
    request.del("http://localhost:4000/salesforce/Account/1")
    .set("Authorization", JSON.stringify({ instance_url: "http://localhost:4000", access_token: "12345" }))
    .on('error', function(error){ console.log("error" ); })
    .send()
    .end( function(res){
      if( res.error ) console.log(res.error);
      done();
    }); 
  });

  it('should execute query', function(done){
    request.get("http://localhost:4000/salesforce/")
    .set("Authorization", JSON.stringify({ instance_url: "http://localhost:4000", access_token: "12345" }))
    .on('error', function(error){ console.log("error" ); })
    .query({query: "select id from account"})
    .end( function(res){
      if( res.error ) console.log(res.error);
      done();
    }); 
  });

  it('should execute query', function(done){
    request.get("http://localhost:4000/salesforce/")
    .set("Authorization", JSON.stringify({ instance_url: "http://localhost:4000", access_token: "12345" }))
    .on('error', function(error){ console.log("error" ); })
    .query({search: "select id from account"})
    .end( function(res){
      if( res.error ) console.log(res.error);
      done();
    }); 
  });

  
});