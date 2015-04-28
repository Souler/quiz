var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var auto = function(req, res, next) {
	var app = req.app;
	var p = req.path.substring(1);
	if (p.length <= 0)
		p = 'index';

	var file = path.join(app.get('views'), p + '.' + app.get('view engine'));

	if (fs.existsSync(file))
		res.render(p);
	else
		next();
}

router.get('*', auto);

module.exports = router;
