'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.bootstrap','myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/:lgaid/health', {templateUrl: 'partials/health', controller: RootCtrl('health')});
    $routeProvider.when('/:lgaid/education', {templateUrl: 'partials/education', controller: RootCtrl('edu')});
    $routeProvider.otherwise({redirectTo: '/health'});
    $locationProvider.html5Mode(true);
  }]);
