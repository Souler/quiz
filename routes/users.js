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

router.get('/:userId/quizes', quiz.list, site.render('quizes'));

router.get('/:userId/favourites', 					session.require.login, user.require.ownership, favs.list, quiz.list, site.render('quizes'));
router.put('/:userId/favourites/:quizId(\\d+)', 	session.require.login, user.require.ownership, favs.add);
router.delete('/:userId/favourites/:quizId(\\d+)', 	session.require.login, user.require.ownership, favs.remove);

module.exports = router;