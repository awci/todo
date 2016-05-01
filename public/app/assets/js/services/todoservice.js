angular.module('todoService', [])



.factory('Todo', function($http) {
	var todoFactory = {};

	todoFactory.allTodos = function() {
		return $http.get('/api/all_todos');
	}

	todoFactory.create = function(data) {
		return $http.post('/api', data);
	}

	todoFactory.all = function() {
		return $http.get('/api');
	}
	return todoFactory;
})

.factory('socketio', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	}
})