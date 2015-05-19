var Sequelize = require('sequelize');
var models = require('../models');
var Quiz = models.Quiz;
var Comment = models.Comment;

var Strings = {
	ERR_WRONG_QUESTION_ID : "WRONG QUESTION ID"
};

exports.load = function(req, res, next, quizId) {
	Quiz.find({
		where: { id: Number(quizId) },
		include: [
			{ model: Comment }
		]
	})
	.then(function(q) {
		if (!q)
			throw new Error(Strings.ERR_WRONG_QUESTION_ID);
		req.q = q;
		res.locals.quiz = q;
	})
	.then(next)
	.catch(next)
}

exports.list = function(req, res, next) {
	var query = req.query.search || '';
	var like = '%' + query.replace(/\s+/, '%') + '%';
	Quiz.findAll({ where: { question : { like : like } } })
	.then(function(qs) {
		res.locals.query = query;
		res.locals.questions = qs;
	})
	.then(next)
	.catch(next)
}

exports.question = function(req, res, next) {
	res.locals.q = req.q;
	next();
};

exports.answer = function(req, res, next) {
	var q = req.q;
	var givenAnswer = req.query.a || '';
	var expectedAnswer = q.answer;

	res.locals.q = q;
	res.locals.answer = givenAnswer;
	res.locals.correct = (givenAnswer.toLowerCase() == expectedAnswer.toLowerCase());
	next();
};

exports.new = function(req, res, next) {
	// prepare just the q object on views
	res.locals.q = {};
	next();
}
exports.create = function(req, res, next) {
	var fields = [ "question", "answer" ];
	var quiz = Quiz.build(req.body.quiz);

	// Remove multiple whitespaces and trailing and ending whitespaces
	fields.forEach(function(field) {
		var val = quiz[field]
					.replace(/\s+/, ' ')
					.replace(/^\s/, '')
					.replace(/\s$/, '');
		quiz[field] = val;
	});

	quiz
	.validate()
	.then(function() {
		return quiz.save({ fields: fields });
	})
	.then(function() {
		res.redirect('/quizes');
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.locals.q = quiz; 
		res.render('quizes/new');
	})
}

exports.update = function(req, res, next) {
	var fields = [ "question", "answer" ];
	var updated = req.body.quiz;
	var quiz = req.q;

	// Remove multiple whitespaces and trailing and ending whitespaces
	fields.forEach(function(field) {
		var val = updated[field]
					.replace(/\s+/, ' ')
					.replace(/^\s/, '')
					.replace(/\s$/, '');
		quiz[field] = val;
	});

	quiz
	.validate()
	.then(function() {
		return quiz.save({ fields: fields });
	})
	.then(function() {
		res.redirect('/quizes');
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.locals.q = quiz; 
		res.render('quizes/edit');
	})
}

exports.delete = function(req, res, next) {
	req.q
	.destroy()
	.then(function() {
		res.redirect('/quizes');
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.render('quizes');
	})
}

exports.statistics = function(req, res, next) {
	var statistics = {};
	Quiz.count()
	.then(function(count) {
		statistics.quiz_count = count;
		return Comment.count();
	})
	.then(function(count) {
		statistics.comment_count = count;
		return Comment
				.findAll({
					attributes: [ [ Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('QuizId'))), 'count' ] ],
					raw : true
				});
	})
	.then(function(result) {
		var count = result[0].count;
		var avg = statistics.comment_count / statistics.quiz_count;
		statistics.avg_comments_per_quiz = Math.round(avg * 100) / 100;
		statistics.quiz_count_w_comments = count;
		statistics.quiz_count_wo_comments = statistics.quiz_count - count;
		res.locals.statistics = statistics;
		res.render('quizes/statistics');
	})
}