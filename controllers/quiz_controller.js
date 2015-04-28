var Strings = {
	ERR_WRONG_QUESTION_ID : "WRONG QUESTION ID"
};

var Questions = [
	{
		id: 0, // For now, this should be equal to the index
		question: 'Cual es la capital de Italia?',
		answer: 'Roma'
	}
];

exports.question = function(req, res, next) {
	var id = 0;
	res.locals.q = Questions[id];
	next();
};

exports.answer = function(req, res, next) {
	var id = req.query.q;
	var q = Questions[id];

	if (!q)
		throw new Error(Strings.ERR_WRONG_QUESTION_ID);

	var givenAnswer = req.query.a || '';
	var expectedAnswer = q.answer;

	res.locals.q = q;
	res.locals.answer = givenAnswer;
	res.locals.correct = (givenAnswer.toLowerCase() == expectedAnswer.toLowerCase());
	next();
};