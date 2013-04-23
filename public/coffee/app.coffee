# Declare app level module which depends on filters, and services
aongular.module("myApp", ["ui-bootstrap"])#.
###
  config ["$routeProvider", "$locationProvider", ($routeProvider, $locationProvider) ->
  $routeProvider.when "/",
    templateUrl: "index"

  $routeProvider.otherwise redirectTo: "/"
  $locationProvider.html5Mode true
]
###
