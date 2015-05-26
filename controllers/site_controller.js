var path = require('path');
var multer = require('multer');

exports.render = function(view) {
	var middleware = function(req, res) {
		res.render(view);
	}

	return middleware;
}

exports.redirect = function(path) {
	var middleware = function(req, res) {
		res.redirect(path);
	}

	return middleware;
}

exports.title = function(title, subtitle) {
	var middleware = function(req, res, next) {
		res.locals.title = title;
		res.locals.subtitle = subtitle;
		next();
	}

	return middleware;
}

exports.multer = multer({ dest: path.join(__dirname, '../public/media/') });