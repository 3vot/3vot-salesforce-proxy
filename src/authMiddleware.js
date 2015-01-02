//Get the Auth Token from the Session or ends the https request with 503 if not found

module.exports = function getToken(req,res,next){

  var providerName = req.headers['X-3VOT-PROVIDER'] || "salesforce";

  if (req.headers['authorization']) {
    req.salesforceToken = JSON.parse(req.headers['authorization']);
  }

  else if (req.session && req.session.logins && req.session.logins[providerName]){ 

    req.salesforceToken = req.session.logins[providerName];
  }
  
  if(req.salesforceToken) return next();
  res.status(503)
  return res.send("Salesforce Authentication Token not found in session or in authorization header for provider: " + providerName );
}