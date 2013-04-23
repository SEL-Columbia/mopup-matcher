'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/health', {templateUrl: 'partials/health', controller: MyCtrl1});
    $routeProvider.when('/education', {templateUrl: 'partials/education', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/health'});
    $locationProvider.html5Mode(true);
  }]);
