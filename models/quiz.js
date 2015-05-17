module.exports = function(sequelize, DataTypes) {
	var Quiz = sequelize.define('Quiz', {
		question: {
			type: DataTypes.STRING,
			validate : {
				notEmpty : {
					msg: "No se ha introducido pregunta"
				}
			}
		},
		answer:{
			type: DataTypes.STRING,
			validate : {
				notEmpty : {
					msg: "No se ha introducido respuesta"
				}
			}
		},
	});
	return Quiz;
};