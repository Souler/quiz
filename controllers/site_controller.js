exports.render = function(view) {
	var middleware = function(req, res) {
		res.render(view);
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