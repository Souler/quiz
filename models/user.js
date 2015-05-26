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

	var Favourites = sequelize.define('Favourites', {});
	User.Favourites = Favourites;

	return User;
};