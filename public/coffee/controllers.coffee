TabsCtrl = ($scope) ->
  $scope.panes = [
    title: "Health Facilities"
    content: "Health Facilities will be here"
    active: true #,
  ]

#    { title: "Education Facilities", 
#      content: "Education Facilities will be here",
#      active: false}
RootCtrl = ($rootScope) ->
  $rootScope.$on "currentFacility", (evt, fac) ->
    $rootScope.currentFacility = fac

  $rootScope.$on "matching_request", (evt, fac) ->
    if $rootScope.currentFacility isnt `undefined` and fac isnt `undefined`
        $rootScope.$broadcast "pair_confirmed", [$rootScope.currentFacility, fac]

  $rootScope.$on "rejecting_request", (evt, fac) ->
    $rootScope.$broadcast "reject_confirmed", fac  if true


FacilitiesListCtrl = ($scope, $http) ->
  file = "docs/Aba_North_Health_Facility_List.csv"
  
  #_.each($scope.facilities, function(item, i){item.index=i});
  
  #looping selector
  $http.get(file).success((data, status, headers, config) ->
    $scope.facilities = csv(data).toObjects()
    $scope.index = 0
    $scope.facility = $scope.facilities[$scope.index]
    $scope._changeI = (delta) ->
      newI = $scope.index + delta
      if newI >= $scope.facilities.length
        newI = 0
      else newI = $scope.facilities.length - 1  if newI <= 0
      $scope.index = newI
      $scope.facility = $scope.facilities[newI]
      $scope.$emit "currentFacility", $scope.facility

    $scope.$emit "currentFacility", $scope.facility
    $scope.next = ->
      $scope._changeI 1

    $scope.previous = ->
      $scope._changeI -1
  ).error (data, status, headers, config) ->
    alert csv_addr + " is not valid file format, please check!"


NMISListCtrl = ($scope, $http) ->
  file = "docs/Aba_North_NMIS_List.csv"
  $http.get(file).success((data, status, headers, config) ->
    $scope.facilities = csv(data).toObjects()
    facilities_len = $scope.facilities.length
    $scope.predicate = "facility_name"
    $scope.radioModel = "Name"
    $scope.sortby = (key) ->
      $scope.facilities = _.sortBy($scope.facilities, (fac) ->
        fac[key].toLowerCase()
      )

    $scope.match = (fac) ->
      $scope.$emit "matching_request", fac

    $scope.fail = (fac) ->
      $scope.$emit "rejecting_request", fac
  ).error (data, status, headers, config) ->
    alert file + " is not valid file format, please check!"


PairedListCtrl = ($scope, $rootScope, $http) ->
  file = "docs/paired_list.json"
  
  #pushing to the front using unshift
  $http.get(file).success((data, status, headers, config) ->
    if data.length is 0
      $scope.pairs = []
    else
      $scope.pairs = JSON.parse(data)
    $scope.$on "pair_confirmed", (evt, fac) ->
      $scope.pairs.unshift fac

  ).error (data, status, headers, config) ->
    alert file + " is not valid file format, please check!"


RejectedListCtrl = ($scope, $rootScope, $http) ->
  file = "docs/rejected_list.json"
  $scope.oneAtATime = true
  
  #pushing to the front using unshift
  $http.get(file).success((data, status, headers, config) ->
    if data.length is 0
      $scope.rejects = []
    else
      $scope.rejects = JSON.parse(data)
    $scope.$on "reject_confirmed", (evt, fac) ->
      $scope.rejects.unshift fac

  ).error (data, status, headers, config) ->
    alert file + " is not valid file format, please check!"

