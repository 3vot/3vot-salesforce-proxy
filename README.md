NOTE: Project and Documentation in Progress. 
NOT FOR PRODUCTION
Version: 0.0.2

3vot-salesforce-proxy
=====================

Salesforce Production NodeJS Proxy Server that translates SF-REST-API into standard REST to be consumed by BackboneJS, SpineJS, Angular, Ember, etc. It includes an OAUTH Authentication Strategy for OAUTH 2.0 Password and Server and Cookie Stateless Session Management for infinite scalability


Overview
====================

Salesforce uses OAUTH 2.0 for authentication and does not provide CORS to connect directly from Web Apps.

This is an intelligence proxy that enables MVC Frameworks to connect out of the box with Salesforce. A regular proxy is not enough because it over complicates the frontend and requires frontend developers to know Apex, which makes a project 3X more expensive.

This Modules is designed to be used as an standalone or in a Express App and deployed to the Cloud such as Heroku, Aws, etc

This package is supported by 3VOT Corporation.

Install
---------------------
$ npm install 3vot-salesforce-proxy


Using as Standalone
---------------------


1. Setup the following ENV Variables:
SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_REDIRECT_URL, NODE_ENV

2. Start the server:
If you are using foreman and heroku run it with `node ./bin/www`, if not start it with `node ./bin/ww`. For local development start it with `node ./bin/w`.

The difference lies in the way enviroment variables are loaded, make sure to store them in the .env file in project root and keep them that file from going into source control.

3. Login
Visit /login in order to login into Salesforce using oauth2

Users may also login via username/password, using the /login/password route

After login the proxy will redirect depending on the following rules:

1. app_url: It will use the app_url query string provided to the login route. /login?app_url=myapp.com/start
2. SALESFORCE_FINAL_URL: ENV variable that points to a final route, use it when you only have one app.
3. /login/whoami: By default, the proxy will redirect to the whoami route, the browser will end up here so it's not good to use the default other than when testing for development.

If you are running the proxy in development, there is also the /session route. Which will output Salesforce Security Token, this is valid for testing and easily obtaining tokens. It will not be available in production becase you'll set the ENV Variable NODE_ENV to 'production'

4. Using the Proxy
The Proxy is based and uses jsforce, so follow up on JSFORCE documentation, study the tests provide in this repo or request support from us.

The proxy is designed to work out of the box with Javascript Models, specially clay-model using clay-model-salesforce-api.

When using clay-model, apps without code modification between Visualforce Remoting deployed inside Salesforce or deployed Externally using the API and this Proxy.

More information about using the proxy can be found in clay-model and clay-model-salesforce-api repositories in 3VOT Profile in Github.

4. CORS

Set the allowed domains on the enviroment variable ORIGINS=*.DOMAIN.com , other domains separated by ','



Using in another server
--------------------
In order to use this proxy in your server, simple use the login and api route. The login route is not really necessary, as long as the salesforce property is defined in the session. The saleforce property is stored just like salesforce returns it.


Support
________________________
3VOT Saleforce Proxy is supported by 3VOT Corporation and it's a core component of the 3VOT Plataform @ 3vot.com

For support or to use our commercial version, please visit http://backend.3vot.com it only takes a 1-Click Salesforce Install

Thank You




