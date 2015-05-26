var models = require('../models');
var User = models.User;

exports.load = function(req, res, next, userId) {
	User
	.find({ where: { id: Number(userId) } })
	.then(function(user) {
		if (!user)
			throw new Error('Id de usuario incorrecto');
		req.user = user;
	})
	.then(next)
	.catch(next)
}

exports.authenticate = function(login, password, cb) {
	User
	.find({ where: { username: login } })
	.then(function(user) {
		if (!user)
			throw new Error('No existe el usuario');

		if (!user.verifyPassword(password))
			throw new Error('Contrasena incorrecta');

		cb(null, user)
	})
	.catch(cb)
}

exports.require = {};
exports.require.ownership = function(req, res, next) {
	var user = req.user;
	var loggedUser = req.session.user;

	if (user.isAdmin || user.id == loggedUser.id)
		next();
	else
		res.redirect('/');
}