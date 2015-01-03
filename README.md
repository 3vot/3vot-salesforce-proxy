[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

# 3vot-salesforce-proxy

## WHY

Salesforce uses OAUTH 2.0 for authentication and does not provide CORS to connect directly from Web Apps.

More importantly the Salesforce REST API is not designed to be frontend friendly. Most Models and AJAX modules won't work. Salesforce App Developers end up not using models and communicating with Salesforce REST API directly. This approach requires knowledge of APEX and Salesforce, makes App Development much more expensive and breaks M*VC.

## What

A Production Proxy Server written in NodeJS with clustering that translates standard traditional REST to Salesforce Rest API. It makes it easy work with Salesforce Data in Javascript. 

Developers can simply create object `Account.create({ Name: "Acme" })` - query `Account.query("select id, name from account")` - update and delete 'account.save()' - 'account.delete()'.

This way frontend developers can build Salesforce Apps, reducing costs and improving development speed in several by 3X+.

The server includes Login based in oauth2 or password, handles session refresh and it's stateless, so it can be scaled instantly up to infinity.

## How

Simply use the Heroku Button to get your Proxy Server Running now!
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Deploy from NPM by using the file app.js as or bin/www as node start script.

Use the routes in routes/login and routes/api in your own server, making sure you are using the cookie-session NPM module

## More

This Server is part of [ClayForSalesforce.com](http://clayforsalesforce.com) , a platform to develop Modern Frontend Apps for Salesforce as Visualforce/Static Resources, in the Browser and in Mobile Devices.

Salesforce has a particular Rest idiosyncrasy in that it returns null for updates and deletes, they mix Id and id fields and return the Rest results wrapped in another object. It should work with most Ajax Models if you cater for this issues.

ClayforSalesforce has a versatile model called Clay Model that can be used in conjuntion with the Salesforce APi Adapter called clay-model-salesforce-api which makes everything works out of the box and as an additional featurea only sends modified fields on update, which is great while dealing with update in context of CRUD and FLS Security.


This package is supported by 3VOT Corporation.

## Install

$ npm install 3vot-salesforce-proxy

## Setup
Setup can be somewhat accelerated by using the Heroku button > APP_NAME, then `heroku clone ` and `heroku config:pull`

1. Create a Salesforce Connect App for localhost (localhost:5000) and one for production ( using your server url or xxxx.herokuapp.com )

2. Setup the following ENV Variables file .env and .denv
SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_REDIRECT_URL, NODE_ENV, ORIGINS

Check this gist for a quick format: https://gist.github.com/rodriguezartav/b5ed90528075777d2edd

## Getting Started
Start the server
Production `foreman start` - auto loads .env
Production `./bin/ww` - loads .env 
Development `./bin/w` - loads .denv

Point your browser to http://localhost:5000/login , check out /session and /whoami

## Using from an App
First you must login, point your browser to the /login route make sure to supply and app_url query string variable. This is the URL where the Proxy will redirect after login. You can also hardcode this value as ENV-VARIABLE called SALESFORCE_FINAL_URL

Now make regular HTTP REST API Calls GET,POST,PUT,DEL using OBJECT/ID url's

Get requests with a ?query=select... querystring are treated as SOQL Queries, add autoFetch and maxFetch query string params to control how many records to return. ie: http://localhost:5000/Account?query="select id, name from Account&autoFetch=true&maxFetch=10000"

Also available is the Apex Rest route [GET,POST,PUT,DEL,PATCH] apex/method where method is the APEX TEST method name. Params can be supplied in http body when [POST,PUT,DEL,PATCH], for GET request include querystring with the method name. apex/method?param1=true

## Rules
After login the proxy will redirect depending on the following rules:

1. app_url: It will use the app_url query string provided to the login route. /login?app_url=myapp.com/start
2. SALESFORCE_FINAL_URL: ENV variable that points to a final route, use it when you only have one app.
3. /login/whoami: By default, the proxy will redirect to the whoami route, the browser will end up here so it's not good to use the default other than when testing for development.

If you are running the proxy in development, there is also the /session route. Which will output Salesforce Security Token, this is valid for testing and easily obtaining tokens. It will not be available in production becase you'll set the ENV Variable NODE_ENV to 'production'

### Using the Proxy
The Proxy is based and uses jsforce, so follow up on JSFORCE documentation, study the tests provide in this repo or request support from us.

The proxy is designed to work out of the box with Javascript Models, specially clay-model using clay-model-salesforce-api.

When using clay-model, apps without code modification between Visualforce Remoting deployed inside Salesforce or deployed Externally using the API and this Proxy.

More information about using the proxy can be found in clay-model and clay-model-salesforce-api repositories in 3VOT Profile in Github.

### CORS

Set the allowed domains on the enviroment variable ORIGINS=*.DOMAIN.com , other domains separated by ','

### Clustering
This API Proxy server is enabled with clustering, we also use forking to make sure any unhandled exception won't stop the server, just the worker while the master just spins up a new worker.


## Using in another server

In order to use this proxy in your server, simple use the login and api route. The login route is not really necessary, as long as the salesforce property is defined in the session. The saleforce property is stored just like salesforce returns it.

## Testing
First create and fill in the file .denv that runs on development. Make sure to create a Salesforce Connected App that points to http://localhost:5000/login/callback and set the Client Id and Secret on .denv file.


Using Tape, run `tape ./test`


# Support

3VOT Saleforce Proxy is supported by 3VOT Corporation and it's a core component of the Clay Plataform @ 3vot.com


Thank You




