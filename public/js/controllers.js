'use strict';

/* Controllers */

var clean_root_scope = function($rootScope){
  $rootScope.currentSector = undefined;
  $rootScope.current_lga = undefined;
  $rootScope.localMatch = [];
  $rootScope.currentNMIS = undefined;
  $rootScope.current_lga_name = undefined;
  $rootScope.current_state_name = undefined;
};

var RootCtrl = function(sector){
  return function($scope, $rootScope, $routeParams, $http, $location) {
    clean_root_scope($rootScope);
    $rootScope.currentSector = sector;
    $rootScope.current_lga = $routeParams.lgaid;
    $rootScope.changeView = function (view){
      if(view=='education'){
        var path_str = '/' + $rootScope.current_lga + '/education';
        $location.path(path_str);
      }else if(view=='health'){
        var path_str = '/' + $rootScope.current_lga + '/health';
        $location.path(path_str);
      }
    };
    $scope.$on('currentNMIS', function(evt, fac){
      $rootScope.currentNMIS = fac;
    });
    $scope.$on('local_pair', function(evt,pair){
      $rootScope.localMatch.push(pair[0]);
      $rootScope.localMatch.push(pair[1]);
    });
    $scope.$on('matching_request', function(evt, fac){
      if ($rootScope.currentNMIS !== undefined &&
        fac !== undefined) {
          var nmis = $rootScope.currentNMIS;
          if(nmis.matched || fac.matched ||
            $rootScope.localMatch.indexOf(nmis['_id']) != -1 ||
            $rootScope.localMatch.indexOf(fac['_id']) != -1){
              alert("either facility exist in a pair already");
          }else{
            var pair = {'lga':fac, 'nmis':nmis};
            var promise = $http.post(
              '/api/matching/' + sector + '/create', pair
            );
            promise.success(function(b){
              var message = b.message;
              if(message == 'affirmative') { 
                $rootScope.localMatch.push(b.data['_id']);
                $rootScope.localMatch.push(b.data['matched']);
                $rootScope.currentNMIS = null;
                $rootScope.$broadcast('pair_confirmed', b.data);
              }else if(message == 'duplicate') {
                alert('this pairing exists in database, please double check');
              }else{
                alert('database error');
              }
            });
          }
        }
    });
    $scope.$on('set_lga_name', function(evt, lgaStateNames){
        $rootScope.current_lga_name = lgaStateNames.lga;
        $rootScope.current_state_name = lgaStateNames.state;
	});
	$scope.isMatched = function(id){
		return ($rootScope.localMatch.indexOf(id) !== -1);
	};
  };
};

var NMISCtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_NMIS_List.csv";
  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;

  $http.get('/api/facilities/nmis/'+lga_id+'/'+sector)
  //$http.get(file)
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
      $scope.predicate = 'ward';
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
    $scope.$on('pair_removed', function(evt, data){
        var found;
        $scope.facilities.forEach(function(f){
            if(f._id === data.nmis)
                found = f;
        });
        if(found && found.matched)
        {
            delete(found.matched);
        }
    });
};

var LGACtrl = function($scope, $http, $rootScope) {
  //var file = "../docs/Aba_North_Health_Facility_List.csv";
  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;
  
  $http.get('/api/facilities/lga/'+lga_id+'/'+sector)
  //$http.get(file)
    .success(function(data, status, headers, config){
      //$scope.facilities = csv(data).toObjects();
      $scope.facilities = data;
      $scope.predicate = 'ward';
      //$scope.facilities.forEach(function(item, i){item.index=i});
      if (data && data.length > 0) $scope.$emit('set_lga_name', {lga: data[0].lga, state: data[0].state});
      $scope.match = function(fac){
        $scope.$emit('matching_request', fac);
      };

    })
    .error(function(data, status, headers, config){
      alert("data  is not valid please check!");
    });

    $scope.$on('pair_removed', function(evt, data){
        var found;
        $scope.facilities.forEach(function(f){
            if(f._id === data.fac)
                found = f;
        });
        if(found && found.matched)
        {
            delete found.matched;
        }
    });
};
  
var PairedListCtrl = function($scope, $rootScope, $http) {

  var lga_id = $rootScope.current_lga;
  var sector = $rootScope.currentSector;
  
  $http.get('/api/facilities/lga/'+lga_id+'/'+sector)
    .success(function(data, status, headers, config){
      $scope.pairs = [];
      for(var i =0; i<data.length; i++){
        if (data[i]['matched']!=undefined) {
          $scope.$emit('local_pair',[data[i]['_id'],data[i]['matched']]);
          $scope.pairs.push(data[i]);
        }
      }
      $scope.$on('pair_confirmed', function(evt, fac){
        $scope.pairs.unshift(fac);
      });
    })
    .error(function(data, status, headers, config){
      alert('data is not valid file format, please check!');
    });

  $scope.removePair = function(pair){
    $rootScope.localMatch.remove(pair['_id']);
    $rootScope.localMatch.remove(pair['matched']);
    console.log($rootScope.localMatch);
    var promise = $http.post('/api/matching/' + sector + '/delete', pair);
    promise.success(function(b){
      if (b.message == 'affirmative'){
        $scope.pairs.remove(pair);
        $rootScope.$broadcast('pair_removed', {fac: pair['_id'], nmis: pair['matched']});
      }else{
        alert(b.message);
      }
    });
    promise.error(function(e){
      alert(e);
    });
  };
};

