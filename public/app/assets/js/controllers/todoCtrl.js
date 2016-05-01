angular.module('todoCtrl', ['todoService'])



.controller('TodoController', function(Todo, socketio) {


	var vm = this;

	Todo.all()
		.success(function(data) {
			vm.todos = data;
		});

	vm.createTodo = function() {
		vm.message = '';
		Todo.create( vm.todoData )
			.success(function(data) {
				vm.todoData = '';
				vm.message = data.message;
			});
	}

	socketio.on('todo', function(data) {
		vm.todos.push(data);
	})
})


.controller('AllTodosController', function(todos, socketio) {
	var vm = this;
	vm.todos = todos.data;
	socketio.on('todo', function(data) {
		vm.todos.push(data);
	});
})