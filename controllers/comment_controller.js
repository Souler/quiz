var models = require('../models');
var Quiz = models.Quiz;
var Comment = models.Comment;

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