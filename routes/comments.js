var express = require('express');
var router = express.Router();

var site = require('../controllers/site_controller');
var comment = require('../controllers/comment_controller');

// Autoload
router.param('commentId', 			comment.load);

router.get('/new', 					site.render('comments/new'));
router.post('/', 					comment.create);
router.get('/:commentId/publish',	comment.publish);

module.exports = router;