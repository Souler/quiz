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
		image:{
			type: DataTypes.STRING
		}
	});
	return Quiz;
};