var users = {
	admin: {
		id: 1,
		username: 'admin',
		password: '12345'
	}
};

exports.authenticate = function(login, password, cb) {

	if (users[login]) {
		if (password == users[login].password) {
			cb(null, users[login]);
		}
		else
			cb(new Error('Contrasena incorrecta'));
	}		
	else
		cb(new Error('No existe el usuario'));
}