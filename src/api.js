var RestApi = {}
RestApi.apiVersion = "28.0";

module.exports = RestApi;

RestApi.versions = function() {
  var options = {
    path: "/",
    method: "GET"
  };
  return options;
};

RestApi.resources = function() {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/",
    method: "GET"
  };
  return options
};

RestApi.describeGlobal = function() {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/",
    method: "GET"
  };
  return options
};

RestApi.identity = function(params) {
  var options = {
    path: "/services/data/" + params.objectId,
    method: "GET"
  };
  return options;
};

RestApi.metadata = function(data, params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/" + params.objectType + "/",
    method: "GET"
  };
  return options;
};

RestApi.describe = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/" + params.objectType + "/describe/",
    method: "GET"
  };
  return options;
};

RestApi.create = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/" + params.objectType + "/",
    method: "POST",
    data: data
  };
  return options;
};

RestApi.retrieve = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/" + params.objectType + "/" + params.objectId + (data.fields ? "?fields=" + data.fields : ""),
    method: "GET"
  };
  return options;
};

RestApi.upsert = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/" + params.objectType + "/" + data.externalIdField + "/" + data.externalId + "/",
    method: "PATCH",
    data: data
  };
  return options;
};

RestApi.update = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/" + params.objectType + "/" + params.objectId + "/",
    method: "PATCH",
    data: data
  };
  return options;
};

RestApi.del = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/sobjects/" + params.objectType + "/" + params.objectId + "/",
    method: "DEL"
  };
  return options;
};

RestApi.search = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/search/",
    method: "GET",
    query: { q: data.search }
  };
  return options;
};

RestApi.query = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/query/",
    method: "GET",
    query: { q: data.query }
  };
  return options;
};

RestApi.queryMore = function(data,params) {
  var options = {
    path: data.nextRecordsUrl
  };
  return options;
};

RestApi.rest = function(data,params) {
  var path = "/services/apexrest/" + data.restRoute;
  var body = {}
  var query = {}
  if(data.method === "GET" || data.method === "get"){
    query = JSON.parse(data.restData)
  }
  else{
    body = JSON.stringify(data.restData);
  }
      
  var options = {
    path: path,
    method: data.restMethod,
    data: restData,
    query: query
  };
  return options;
};

RestApi.recordFeed = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/chatter/feeds/record/" + params.objectId + "/feed-items",
    method: "GET"
  };
  return options;
};

RestApi.newsFeed = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/chatter/feeds/news/" + params.objectId + "/feed-items",
    method: "GET"
  };
  return RestApi.request(options);
};

RestApi.myNews = function() {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/chatter/feeds/news/me",
    method: "GET"
  };
  return options;
};

RestApi.profileFeed = function(data,params) {
  var options = {
    path: "/services/data/v" + RestApi.apiVersion + "/chatter/feeds/user-profile/" + params.objectId + "/feed-items",
    method: "GET"
  };
  return options;
};
