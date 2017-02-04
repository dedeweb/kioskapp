console.log('JXCORE BACK LOADED : ' + __dirname);

var express = require('express');
var bodyParser = require('body-parser');
//var request = require('request');
var app = express();
//var appProxy = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/*
appProxy.all('/*', function (req, res) {

    var url = 'http://192.168.0.2:4201' + req.url;

    console.log('[kioskapp] proxy to url : ' + url);
    //logger.log('proxy request. \n url: ' + url  + '\n verb: ' + verb + '\n data: ' + JSON.stringify(data));
    var req2;
    if(req.method == 'POST') {
        req2 = request.post({uri: url, json: req.body});
    } else {
        req2 = request(url);
    }
    req.pipe(req2).pipe(res);
    //req2.pipe(res).on('error', function(err){res.status(500).send(err);});
});*/


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

app.post('/exit', function (req, res) {
	Mobile('exit').call()
    res.status(200).send();
});

app.post('/fullscreen', function (req, res) {
	Mobile('fullscreen').call()
    res.status(200).send();
});


app.post('/reload', function (req, res) {
	Mobile('reload').call();
	res.status(200).send();
});

app.listen(1664, function () {
	console.log("[http]express server is started. (port: 1664)");
});
/*
appProxy.listen(1665, function () {
	console.log("[proxy] express server is started (port: 1665)");
});*/