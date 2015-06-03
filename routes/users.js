var express = require('express');
var router = express.Router();

// controllers
var site = require('../controllers/site_controller');
var quiz = require('../controllers/quiz_controller');
var session = require('../controllers/session_controller');
var user = require('../controllers/user_controller');
var favs = require('../controllers/favourites_controller');

// Autoload
router.param('quizId', quiz.load);
router.param('userId', user.load);

router.get('/', 					session.require.annon, site.title('Registrarse'), site.render('user/new'));
router.get('/:userId(\\d+)/edit',	session.require.login, user.require.ownership, site.title('Editar Usuario'), site.render('user/edit'));
router.post('/', 					session.require.annon, user.create);
router.put('/:userId(\\d+)', 		session.require.login, user.require.ownership, user.update);
router.delete('/:userId(\\d+)', 	session.require.login, user.require.ownership, user.destroy);

router.get('/:userId/quizes', 		quiz.list, site.title('Preguntas'), site.render('quizes'));

router.get('/:userId(\\d+)/favourites', 					session.require.login, user.require.ownership, favs.list, quiz.list, site.title('Favoritas'), site.render('quizes'));
router.put('/:userId(\\d+)/favourites/:quizId(\\d+)', 		session.require.login, user.require.ownership, favs.add);
router.delete('/:userId(\\d+)/favourites/:quizId(\\d+)',	session.require.login, user.require.ownership, favs.remove);

module.exports = router;