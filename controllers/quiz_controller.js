var models = require('../models');
var Quiz = models.Quiz;

var Strings = {
	ERR_WRONG_QUESTION_ID : "WRONG QUESTION ID"
};

exports.question = function(req, res, next) {
	Quiz.find({})
	.then(function(q) {
		res.locals.q = q;
		next();
	});
};

exports.answer = function(req, res, next) {
	var id = req.query.q;

	Quiz.find({})
	.then(function(q) {
		if (!q)
			throw new Error(Strings.ERR_WRONG_QUESTION_ID);

		var givenAnswer = req.query.a || '';
		var expectedAnswer = q.answer;

		res.locals.q = q;
		res.locals.answer = givenAnswer;
		res.locals.correct = (givenAnswer.toLowerCase() == expectedAnswer.toLowerCase());
		next();	
	})
};