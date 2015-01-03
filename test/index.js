if( process.env.NODE_ENV != "production"){
	var dotenv = require('dotenv');
	dotenv._getKeysAndValuesFromEnvFilePath( process.env.PWD + "/.denv"  );
	dotenv._setEnvs();
}

var test = require('tape');

var superagent = require("superagent");

var app = require('../app');
var login = require("../routes/login");

app.set('port', process.env.PORT || 3999);
var api = "http://localhost:" + app.get("port");

var salesforceAuth;
var account;

var server = app.listen(app.get('port'), function() {
  
	test('login', function (t) {
	  t.plan(1);

		superagent.get( api + "/login/password", function(res){
			superagent.get( api + "/session", function(res){				
				salesforceAuth = login.session;
				t.equal(res.status, 200);
			});
		})
	});

	test('Should Query and return several accounts', function (t) {
	  t.plan(1);
		superagent.get( api + "/api/Account?query=select id,name from Account")
		.set("salesforce", salesforceAuth)
		.end( function(res){
			t.equal(res.status, 200);
		})
	});

	test('should create an account', function (t) {
	  t.plan(2);
		superagent.get( api + "/api/Account?gettify=post&Name=Test Account")
		.set("salesforce", salesforceAuth)
		.end( function(res){
			t.equal(res.status, 200);
			
			account = res.body
			t.equal( account.Id != null,true );
			
			//console.log(res.body);
			//account = res.body.records[0];
		})
	});

	test('should update an account', function (t) {
	  
	  t.plan(1);
		superagent.get( api + "/api/Account?gettify=put&Id="+account.Id+"&name=Test Account 1")
		.set("salesforce", salesforceAuth)
		.end( function(res){
			t.equal(res.status, 200);
			console.log( res.body )
			//account = res.body.records[0];
		})
	});


	test('should update an account', function (t) {
	  
	  t.plan(1);
		superagent.get( api + "/api/Account/"+account.Id+"?gettify=put&Name=Test Account 2")
		.set("salesforce", salesforceAuth)
		.end( function(res){
			t.equal(res.status, 200);
			//account = res.body.records[0];
		})
	});

	test('should retrieve an account', function (t) {	  
	  t.plan(1);
		superagent.get( api + "/api/Account/"+account.Id+"?gettify=get")
		.set("salesforce", salesforceAuth)
		.end( function(res){
			t.equal(res.status, 200);
			//account = res.body.records[0];
		})
	});


	test('should retrieve an account with wrong id', function (t) {	  
	  t.plan(1);
		superagent.get( api + "/api/Account/"+account.Id + "FGH" +"?gettify=get")
		.set("salesforce", salesforceAuth)
		.end( function(res){
			t.equal(res.status, 404);
			//account = res.body.records[0];
		})
	});

	test('should destroy an account', function (t) {
	  
	  t.plan(1);
		superagent.get( api + "/api/Account/"+account.Id+"?gettify=del")
		.set("salesforce", salesforceAuth)
		.end( function(res){
			t.equal(res.status, 200);
			//account = res.body.records[0];
		})
	});


	test("end", function(t){
		t.plan(1);
		t.equal(1,1);
		server.close();
	});


});

