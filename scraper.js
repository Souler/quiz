var fs = require('fs');
var util = require('util');
var path = require('path');
var Promise = require('bluebird');
var request = require('request');
var cheerio = require('cheerio');
var ent = require('ent');

var models = require('./models');
var Quiz = models.Quiz;

var start = 'https://restcountries.eu/rest/v1/all';
request.get(start,
	function (error, response, body) {
		if (error)
			return console.error(error);
		if (response.statusCode !== 200)
			return console.error("GOT RESPONSE " + response.statusCode);

		var countries = JSON.parse(body);
		var quizes = countries.map(function(c) {
			var country = c.translations.es || c.name;
			var capital = c.capital;

			if (!country || !capital || !country.length || !capital.length)
				return [];

			var q1 = {
				question: util.format('¿Capital de %s?', country),
				answer: capital
			};

			var q2 = {
				question: util.format('¿De que pais es capital %s?', capital),
				answer: country
			};

			var p1 = Quiz.build(q1)
						.save()
	 					.then(function(q) {
	 						console.log("Creada la pregunta %s", q.question);
	 					})

			var p2 = Quiz.build(q2)
						.save()
	 					.then(function(q) {
	 						console.log("Creada la pregunta %s", q.question);
	 					})

			return [p1, p2];
		});

		var promises = quizes.reduce(function(v, c) { return v.concat(c) }, []);
		Promise.settle(promises)
		.then(function() { console.log("Finished with static questions")})
		.catch(console.error)
		.then(function() {
			console.log("Intentando generar preguntas de banderas");
			countries.forEach(function(country) {
				var c = country.name.replace(' ', '_');
				var tryOut = function(urlAppend) {
					var rgx = /The given path of the specified thumbnail is incorrect;.*expected '(.*)' but got '(.*)'/;
					var baseUrlImage = 'http://upload.wikimedia.org/wikipedia/en/thumb/';
					var imagepath = path.join(__dirname, './public/media/flags/', c + '.png');
					var ws = fs.createWriteStream(imagepath);
					ws.on('error', function(err) { console.error(err) });
					request
					.get(baseUrlImage + urlAppend, function(err, response, body) {
						if (response.statusCode == 200) {
							Quiz.build({
								question: "¿A que pais pertenece esta bandera?",
								answer: country.translations.es,
								image:  'flags/' + c + '.png'
							})
							.save()
							.then(function(q) {
	 							console.log("Creada la pregunta %s [%s]", q.question, c);
							})
							return;
						}
						fs.unlinkSync(imagepath);
						if (!rgx.test(body))
							return;

						var match = rgx.exec(body);
						tryOut(match[1]);
					})
					.pipe(ws);
				}
				tryOut('9/9a/Flag_of_' + c + '.svg/200px-Flag_of_' + c + '.svg.png');
			})
		})
	}
);