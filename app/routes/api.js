var User = require('../models/user');
var Todo = require('../models/todo');
var config = require('../../config');

var secretKey = config.secretKey;

var jwt = require('jsonwebtoken');



function createToken( user ) {
	var token = jwt.sign({

		_id: user._id,
		name: user.name,
		username: user.username

	}, secretKey, {
		expiresIn: 1440
	});

	return token;
}



module.exports = function(app, express, io) {

	var api = express.Router();

	api.get('/all_todos', function(req, res) {
		Todo.find({}, function(err, todos) {
			if (err) {
				res.send(err);
				return;
			}
			res.json(todos);
		});
	});

	api.post('/signup', function(req, res) {

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		var token = createToken(user);

		user.save(function(err) {
			if (err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created',
				token: token
			});
		});
	});

	api.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			if (err){
				res.send(err);
				return;
			}

			res.json(users);
		});
	});

	api.post('/login', function(req, res) {
		User.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err, user) {
			if ( err ) throw err;

			if ( ! user ) {
				res.send({ message: 'User was not exists'});
			} else if ( user ) {
				var validPassword = user.comparePassword(req.body.password);
				if ( ! validPassword ) {
					res.send({ message: 'Invalid Password' });
				} else {
					console.log('User Loged in : '+user.name);
					res.json({ 
						success: true,
						message: 'User Loged in',
						token: createToken(user)
					});
				}
			}
		});
	});

	api.use( function( req, res, next) {
		console.log('somebody just came to our app!');

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		if (token) {
			jwt.verify(token, secretKey, function(err, decoded) {
				if (err) {
					res.status(403).send({ success: false, message: 'Ailed to authenticate user'});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: 'No token provided'});
		}
	});

	// Kullanıcı Giriş Yapabilirse
	api.route('/')
		.post(function(req, res) {
			var todo = new Todo({
				creator: req.decoded._id,
				content: req.body.content
			});

			todo.save(function(err, newTodo) {
				if (err){
					res.send(err);
					return;
				}
				io.emit('todo', newTodo);
				res.json({ message: 'new Todo Added' });
			});
		})

		.get(function(req, res) {
			Todo.find({ creator: req.decoded._id }, function(err, todos) {
				if (err){
					res.send(err);
					return;
				}

				res.json(todos);

			});
		});


	api.get('/me', function(req, res) {
		res.json(req.decoded);
	});


	return api;
}