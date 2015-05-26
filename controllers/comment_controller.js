var models = require('../models');
var Comment = models.Comment;

exports.load = function(req, res, next, commentId) {
	Comment
	.find({ where: { id: commentId } })
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

	var fields = [ "text" ];
	var comment = Comment.build({
					text: text,
					QuizId: req.q.id
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