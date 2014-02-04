var getTokens = require("./tokenMiddleware")
var request = require('superagent');
var querystring = require("querystring")

function config(app, options){
  
  app.get(options.route + "/:provider/login", options.tokenMiddleware || getTokens , login )
  app.get(options.route + "/:provider/callback", options.tokenMiddleware || getTokens ,loginCallback)
  app.all(options.route + "/:provider/password", options.tokenMiddleware || getTokens , password )  
}

function password(req, res, test) {

  var options = {
    grant_type: "password",
    client_id: req.tokens.SALESFORCE_CLIENT_ID,
    client_secret: req.tokens.SALESFORCE_CLIENT_SECRET,
    username: req.query.username || req.body.query.username,
    password: req.query.password || req.body.query.password,
  }

  var protocol = "https://";
  if(test === true || req.test) protocol = "http://"; //for testing

  var loginServer = req.body.login_server || req.query.login_server || "login.salesforce.com";
  var url = protocol + loginServer + "/services/oauth2/token";

  request.post(url)
  .type("application/x-www-form-urlencoded")
  .send(options)
  .on("error", onError)
  .end(function(sfRes){
    if(!req.session){ console.error("Session not Active"); req.session = {}; }
    if(!req.session.logins) req.session.logins = {};
    req.session.logins["salesforce"] = sfRes.body;
    res.send(200)
  })


  function onError(error) {
   console.error("Salesforce Login Fail");
   console.error(error);
   res.status(503);
   return res.send(error);
  }   

};


function login(req, res, test) {
  var protocol = "https://";
  if(test === true || req.test) protocol = "http://";  //for testing
  
  var loginServer = req.query.login_server || "login.salesforce.com";
  var url = protocol + loginServer + "/services/oauth2/authorize";
  
  var state = JSON.stringify({
    loginServer: loginServer,
    appUrl: req.query.app_url,
    profile: req.query.profile
  });

  var options = {
    response_type: "code",
    client_id: req.tokens.SALESFORCE_CLIENT_ID,
    redirect_uri: req.tokens.SALESFORCE_REDIRECT_URL,
    state: state
  }
  
  return res.redirect(url + "?" + querystring.stringify(options) );

}

function loginCallback(req, res, test) {
  var state = JSON.parse(req.query.state);
  
  var protocol = "https://";
  if(test === true || req.test) protocol = "http://";  //for testing

  var url = protocol + state.loginServer + "/services/oauth2/token";

  var options = {
    code: req.query.code,
    grant_type: 'authorization_code',
    client_id: req.tokens.SALESFORCE_CLIENT_ID,
    redirect_uri: req.tokens.SALESFORCE_REDIRECT_URL,
    client_secret: req.tokens.SALESFORCE_CLIENT_SECRET
  }
  
  request.post(url)
  .type("application/x-www-form-urlencoded")
  .send(options)
  .on("error", onError)
  .end(function(sfRes){
    if(sfRes.error) return onError(sfRes.error);
    if(!req.session){ console.error("Session not Active"); req.session = {}; }
    if(!req.session.logins) req.session.logins = {};
    req.session.logins["salesforce"] = sfRes.body;
    res.redirect(state.appUrl)
  })
  
  function onError(error) {
   console.error("Salesforce Login Fail");
   console.error(error);
   res.status(503);
   return res.send(error);
  }

}


module.exports = config;
config.password = password;
config.login = login
config.loginCallback = loginCallback