var models = require('../models');
var User = models.User;
var Favourites = models.Favourites;


exports.add = function(req, res, next) {
	var user = req.user;
	var quiz = req.q;

	console.log(user);
	console.log(quiz);

	Favourites
	.create({ UserId: user.id, QuizId: quiz.id })
	.then(function() { res.redirect('/') })
	.catch(console.error)
}

exports.remove = function(req, res, next) {
	var user = req.user;
	var quiz = req.q;

	Favourites
	.destroy({ where: { UserId: user.id, QuizId: quiz.id } })
	.then(function() { res.redirect('/') })
	.catch(console.error)
}