var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var login = require('./routes/login');

var api = require('./routes/api');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieSession( { proxy: true, secret: "the last of the mohicans" } ));

app.use('/', login);
app.use('/api', api);

app.get("/", function(req,res){
  res.send( "<h1>Salesforce Proxy - Please visit <a href='/login'>/login</a></h1> to login." );
})

if (app.get('env') === 'development') {
  app.get("/session", function(req,res){
      app.session = req.session.salesforce;
      res.send( req.session.salesforce );
  })
}


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.stack);
  try{
  res.send( {
      message: err.message,
      error: err,
      stack: err.stack
  });
  }catch(e){ }
});


module.exports = app;
