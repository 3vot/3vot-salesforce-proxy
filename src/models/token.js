var Q = require("q")

var Parse = require("parse").Parse
Parse.initialize( process.env.PARSE_APP_ID, process.env.PARSE_REST_KEY );


module.exports = { getTokens: getTokens }

function getTokens(profile, provider){
  var deferred = Q.defer();
  
  var Tokens = Parse.Object.extend("Tokens");
  var query = new Parse.Query(Tokens);
  query.equalTo("profile", profile);
  query.equalTo("provider", provider);
  query.find({
    success: function(results) {
      if(results.length == 0) return deferred.reject("No tokens found for " + provider + " in " + profile );
      return deferred.resolve( results[0].get("tokens") );
    },
    error: function(err) {
      return deferred.reject(err);
    }
  });

  return deferred.promise;

}