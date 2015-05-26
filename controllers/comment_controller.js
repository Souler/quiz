var models = require('../models');
var Quiz = models.Quiz;
var Comment = models.Comment;

exports.load = function(req, res, next, commentId) {
	Comment
	.find({
		where: { id: commentId },
		include: [ { model: Quiz } ]
	})
	.then(function(comment) {
		if (!comment)
			throw new Error("No existe el comentario " + commentId);
		req.comment = comment;
	})
	.then(next)
	.catch(next)
}

exports.create = function(req, res, next) {
	var text = req.body.comment.text
				.replace(/\s+/, ' ')
				.replace(/^\s/, '')
				.replace(/\s$/, '');

	var comment = Comment.build({
					text: text,
					QuizId: req.q.id,
					UserId: (req.session.user ? req.session.user.id : null)
				});

	comment
	.validate()
	.then(function() {
		return comment.save();
	})
	.then(function() {
		res.redirect('/quizes/' + req.q.id);
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.locals.comment = comment; 
		res.render('comments/new');
	})
}

exports.publish = function(req, res, next) {
	var comment = req.comment;
	var fields = [ 'published' ];
	comment.published = true;

	comment
	.save({ fields: fields })
	.then(function() {
		res.redirect('/quizes/' + req.q.id);
	})
	.catch(next)
}

exports.require = {};
exports.require.ownership = function(req, res, next) {
	var user = req.session.user;
	var quiz = req.comment.Quiz;
	var comment = req.comment;

	if (user.isAdmin || user.id == quiz.UserId)
		next();
	else
		res.redirect('/');
}