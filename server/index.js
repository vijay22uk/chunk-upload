(function () {
    'use strict';
    var port = process.env.PORT || 8080;
	var express = require('express');
    var app = express();
	var http = require('http').Server(app);
	app.use(express.static('./public'));
	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});

	http.listen(port, function () {
		console.log('listening on *:' + port);
	});

})();