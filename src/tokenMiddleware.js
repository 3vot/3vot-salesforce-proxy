//Uses Parse to get Session Tokens

// Expected Tokens are:
// SALESFORCE_CLIENT_ID
// SALESFORCE_CLIENT_SECRET
// SALESFORCE_REDIRECT_URL
var Token  = require("./model/token")

module.exports = function getTokens(req, res, next){

 var state = {};
 if(req.query.state) state = JSON.parse(req.query.state);

  //For Testing and External Compability
  if (req.headers['tokens']) {   
    req.tokens = JSON.parse( req.headers['tokens'] );
    req.test = true;
    req.session = {};
    return next()
  }
  
  Token.getTokens( req.query.profile || req.body.profile || state.profile , req.params.provider  )
  .then( function(tokens){ req.tokens = tokens; next() }  )
  .fail( function(err){ return res.send(500, err); } )

}