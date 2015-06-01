var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var site = require('../controllers/site_controller');
var userQuiz = require('./users');
var routerQuiz = require('./quizes');
var sessionsQuiz = require('./sessions');

var auto = function(req, res, next) {
	var app = req.app;
	var p = req.path.substring(1);

	// Remove las / if present for avoiding errors with paths
	if (p.charAt(p.length - 1) == '/')
		p = p.substring(0, p.length - 1);

	// Direct path to the file
	var fileA = path.join(app.get('views'), p + '.' + app.get('view engine'));
	// Path to a directory, refering its index
	var fileB = path.join(app.get('views'), p, 'index.' + app.get('view engine'));

	if (fs.existsSync(fileA) || fs.existsSync(fileB))
		res.render(p);
	else
		next();
}

router.get('/', site.render('index'));
router.use(sessionsQuiz);
router.use('/quizes', routerQuiz);
router.use('/user', userQuiz);
router.get('/author', site.title('Autores'), site.render('author'));

module.exports = router;
