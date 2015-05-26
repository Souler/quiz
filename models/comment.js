module.exports = function(sequelize, DataTypes) {
	var Comment = sequelize.define('Comment', {
		text: {
			type: DataTypes.STRING,
			validate : {
				notEmpty : {
					msg: "No se ha introducido comentario"
				}
			}
		},
		published: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});
	return Comment;
};