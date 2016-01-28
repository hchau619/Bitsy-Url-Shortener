angular.module('appRoutes', []).config(function($stateProvider, $urlRouterProvider){

		$stateProvider

		.state('home', {
			url: '/',
			templateUrl: '../views/home.html',
			controller: 'MainCtrl'
		});

		$urlRouterProvider.otherwise('/');
});