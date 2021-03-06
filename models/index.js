var path = require('path');
var Sequelize = require('sequelize');

var sequelizeOptions = {
	logging: false,
	storage: process.env.DATABASE_STORAGE,
	omitNull: true
};

var sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);

var Quiz = sequelize.import(path.join(__dirname, './quiz'));
var Comment = sequelize.import(path.join(__dirname, './comment'));
var User = sequelize.import(path.join(__dirname, './user'));
var Favourites = User.Favourites;

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment, { onDelete: 'cascade' });

// Autor de los quizes
Quiz.belongsTo(User);
User.hasMany(Quiz);

// Autor de los comentarios
Comment.belongsTo(User)
User.hasMany(Comment);
	
// Favoritos
User.belongsToMany(Quiz, {through: Favourites, as: 'favourites'});
Quiz.belongsToMany(User, {through: Favourites, as: 'favourites'});

exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;
exports.Favourites = Favourites;

sequelize
.sync({ force: global.QUIZ_FORCE_SYNC })
.then(function() {
	return User.count();
})
.then(function(count) {
	if (count > 0)
		return;

	var users = [
		{
			username: 'admin',
			email: 'admin@quiz.com',
			password: '1234',
			role: 'admin'
		},
		{
			username: 'pepe',
			email: 'pepe@quiz.com',
			password: '5678'
		}
	];

	return User.bulkCreate(users);
})
.then(function(def) {
	if (def)
		console.log("Base de datos inicializada: Usuarios");
})
.then(function() {
	return Quiz.count();
})
.then(function(count) {
	if (count == 0) {
		var questions = [
			{ question: 'Capital de Italia', answer: 'Roma', UserId: 1 },
			{ question: 'Capital de Portugal', answer: 'Lisboa', UserId: 2 },
		];

		return Quiz.bulkCreate(questions);
	}
})
.then(function(def) {
	if (def)
		console.log("Base de datos inicializada: Preguntas");
})
.then(function() {
	return Comment.count();
})
.then(function(count) {
	if (count == 0) {
		var comments = [
			{ text: 'Comentario de prueba 1', published: 0, QuizId: 1, UserId: 1 },
			{ text: 'Comentario de prueba 2', publised: 0, QuizId: 1, UserId: 2 },
		];

		return Comment.bulkCreate(comments);
	}
})
.then(function(def) {
	if (def)
		console.log("Base de datos inicializada: Comentarios");
})
.catch(function(err) { 
	console.error("ERROR DURANTE LA INICIALIZACION DE DB");
	console.error(err);
})