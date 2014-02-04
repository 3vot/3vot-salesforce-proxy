NOTE: Project and Documentation in Progress. 
NOT FOR PRODUCTION
Version: 0.0.2

3vot-salesforce-proxy
=====================

Salesforce Production NodeJS Proxy Server that translates SF-REST-API into standard REST to be consumed by BackboneJS, SpineJS, Angular, Ember, etc. It includes an OAUTH Authentication Strategy for OAUTH 2.0 Password and Server and Cookie Stateless Session Management for infinite scalability


Overview
====================

Salesforce uses OAUTH 2.0 for authentication and does not provide CORS to connect directly from Web Apps.

This is a proxy, that enables MVC Frameworks to connect out of the box with Salesforce

This Modules is designed to be used in a Express App and deployed to a Cloudaas such as Heroku, Aws, etc

For a commercial solution, visit backend.3vot.com where you'll be able to use this service with a 1-click Install using Salesforce Connected Apps Technology.



Install
---------------------
$ npm install 3vot-salesforce-proxy


Getting Started
---------------------

This module is configured by default to be used with the 3VOT Platform, but it's easily configured to run as a standalone.

The module uses the concept of Multi-Tenant Authentication with Salesforce, so that multiple Apps can use the module as a Proxy. The Salesforce Remote App Keys are stored on a DataStore, but they can easily be obtained from process.env configuration settings. By default keys are stored in Parse.com service under a Profile and Provider Key.

The module stores Salesforce Authorization Token in the Express Session, by default with the key salesforceToken; The Salesforce Proxy Component will look for the Salesforce Authorization Token in req.session.salesforceToken and use it to sign every request to Salesforce.

3VOT Salesforce Proxy exposes two components, they are Login and Controller.

The Login component registers the routes necessary to Login to salesforce.

var Login = (3vot-salesforce-proxy).Login;

Login takes two arguments: ( app, options )
 App is the Express App, and options customises the component

 Login(app, { route: string , tokenMiddleware: function } );

 route is the prefix you want to set to the Salesforce Login Component, for example "/sessions/login" or "/auth"

 tokenMiddleware is the Route Middleware with the form (req,res,next) that sets the Salesforce Tokens to req.tokens. The login components will search for the Auth Keys in req.tokens.salesforce and its form is: { SALESFORCE_CLIENT_ID: "", SALESFORCE_CLIENT_SECRET: "", SALESFORCE_REDIRECT_URL: "" }

The Controller component registers the routes necessary to Proxy REST API Request to Salesforce

var Controller = (3vot-salesforce-proxy).Controller;

Controller takes two arguments: ( app, options )
 App is the Express App, and options customises the component

 route is the prefix you want to set to the Salesforce Login Component, for example "/proxy" or "/v1"

 authMiddleware is the Authentication Middleware with the form (req,res,next) that sets the Salesforce Authentication Tokens to req.salesforceToken. The Salesforce Rest Api Proxy components will search for the Auth Keys in req.salesforceToken and its form is exactly what Salesforce Auth returns.


Setup out of the Box
________________________

Check out the test/manual.js for a simple example of how to setup with express.

In Express is essential to enable Sessions and that session data are available from req.session

Before you start Set you PARSE.COM API KEYS in /src/tokenMiddleware

$ node ./test/manual.js

Point your browser to http://localhost:3001/v1/login/[PROVIDER]/login?profile=[PROFILE]&app_url=[APP_URL]

[PROVIDER] and [PROFILE] are the Database Keys uses to query the Salesforce OAUTH Keys.

[APP_URL] is the URL you want the proxy server to redirect after Login was Successful.

With the provided demo express server, this looks like:

http://localhost:3001/v1/login/salesforce_local/login?profile=3vot&app_url=http://localhost:3001/v1/salesforce?query=select%20id%20from%20account


Custom Setup
________________________

You can modify the operation of 3VOT Salesforce Proxy by creating new Route Middleware. Review src/authMiddleware and src/tokenMiddleware

Simply create a modified authMiddleware and tokenMiddleware to adjust to your use case.


Using the API
______________________
The 3VOT Salesforce Proxy works directly with Salesforce, it does not store any information on the server. The Server is Stateless.

To use the api is very simple. Point your AJAX Request to this service with the following routes:

options.route + "/:objectType?/:objectId?"

to get an object 

GET http://localhost/v1/salesforce/Account/50130000000014c

To create an object

POST http://localhost/v1/salesforce/Account

To modify an object

PUT http://localhost/v1/salesforce/Account/50130000000014c

to delete an object

DELETE http://localhost/v1/salesforce/Account/50130000000014c

to query

GET http://localhost/v1/salesforce/?query=select+id+from+salesforce

to search

GET http://localhost/v1/salesforce/?search=select+id+from+salesforce

other API

More Saleforce Rest Endpoints will be published real soon


Ajax Indications
________________________

By default Browsers do not accept sending AJAX requests to other domains, make sure you enable CORS in your Express Server

In order for your browser and server to exchange Cookies, enable the header withCredentials:true on your Ajax Request


Support
________________________
3VOT Saleforce Proxy is supported by 3VOT Corporation and it's a core component of the 3VOT Plataform @ 3vot.com

For support or to use our commercial version, please visit http://backend.3vot.com it only takes a 1-Click Salesforce Install

Thank You




