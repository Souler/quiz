var express = require('express');
var router = express.Router();
var site = require('../controllers/site_controller');
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');

router.param('quizId', quizController.load);
router.get('/', quizController.list, site.render('quizes'));
router.get('/:quizId(\\d+)', quizController.question, site.render('quizes/show'));
router.get('/:quizId(\\d+)/answer', quizController.answer, site.render('quizes/answer'));
router.get('/new', site.render('quizes/new'));
router.post('/create', quizController.create);
router.get('/:quizId(\\d+)/edit', quizController.question, site.render('quizes/edit'));
router.put('/:quizId(\\d+)', quizController.update);
router.delete('/:quizId(\\d+)', quizController.delete);

router.get('/:quizId(\\d+)/comments/new', site.render('comments/new'));
router.post('/:quizId(\\d+)/comments', commentController.create)

module.exports = router;