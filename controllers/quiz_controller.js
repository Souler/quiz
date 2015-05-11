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
	res.render('quizes/question');
};

exports.answer = function(req, res, next) {
	var q = req.q;
	var givenAnswer = req.query.a || '';
	var expectedAnswer = q.answer;

	res.locals.q = q;
	res.locals.answer = givenAnswer;
	res.locals.correct = (givenAnswer.toLowerCase() == expectedAnswer.toLowerCase());
	res.render('quizes/answer');
};