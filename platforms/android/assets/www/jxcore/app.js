console.log('JXCORE BACK LOADED : ' + __dirname);

var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	next();
});

app.get('/version', function (req, res) {
	Mobile('getVersion').call(function (version){
		res.status(200).send({ app: 'kioskApp', version: version});
	});
	//res.status(200).send({ app: 'kioskApp', version: '1.0.0'});
	/*Mobile('getVersion').registeAsync(function (callback) {
		
		res.status(200).send({ app: 'kioskApp', version: ''})
	});*/
});

app.post('/loadUrl', function (req, res) {
	if(req.body && req.body.url) {
		Mobile('loadUrl').call(req.body.url);
		res.status(200).send();
	} else {
		res.status(500).send('wrong parameters' + JSON.stringify(req.body));
	}
});

app.post('/reload', function (req, res) {
	Mobile('reload').call();
	res.status(200).send();
});

var server = app.listen(1664, function () {
  console.log("Express server is started. (port: 1664)");
});