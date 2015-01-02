var SalesforceApi = require("./api");
var extend = require('node.extend');
var authMiddleware = require("./authMiddleware")
var request = require("superagent")
var Q = require("q")

SalesforceApi.apiVersion = "29.0";

// Setup Controller Routes with Options
// params: 
//  app: Express App Instnace
//  options:
//    apiVersion: The Salesforce API Version to use. ( matches semver )
//    route: The route prefix
//    authMiddleware: The route middleware to get the salesforce authentication object into req.salesforceToken
function config(app, options){
  if(options.apiVersion) SalesforceApi.apiVersion = options.apiVersion
  if(!options.route) options.route = "";
  if(!options.authMiddleware) options.authMiddleware = authMiddleware
  
  app.all(options.route + "/query", options.authMiddleware ,function(req, res) {

    return restRoute(req,res, SalesforceApi.query( extend(req.body, req.query)));

   });
  
  app.all(options.route + "/:objectType?/:objectId?", options.authMiddleware ,function(req, res) {
    
    var apiOptions = SalesforceApi[getServiceName(req)]( extend(req.body, req.query), req.params );
    
    return restRoute(req,res, apiOptions);
   });


}

function restRoute(req,res, apiOptions){
  buildRequest(req.salesforceToken, apiOptions)
  .then( function(results) { res.send(results); } )
  .fail( 
    function(err){ 
      if( err.indexOf("INVALID_SESSION_ID") > -1 ){
        var key = req.headers['X-3VOT-PROVIDER'] || "salesforce";
        delete req.session.logins[key];
        return res.send(503, err);
      }
      res.send(500, err); 
    }
  );
}

// Translates the standard REST actions to Salesforce API Service Names
// Params: 
//  req: the request from express route
// Returns: An object the url and service query/body params
function getServiceName(req) {
  var service= "";
  method = req.route.method.toLowerCase();
  var translate = {
    "get"    : "retrieve",
    "post"   : "create",
    "put"    : "update",
    "delete" : "del"
  };

  if (method === "get" && req.query.query) service = "query";
  else if (method === "get" && req.query.search) service =  "search";
  else service = translate[method];
  
  return service;
};

// Builds a request for salesforce with query params and body params
// params: 
//  salesforceToken: Salesforce AuthObject
//  apiOptions: the API Query and Body Params
//  httpProtocol(optional): The protocol to use, defaults to https://
// returns a promise
function buildRequest( salesforceToken, apiOptions, httpProtocol, options ){
  var deferred = Q.defer()
  if(!httpProtocol) httpProtocol = "";
  if(options) options = {};

  apiOptions.path = httpProtocol + salesforceToken.instance_url + apiOptions.path;  
  
  var r = request[apiOptions.method.toLowerCase()](apiOptions.path)
  .accept("application/json")
  .set("Accept-Encoding", "gzip")
  .set("Authorization", "Bearer " + salesforceToken.access_token)
  .query(apiOptions.query || {})
  .on('error', function(error){ return deferred.reject(error); })
  .send(apiOptions.data || {})
  .end( function(res){
    if( res.error ) return deferred.reject(res.error + " " + JSON.stringify(res.body || {}) )
    if( res.body.done === false && apiOptions.autoFetch === "true" ){
      queryMore( salesforceToken, res.body )
      .then( function(allQueryResults){ deferred.resolve( allQueryResults ) } )
      .fail( function(err){ deferred.reject(err) } );
    }
    else{
      return deferred.resolve(res.body);
    }
  });  
  return deferred.promise;  
}

function queryMore(salesforceToken, lastResponse){
  var deferred = Q.defer()
  var allObjects = lastResponse.records;

  loadAll(lastResponse);

  function loadAll(lastResponse){
    var apiOptions = SalesforceApi.queryMore( lastResponse );
    
    buildRequest( salesforceToken, apiOptions)
    .then( 
      function(response){ 
        allObjects = allObjects.concat(response.records);

        if(response.done) deferred.resolve({ "done" : true, "totalSize" : allObjects.length, "records" : allObjects } );

        else loadAll(response); 

      }
    ).fail( function(err){ if(typeof err !== "string"){err = "Server Code Error in controller.queryMore " + err.toString()}; deferred.reject(err); } )
  };

  return deferred.promise;
}

module.exports = config;
config.getServiceName = getServiceName;
config.buildRequest = buildRequest;