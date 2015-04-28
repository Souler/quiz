module.exports = function(sequelize, DataTypes) {
	var Quiz = sequelize.define('Quiz', {
		question: DataTypes.STRING,
		answer: DataTypes.STRING
	}, {
		freezeTableName: true
	});
	return Quiz;
};