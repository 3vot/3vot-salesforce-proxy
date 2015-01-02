var Proxy, Q, should;

should = require("should");

Api = require("../src/api");
Api.apiVersion = "24.0";

describe("Salesforce Proxy", function() {
  before(function() {
  });
  
  it("should return a DELETE", function() {
    var params= {
      objectType: "Account",
      objectId: "1"
    }

    var data = {}

    var res = {};
    res = Api.del(data,params);
    res.path.should.equal("/services/data/v" + Api.apiVersion + "/sobjects/Account/1/");
    res.method.should.equal("DEL");
  });
 
 
  it("should return a UPDATE", function() {

    var params= {
      objectType: "Account",
      objectId: "1"
    }
   
    var data = { Name: "test" };
    
    var res = {};
    res = Api.update(data,params);
    res.path.should.equal("/services/data/v" + Api.apiVersion + "/sobjects/Account/1/");
    res.method.should.equal("PATCH");
    res.data.should.equal(data);

  });
  
  
  it("should return a CREATE", function() {

    var params= {
      objectType: "Account"
    }

    var data = { Name: "test" };
    
    var res = {};
    res = Api.create(data,params);
    res.path.should.equal("/services/data/v" + Api.apiVersion + "/sobjects/Account/");
    res.method.should.equal("POST");
    res.data.should.equal(data);
  });
  
  
  it("should return a retrieve", function() {
    
    var params= {
      objectType: "Account",
      objectId: "1"
    }
    
    var data = {};
    
    var res = {};
    res = Api.retrieve(data,params);
    res.path.should.equal("/services/data/v" + Api.apiVersion + "/sobjects/Account/1");
    res.method.should.equal("GET");
    
  });
  
  
  it("should return a query", function() {
   
    var params= {
      objectType: "Account",
      objectId: "id"
    }
   
    var data = {query: "id=5"};
   
    var res = Api.query(data,params);
    res.method.should.equal("GET");
    res.path.should.equal("/services/data/v" + Api.apiVersion + "/query/");
    JSON.stringify( res.query).should.equal( JSON.stringify({ q: "id=5"})) ;

  });
  
  
  it("should return a search", function() {
    
    var params= {};
    
    var data = {search: "id=5"};
    
    var res = Api.search(data,params);
    res.method.should.equal("GET");
    res.path.should.equal("/services/data/v" + Api.apiVersion + "/search/");
    JSON.stringify( res.query).should.equal( JSON.stringify({ q: "id=5"})) ;
    
  });

});