'use strict';

/* Controllers */

var RootCtrl = function(sector){
  return function($rootScope, $routeParams, $http) {
    $rootScope.currentSector = sector;
    $rootScope.current_lga = $routeParams.lgaid;
    $rootScope.$on('currentNMIS', function(evt, fac){
      $rootScope.currentNMIS = fac;
    });
    $rootScope.$on('matching_request', function(evt, fac){
      if ($rootScope.currentNMIS !== undefined &&
        fac !== undefined) {
          var pair = fac;
          pair.nmis = $rootScope.currentNMIS;
          var promise = $http.post(
            '/api/matching/' + sector + '/create', pair
          );
          promise.success(function(b){
            var message = b.message;
            if(message == 'affirmative') {
              $rootScope.$broadcast('pair_confirmed', pair);
            }else if(message == 'duplicate') {
              alert('this pairing exists in database, please double check');
            }else{
              alert('database error');
            }
          });
        }
    });
  };
};

var NMISCtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_NMIS_List.csv";
  //$http.get(file)
  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;
  
  $http.get('/api/facilities/nmis/'+lga_id+'/'+sector)
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
      var facilities_len = $scope.facilities.length;
      $scope.predicate = 'facility_name';
      $scope.radioModel = 'Name';
      $scope.select = function(fac) {
        $scope.$emit('currentNMIS', fac);
      };
      $scope.sortby = function(key) {
        $scope.facilities = _.sortBy($scope.facilities, 
                function(fac){ return fac[key].toLowerCase();});
      };
    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });
};

var LGACtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_Health_Facility_List.csv";
  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;
  
  $http.get('/api/facilities/lga/'+lga_id+'/'+sector)
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
//_.each($scope.facilities, function(item, i){item.index=i});
      
      $scope.match = function(fac){
        $scope.$emit('matching_request', fac);
      };

    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });

};
  
var PairedListCtrl = function($scope, $rootScope, $http) {

  var lga_id = $rootScope.current_lga;
  
  $http.get('/api/facilities/paired/'+lga_id+'/health')
    .success(function(data, status, headers, config){
      console.log(data);
      if (data.length === 0){
        $scope.pairs = [];
      }else{
        $scope.pairs = data;
      }
      $scope.$on('pair_confirmed', function(evt, fac){
        $scope.pairs.unshift(fac);
      });
    })
    .error(function(data, status, headers, config){
      alert(file + ' is not valid file format, please check!');
    });

   $scope.removePair = function(){};
};

