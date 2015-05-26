var Sequelize = require('sequelize');
var models = require('../models');
var Quiz = models.Quiz;
var Comment = models.Comment;
var User = models.User;
var Favourites = models.Favourites;

var Strings = {
	ERR_WRONG_QUESTION_ID : "WRONG QUESTION ID"
};

exports.load = function(req, res, next, quizId) {
	Quiz.find({
		where: { id: Number(quizId) },
		include: [
			{
				model: Comment,
				include: [
					{ model: User },
					{ model: Quiz },
				]
			}
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
	var where = {};

	var query = req.query.search || '';
	var like = '%' + query.replace(/\s+/, '%') + '%';
	where.question = { like: like };

	if (req.user)
		where.UserId = req.user.id;

	res.locals.isUserView = !!req.user;

	Quiz
	.findAll({ where: where })
	.then(function(qs) {
		res.locals.query = query;
		res.locals.questions = qs;

		if (!req.session.user)
			return;

		return Favourites
		.findAll({ where : { UserId : req.session.user.id } })
		.then(function(favs) {
			var favsHash = {}; // Para busqueda rapida
			favs.forEach(function(fav) {
				favsHash[fav.QuizId] = true;
			});

			qs.forEach(function(q) {
				q.isFav = !!(favsHash[q.id]);
			})
		})
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
	if (req.body.quiz.image)
		req.body.quiz.image = req.files.image.name;

	var fields = [ "question", "answer", "image", "UserId" ];
	// Add userid to the object to be saved
	req.body.quiz.UserId = req.session.user.id;
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
		next();
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.locals.q = quiz; 
		res.render('quizes/new');
	})
}

exports.update = function(req, res, next) {
	if (req.body.quiz.image)
		req.body.quiz.image = req.files.image.name;

	var fields = [ "question", "answer", "image" ];
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
		next();
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
		next();
	})
	.catch(function(err) {
		res.locals.errors = err.errors;
		res.render('quizes');
	})
}

exports.stats = function(req, res, next) {
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

		if (isNaN(statistics.avg_comments_per_quiz))
			statistics.avg_comments_per_quiz = 0;

		next();
	})
	.catch(next);
}

exports.require = {};
exports.require.ownership = function(req, res, next) {
	var quiz = req.quiz;
	var user = req.session.user;

	if (user.isAdmin || user.id == quiz.UserId)
		next();
	else
		res.redirect('/');
}