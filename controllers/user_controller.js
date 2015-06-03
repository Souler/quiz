var Sequelize = require('sequelize');
var models = require('../models');
var User = models.User;

exports.load = function(req, res, next, userId) {
	User
	.find({ where: { id: Number(userId) } })
	.then(function(user) {
		if (!user)
			throw new Error('Id de usuario incorrecto');
		req.user = user;
		res.locals.user = user;
	})
	.then(next)
	.catch(next)
}

exports.authenticate = function(login, password, cb) {
	User
	.find({ where: Sequelize.or({ username: login }, { email: login }) })
	.then(function(user) {
		if (!user)
			throw new Error('No existe el usuario');

		if (!user.verifyPassword(password))
			throw new Error('Contrasena incorrecta');

		cb(null, user)
	})
	.catch(cb)
}

exports.create = function(req, res, next) {
	var user = User.build(req.body.user);
	var fields = [ 'username', 'email', 'password'];

	user
	.validate()
	.then(function() {
		return user.save({ fields: fields })
	})
	.then(function() {
		req.session.user = user.toJSON();
		req.session.user.isAdmin = user.isAdmin();
		res.redirect('/');
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.locals.user = user.toJSON(); 
		res.render('user/new');
	})
}

exports.update = function(req, res, next) {
	var user = req.user;
	var fields = [ 'username', 'email', 'password'];

	user.username = req.body.user.username;
	user.email = req.body.user.email;
	if (req.body.user.password && req.body.user.password.length > 0)
		user.password = req.body.user.password;
	else
		fields.pop();

	user
	.validate()
	.then(function() {
		return user.save({ fields: fields })
	})
	.then(function() {
		console.log(req.session.user.id);
		console.log(user.id);
		if (req.session && req.session.user && req.session.user.id == user.id) {
			req.session.user.username = user.username;
			req.session.user.email = user.email;
		}

		res.redirect('/user/' + user.id + '/edit');
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.locals.user = user.toJSON();
		res.render('user/edit');
	})
}

exports.destroy = function(req, res, next) {
	var user = req.user;
	user
	.destroy()
	.then(function() {
		if (req.session.user && req.session.user.id == user.id)
			delete req.session.user;
		res.redirect('/');
	})
	.catch(next);
}

exports.require = {};
exports.require.ownership = function(req, res, next) {
	var user = req.user;
	var loggedUser = req.session.user;

	if (loggedUser.isAdmin || user.id == loggedUser.id)
		next();
	else
		res.redirect('/');
}