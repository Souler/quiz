var userController = require('./user_controller');

exports.create = function(req, res, next) {
	var login = req.body.login;
	var pass = req.body.pass;

	userController.authenticate(login, pass, function(err, user) {
		if (err) {
			req.session.errors = [ { message: err.message } ];
			res.redirect('/login');
			return;
		}

		req.session.errors = [];
		req.session.user = { id: user.id, username: user.username };
		var redir = req.session.redir || '/';
		res.redirect(redir.toString());
	})
}

exports.destroy = function(req, res, next) {
	delete req.session.user;
	var redir = req.session.redir || '/';
	res.redirect(redir.toString());
}

exports.require = {};
exports.require.login = function(req, res, next) {
	if (req.session.user)
		next();
	else
		res.redirect('/login');
}