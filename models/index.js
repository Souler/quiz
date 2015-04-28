var path = require('path');
var Sequelize = require('sequelize');

var sequelizeOptions = {
	logging: false,
	storage: process.env.DATABASE_STORAGE,
	omitNull: true
};

var sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);

var Quiz = sequelize.import(path.join(__dirname, './quiz'));

exports.Quiz = Quiz;

sequelize
.sync()
.then(function() {
	return Quiz.count();
})
.then(function(count) {
	if (count == 0) {
		var defaultQuestion = 	{
			id: 0, // For now, this should be equal to the index
			question: 'Cual es la capital de Italia?',
			answer: 'Roma'
		};
		return Quiz.create(defaultQuestion);
	}
})
.then(function(def) {
	if (def)
		console.log("Base de datos inicializada");
})