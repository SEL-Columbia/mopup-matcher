'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', '$strap.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/:lgaid/health', {templateUrl: 'partials/health', controller: RootCtrl('health')});
    $routeProvider.when('/:lgaid/education', {templateUrl: 'partials/education', controller: RootCtrl('edu')});
    $routeProvider.when('/progress/state', {templateUrl: 'partials/state', controller: RootCtrl('edu')});
    $routeProvider.when('/progress/lga', {templateUrl: 'partials/lga', controller: TotalsCtrl('')});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);
