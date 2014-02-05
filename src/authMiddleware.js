//Get the Auth Token from the Session or ends the https request with 503 if not found


module.exports = function getToken(req,res,next){

    if (req.headers['authorization']) {
      req.salesforceToken = JSON.parse(req.headers['authorization']);
    }

    else if (req.session && req.session.logins && req.session.logins.salesforce){ 
      req.salesforceToken = req.session.logins.salesforce; 
    }
    
    if(req.salesforceToken) return next();
    res.status(503)
    return res.send("Salesforce Auth Token not found in session or in authorization header " + req.salesforceToken);
}