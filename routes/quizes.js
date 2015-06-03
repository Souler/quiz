var express = require('express');
var router = express.Router();

// routers
var commentsRouter = require('./comments');

// controllers
var site = require('../controllers/site_controller');
var session = require('../controllers/session_controller');
var quiz = require('../controllers/quiz_controller');
var comment = require('../controllers/comment_controller');

// Autoload
router.param('quizId', 				quiz.load);

// Show views
router.get('/', 					quiz.list,		site.title('Preguntas'), 	site.render('quizes'));
router.get('/:quizId(\\d+)', 		quiz.question,	site.title('Pregunta'), 	site.render('quizes/show'));
router.get('/:quizId(\\d+)/answer',	quiz.answer,	site.title('Pregunta'), 	site.render('quizes/answer'));
router.get('/statistics', 			quiz.stats,		site.title('Estadisticas'),	site.render('quizes/statistics'));

// Edition views
router.get('/new', 					session.require.login, quiz.new, 								site.title('Crear pregunta'),	site.render('quizes/new'));
router.get('/:quizId(\\d+)/edit', 	session.require.login, quiz.require.ownership,	quiz.question,	site.title('Editar pregunta'),	site.render('quizes/edit'));

router.post('/create', 				session.require.login, site.multer,	quiz.create, 	site.redirect('/quizes'));
router.put('/:quizId(\\d+)', 		session.require.login, quiz.require.ownership, 	site.multer,	quiz.update, 	site.redirect('/quizes'));
router.delete('/:quizId(\\d+)', 	session.require.login, quiz.require.ownership, 	quiz.delete, 	site.redirect('/quizes'));

// Coment views
router.use('/:quizId(\\d+)/comments', commentsRouter);

module.exports = router;