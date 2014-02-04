var Parse = require("parse").Parse
Parse.initialize( process.env.PARSE_APP_ID || "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", process.env.PARSE_REST_KEY || "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

module.exports = function getTokens(req, res, next){

 var state = {};
 if(req.query.state) state = JSON.parse(req.query.state);

  //For Testing and External Compability
  if (req.headers['tokens']) {   
    req.tokens = JSON.parse(req.headers['tokens']);
    req.test = true;
    req.session = {};
    return next()
  }
  
  var Tokens = Parse.Object.extend("Tokens");
  var query = new Parse.Query(Tokens);
  query.equalTo("profile", req.query.profile || req.body.profile || state.profile);
  query.equalTo("provider", req.params.provider);
  query.find({
    success: function(results) {
      if(results.length == 0) return sendError("We could not find any tokens",404)
      var token = results[0]
      if(!req.tokens) req.tokens = {}
      req.tokens = results[0].get("tokens")
      next()
    },
    error: function(err) {
      return sendError(err);
    }
  });
  
  function sendError(err,status){
    res.status(status || 500);
    return res.send(err);
  }
}