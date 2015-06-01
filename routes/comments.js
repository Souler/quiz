var express = require('express');
var router = express.Router();

// controllers
var site = require('../controllers/site_controller');
var session = require('../controllers/session_controller');
var comment = require('../controllers/comment_controller');

// Autoload
router.param('commentId', 			comment.load);

router.get('/new', 					site.title('Publicar comentario'), site.render('comments/new'));
router.post('/', 					comment.create);
router.get('/:commentId/publish',	session.require.login, comment.require.ownership, comment.publish);

module.exports = router;