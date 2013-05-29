'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', '$strap.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/:lgaid/health', {templateUrl: 'partials/facility', controller: RootCtrl('health')});
    $routeProvider.when('/:lgaid/education', {templateUrl: 'partials/facility', controller: RootCtrl('edu')});
    $routeProvider.when('/progress/:dataset/:level', {templateUrl: 'partials/progress', controller: TotalsCtrl});
    $routeProvider.otherwise({redirectTo: '/progress/facility_list/lga'});
    $locationProvider.html5Mode(true);
  }]);
