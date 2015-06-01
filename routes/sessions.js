var express = require('express');
var router = express.Router();

var site = require('../controllers/site_controller');
var sessionController = require('../controllers/session_controller');

router.get('/login', site.title('Acceder'), site.render('login'));
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

module.exports = router;