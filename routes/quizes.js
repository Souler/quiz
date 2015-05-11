var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

router.param('quizId', quizController.load);
router.get('/', quizController.list);
router.get('/:quizId(\\d+)', quizController.question);
router.get('/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;