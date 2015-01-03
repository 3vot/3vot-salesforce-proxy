var request = require('superagent');
var querystring = require("querystring")
var jsforce = require('jsforce');
var express = require('express');
var router = express.Router();
var debug = require("debug")('development');

router.all("/login/callback", loginCallback);
router.get("/login/password", password )  ;
router.get("/login", login );
router.get("/login/whoami", whoami );
router.get("/logout", logout );


module.exports = router;
router.getConnection = getConnection;

function getConnection(req, res){
  if( !req.session.salesforce && !req.get("salesforce") ){
    onError(res, "Session is not valid, please login");
    return false;
  }
  var session = JSON.parse(req.session.salesforce || req.get("salesforce"));

  var credentials = { 
    oauth2 : {
      clientId : process.env.SALESFORCE_CLIENT_ID,
      clientSecret : process.env.SALESFORCE_CLIENT_SECRET,
      redirectUri : process.env.SALESFORCE_REDIRECT_URL
    },
    instanceUrl : session.instance_url,
    accessToken : session.access_token,
    refreshToken : session.refresh_token
  }

  var conn = new jsforce.Connection( credentials );
    
  conn.on("refresh", function(accessToken, res) {
    req.session.salesforce.access_token = accessToken;
  });

  req.conn = conn;
  return true;
}

function logout(req,res){
  req.session.saleforce = false;
  res.send(200);
}

function whoami(req, res){
  if(!getConnection(req, res)) return;
  req.conn.identity(function(err, identity) {
  if (err) onError(res, err);
  else res.send( identity );
  });
}

//Retrieves the Salesforce Auth and adds it to the session
function password(req, res, test) {
  var options = {
    grant_type: "password",
    client_id:  process.env.SALESFORCE_CLIENT_ID,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET,
    username: req.query.username || req.body.username || process.env.SALESFORCE_USERNAME,
    password: req.query.password || req.body.password || process.env.SALESFORCE_PASSWORD,
  }

  var protocol = "https://";
  if(test === true || req.test) protocol = "http://"; //for testing

  var loginServer = req.body.login_server || req.query.login_server || "login.salesforce.com";
  var url = protocol + loginServer + "/services/oauth2/token";

  var r = request.post(url)
  .type("application/x-www-form-urlencoded")
  .send(options)
  .on("error", function(err){ return onError(res, err); })
  .end(function(sfRes){
    if(sfRes.error) return onError(res, sfRes.error + " " + JSON.stringify(sfRes.body) );
    req.session.salesforce = JSON.stringify( sfRes.body );
    if (process.env.NODE_ENV === 'development') router.session = req.session.salesforce;
    res.redirect( req.query.app_url || process.env.SALESFORCE_FINAL_URL || "/login/whoami" )
  })
};

//Starts the Salesforce Server Dance Auth Leg 1
function login(req, res, test) {
  var protocol = "https://";
  if(test === true || req.test) protocol = "http://";  //for testing

  var loginServer = req.query.login_server || "login.salesforce.com";
  var url = protocol + loginServer + "/services/oauth2/authorize";
  
  var state = JSON.stringify({
    loginServer: loginServer,
    appUrl: req.query.app_url || process.env.SALESFORCE_FINAL_URL || "/login/whoami",
    profile: req.query.profile
  });

  var options = {
    response_type: "code",
    client_id: process.env.SALESFORCE_CLIENT_ID,
    redirect_uri: process.env.SALESFORCE_REDIRECT_URL,
    state: state
  }
  
  return res.redirect(url + "?" + querystring.stringify(options) );
}

//Callback for the Salesforce Server Dance Auth Leg 2, adds the auth token to session
function loginCallback(req, res, test) {
  var state = JSON.parse(req.query.state);
  console.dir( state );
  var protocol = "https://";
  if(test === true || req.test) protocol = "http://";  //for testing

  var url = protocol + state.loginServer + "/services/oauth2/token";

  var options = {
    code: req.query.code,
    grant_type: 'authorization_code',
    client_id: process.env.SALESFORCE_CLIENT_ID,
    redirect_uri: process.env.SALESFORCE_REDIRECT_URL,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET
  }
  
  request.post(url)
  .type("application/x-www-form-urlencoded")
  .send(options)
  .on("error", function(err){ return onError(res,err); })
  .end(function(sfRes){
    if(sfRes.error) return onError(res, sfRes.error);
    console.dir( sfRes.body )
    req.session.salesforce = JSON.stringify( sfRes.body );
    res.redirect(state.appUrl)
  })
}

function onError(res, error) {
 console.error("ERROR")
 console.dir(error);
 res.status(503);
 return res.send(error);
}

