'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', '$strap.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/:lgaid/health', {templateUrl: 'partials/facility', controller: RootCtrl('health')});
    $routeProvider.when('/:lgaid/education', {templateUrl: 'partials/facility', controller: RootCtrl('edu')});
    $routeProvider.when('/progress/baseline/lga', {templateUrl: 'partials/lga', controller: TotalsCtrl('baseline','lga')});
    $routeProvider.when('/progress/baseline/state', {templateUrl: 'partials/state', controller: TotalsCtrl('baseline','state')});
    $routeProvider.when('/progress/facility_list/lga', {templateUrl: 'partials/lga', controller: TotalsCtrl('facility_list','lga')});
    $routeProvider.when('/progress/facility_list/state', {templateUrl: 'partials/state', controller: TotalsCtrl('facility_list','state')});
    $routeProvider.otherwise({redirectTo: '/progress/facility_list/lga'});
    $locationProvider.html5Mode(true);
  }]);
