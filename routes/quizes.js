var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

router.get('/question', quizController.question);
router.get('/answer', quizController.answer);

module.exports = router;