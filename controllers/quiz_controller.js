var models = require('../models');
var Quiz = models.Quiz;

var Strings = {
	ERR_WRONG_QUESTION_ID : "WRONG QUESTION ID"
};

exports.load = function(req, res, next, quizId) {
	Quiz.find(quizId)
	.then(function(q) {
		if (!q)
			throw new Error(Strings.ERR_WRONG_QUESTION_ID);
		req.q = q;
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

exports.create = function(req, res, next) {
	var fields = [ "question", "answer" ];
	var quiz = Quiz.build(req.body.quiz);

	// Remove multiple whitespaces and trailing and ending whitespaces
	fields.forEach(function(field) {
		var val = quiz[field];
		val.replace(/\s+/, ' ')
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
		console.error(err);
		res.locals.errors = err.errors;
		res.locals.quiz = quiz; 
		res.render('quizes/new');
	})

}