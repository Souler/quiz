var models = require('../models');
var Quiz = models.Quiz;
var User = models.User;
var Favourites = models.Favourites;


exports.add = function(req, res, next) {
	var user = req.user;
	var quiz = req.q;

	user.addFavourite(quiz)
	.then(function() { res.redirect('/') })
	.catch(console.error)
}

exports.remove = function(req, res, next) {
	var user = req.user;
	var quiz = req.q;

	user
	.removeFavourite(quiz)
	.then(function() { res.redirect('/') })
	.catch(console.error)
}

exports.list = function(req, res, next) {
	req.listFavs = true;
	next();
}