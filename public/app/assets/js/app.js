angular.module('TodoApp',['appRoutes', 'mainCtrl', 'userCtrl', 'todoCtrl', 'authService', 'userService', 'todoService', 'reverseDirective'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
})