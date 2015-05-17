var express = require('express');
var router = express.Router();
var site = require('../controllers/site_controller');
var quizController = require('../controllers/quiz_controller');

router.param('quizId', quizController.load);
router.get('/', quizController.list, site.render('quizes'));
router.get('/:quizId(\\d+)', quizController.question, site.render('quizes/show'));
router.get('/:quizId(\\d+)/answer', quizController.answer, site.render('quizes/answer'));
router.get('/new', site.render('quizes/new'));
router.post('/create', quizController.create);

module.exports = router;