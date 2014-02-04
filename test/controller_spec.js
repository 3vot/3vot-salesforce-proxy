var express = require('express');
var should = require("should");
var request = require('supertest');

var express = require('express')
var http = require('http')


var Q = require("q");

var Controller = require("../src/controller");

var SalesforceAPI = require("../src/api")

describe('Controller Functions', function(){
  
  describe('Controller buildRequest', function(){

    before(function(done) {
      var app = express();
      app.set('port', 4000);

      app.use(express.bodyParser());
      app.use(express.methodOverride());
          app.use(express.session({secret: "abc"}));
      app.use(app.router);

      app.post("/services/data/v28.0/sobjects/Account/", function(res,res){ res.send( { "status": "ok" } ) } );

      app.patch("/services/data/v28.0/sobjects/Account/1", function(res,res){ res.send( { "status": "ok" } ) } );

      app.get("/services/data/v28.0/sobjects/Account/1", function(res,res){ res.send( { "status": "ok" } ) } );

      app.del("/services/data/v28.0/sobjects/Account/1", function(res,res){ res.send( { "status": "ok" } ) } );

      app.get("/services/data/v28.0/query", function(res,res){ res.send( { "status": "ok" } ) } );

      app.get("/services/data/v28.0/search", function(res,res){ res.send( { "status": "ok" } ) } );

      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
        done()
      });

    });
    
    it('should build a create request', function(done){
      var auth= { instance_url: "localhost:4000" , access_token: "abcd1" };
      var params= { objectType: "Account" }
      var data = { Name: "test" };
      var apiOptions = SalesforceAPI.create(data, params);
      
      Controller.buildRequest(auth, apiOptions, "http://" )
      .then( function(res){ done(); } )
      .fail( function(err){ console.error(err); }  )
    });
    
    it('should build a update request', function(done){
      var auth= { instance_url: "localhost:4000" , access_token: "abcd1" };
      var params= { objectType: "Account", objectId: "1" }
      var data = { Name: "test" };
      var apiOptions = SalesforceAPI.update(data, params);
      
      Controller.buildRequest(auth, apiOptions, "http://" )
      .then( function(res){ done(); } )
      .fail( function(err){ console.error(err); }  )
    });
    
    it('should build a retrieve request', function(done){
      var auth= { instance_url: "localhost:4000" , access_token: "abcd1" };
      var params= { objectType: "Account", objectId: "1" }
      var data = {};
      var apiOptions = SalesforceAPI.retrieve(data, params);
      
      Controller.buildRequest(auth, apiOptions, "http://" )
      .then( function(res){ done(); } )
      .fail( function(err){ console.error(err); }  )
    });
    
    it('should build a create request', function(done){
      var auth= { instance_url: "localhost:4000" , access_token: "abcd1" };
      var params= { objectType: "Account", objectId: "1" }
      var data = { };
      var apiOptions = SalesforceAPI.del(data, params);
      
      Controller.buildRequest(auth, apiOptions, "http://" )
      .then( function(res){ done(); } )
      .fail( function(err){ console.error(err); }  )
    });
    
    it('should build a query request', function(done){
      var auth= { instance_url: "localhost:4000" , access_token: "abcd1" };
      var params= {}
      var data = { query: "select id from Account"};
      var apiOptions = SalesforceAPI.query(data, params);
      
      Controller.buildRequest(auth, apiOptions, "http://" )
      .then( function(res){ done(); } )
      .fail( function(err){ console.error(err); }  )
    });
    
    it('should build a search request', function(done){
      var auth= { instance_url: "localhost:4000" , access_token: "abcd1" };
      var params= {}
      var data = { search: "select id from Account"};
      var apiOptions = SalesforceAPI.search(data, params);
      
      Controller.buildRequest(auth, apiOptions, "http://" )
      .then( function(res){ done(); } )
      .fail( function(err){ console.error(err); }  )
    });
    
  });

  describe('Controller getServiceName', function(){

    it('should return create', function(){
      var req = {}
      req.route = {}
      req.route.method = "POST";
      req.query = {}
      req.body = {}
      Controller.getServiceName(req).should.equal("create")
    });

    it('should return update', function(){
      var req = {}
      req.route = {}
      req.route.method = "PUT";
      req.query = {}
      req.body = {}
      Controller.getServiceName(req).should.equal("update")
    });

    it('should return get', function(){
      var req = {}
      req.route = {}
      req.route.method = "GET";
      req.query = {}
      req.body = {}
      Controller.getServiceName(req).should.equal("retrieve")
    });

    it('should return get', function(){
      var req = {}
      req.route = {}
      req.route.method = "GET";
      req.query = { query: true }
      req.body = {}
      Controller.getServiceName(req).should.equal("query")
    });

    it('should return get', function(){
      var req = {}
      req.route = {}
      req.route.method = "DELETE";
      req.query = { query: true }
      req.body = {}
      Controller.getServiceName(req).should.equal("del")
    });

    it('should return get', function(){
      var req = {}
      req.route = {}
      req.route.method = "GET";
      req.query = { search: true }
      req.body = {}
      Controller.getServiceName(req).should.equal("search")
    });

  });
  
});
  /* 

  describe('req', function(){
    describe('.xhr', function(){
      it('should return true when X-Requested-With is xmlhttprequest', function(done){
        var app = express();

        Controller( app,  { route: "/salesforce" } );

        request(app)
        .get('/salesforce/Account/1')
        .end(function(error, res){
        
          console.log(arguments)
          done();
        });
      });
    });
  });

*/
