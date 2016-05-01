angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html'
		})
		.when('/alltodos', {
			templateUrl: 'app/views/pages/alltodos.html',
			controller: 'AllTodosController',
			controllerAs: 'todo',
			resolve: {
				todos: function(Todo) {
					return Todo.allTodos();
				}
			}
		})
		.when('/contact', {
			templateUrl: 'app/views/pages/contact.html'
		});
	$locationProvider.html5Mode(true);
})