var crypto = require('crypto');
var key = process.env.PASSWORD_ENCRYPTION_KEY;

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isUnique: function(value, next) {
					var self = this;
					User
					.find({ where: { username: value } })
					.then(function(user) {
						if (user && user.id !== self.id)
							throw new Error('Ya existe ese nombre de usuario');
						next();
					})
					.catch(next)
				},
				isAlphanumeric: {
					msg: "El nombre de usuario debe ser alfanumerico"
				},
				notEmpty: {
					msg: "No se ha especificado nombre de usuario"
				}
			}
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isUnique: function(value, next) {
					var self = this;
					User
					.find({ where: { username: value } })
					.then(function(user) {
						if (user && user.id !== self.id)
							throw new Error('Ya existe un usuario con ese email');
						next();
					})
					.catch(next)
				},
				isEmail: {
					msg: 'Email no valido'
				},
				notEmpty: {
					msg: "No se ha especificado email"
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: {
					msg: "No se ha especificado contrasena"
				}
			},
			set: function(password) {
				var encrypted = crypto
								.createHmac('sha1', key)
								.update(password)
								.digest('hex');
				if (password.length == 0)
					encrypted = '';
				this.setDataValue('password', encrypted);
			}
		},
		role: {
			type: DataTypes.STRING,
			defaultValue: 'user'
		}
	},
	{
		instanceMethods: {
			isAdmin: function() {
				return this.role == 'admin';
			},
			verifyPassword: function(password) {
				var encrypted = crypto
								.createHmac('sha1', key)
								.update(password)
								.digest('hex');

				return encrypted == this.password;
			}
		}
	});

	var Favourites = sequelize.define('Favourites', {}, { freezeTableName : true, tableName: 'favourites'});
	User.Favourites = Favourites;

	return User;
};