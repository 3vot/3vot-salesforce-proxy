var SalesforceApi = require("./api");
var extend = require('node.extend');

SalesforceApi.apiVersion = "28.0";

var request = require("superagent")
var Q = require("q")

function getToken(req,res,next){

    if (req.headers['authorization']) {
      req.salesforceToken = JSON.parse(req.headers['authorization']);
    }

    else if (req.session && req.session.logins && req.session.logins.salesforce){ 
      req.salesforceToken = req.session.logins.salesforce; 
    }
    
    if(req.salesforceToken) return next();
    return res.send(503);
}

function config(app, options){
  if(options.apiVersion) SalesforceApi.apiVersion = options.apiVersion
  
  app.all(options.route + "/:objectType?/:objectId?", getToken ,function(req, res) {
    
    var apiOptions = SalesforceApi[getServiceName(req)]( extend(req.body, req.query), req.params );
    
    buildRequest(req.salesforceToken, apiOptions)
    .then( function(proxyResponse){ success(req, res, proxyResponse)  }  )
    .fail( function(proxyResponse){ success(req, res, proxyResponse)  }  );
   });
}

function success(req,res,proxyResponse){
  res.send(proxyResponse);
}

function error(req,res,error){
  res.status(500);
  res.send()
}

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

function buildRequest( auth, apiOptions, httpProtocol ){
  var deferred = Q.defer()
  if(!httpProtocol) httpProtocol = "https://";

  apiOptions.path = httpProtocol + auth.instance_url + apiOptions.path;  
  
  //console.log(request[apiOptions.method.toLowerCase()]("http://localhost:4000/"))
  
  request[apiOptions.method.toLowerCase()](apiOptions.path)
  .accept("application/json")
  .set("Accept-Encoding", "gzip")
  .set("Authorization", auth.access_token)
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
