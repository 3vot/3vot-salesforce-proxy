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
  
  app.all(options.route + "/:objectType?/:objectId?", options.authMiddleware ,function(req, res) {

    var apiOptions = SalesforceApi[getServiceName(req)]( extend(req.body, req.query), req.params );
    
    buildRequest(req.salesforceToken, apiOptions)
    .then( function(proxyResponse){ success(req, res, proxyResponse)  }  )
    .fail( function(err){ error(req, res, err)  }  );
   });

   function success(req,res,proxyResponse){
     res.send(proxyResponse);
   }

   function error(req,res,error){
     res.status(500);
     res.send( error )
   }
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
//  auth: Salesforce AuthObject
//  apiOptions: the API Query and Body Params
//  httpProtocol(optional): The protocol to use, defaults to https://
// returns a promise
function buildRequest( auth, apiOptions, httpProtocol ){
  var deferred = Q.defer()
  if(!httpProtocol) httpProtocol = "";

  apiOptions.path = httpProtocol + auth.instance_url + apiOptions.path;  
  
  var r = request[apiOptions.method.toLowerCase()](apiOptions.path)
  .accept("application/json")
  .set("Accept-Encoding", "gzip")
  .set("Authorization", "Bearer " + auth.access_token)
  .query(apiOptions.query || {})
  .on('error', function(error){ deferred.reject(error); })
  .send(apiOptions.data || {})
  .end( function(res){
    if( res.error ) return deferred.reject(res.error)
    return deferred.resolve(res.body)
  });
  
  return deferred.promise;  
}

module.exports = config;
config.getServiceName = getServiceName;
config.buildRequest = buildRequest;
