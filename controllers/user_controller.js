var models = require('../models');
var User = models.User;

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