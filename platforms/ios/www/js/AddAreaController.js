angular.module('Gula.controllers').controller('addAreaCtrl', function ($scope, $rootScope, PouchDBService, localStorageService,
                                                                       $cordovaDialogs, $ionicHistory, $cordovaGeolocation, CalculateAreaService) {
    // You can use https://www.daftlogic.com/projects-google-maps-area-calculator-tool.htm
    //    to test the calculations.
    // let coordinates = [
    //   [1.602810301968369,110.36798244493912],
    //   [1.6071001528072157,110.37235981005142],
    //   [1.609073481168485,110.37205940264175],
    //   [1.60810826644756,110.36901241320083],
    //   [1.6084514539562023,110.36813264864395],
    //   [1.6077650788812101,110.3652787782521],
    //   [1.6053413150518685,110.365729389366]
    // ];


    var edit = false;
    $scope.$on('$ionicView.enter', function (e) {

      $scope.user = {trees: 0, CalculatedArea: 0};
      if ($rootScope.areaId) {
        edit = true;
        PouchDBService.getFarmDb().get($rootScope.areaId)
          .then(function (res) {
            $scope.user = res;
            $scope.$digest();
          })
      }
    });

    $scope.$on('$ionicView.leave', function (e) {
      delete $rootScope.areaId;
    });

    $scope.submit = function () { //the code below is executed when someone presses submit
      //var new_index = $scope.user.index+1;
      var farmData = {
        trees: $scope.user.trees,
        coords: coords,
        area: $scope.user.CalculatedArea,
        date: JSON.stringify(new Date()),
        //  index: new_index

      };


      var promise;
      if (edit) {
        promise = PouchDBService.getFarmDb().put($scope.user);
      } else {
        promise = PouchDBService.getFarmDb().post(farmData);
      }

      promise.then(function (res) {
        $ionicHistory.goBack();
      }).catch(function (err) {
        $cordovaDialogs.alert('Data is not stored correctly. Try again.', 'Whoops!');
        console.error(err);
      });
    };

    var coords = [];

    $scope.startTracking = function () {
      var watch = $cordovaGeolocation.watchPosition({timeout: 10000, enableHighAccuracy: false});
      watch.then(null, function (err) {
        console.error(err)
      }, function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        coords.push([lat, long]);
        console.log(lat + " " + long);
      });

      $scope.watch = watch;
    };

    $scope.stopTracking = function () {
      $scope.watch.clearWatch();
      $scope.user.CalculatedArea =(CalculateAreaService.calculateAreaOfGPSPolygonOnEarthInSquareMeters(coords))
    };


  $scope.submit = function () { //the code below is executed when someone presses submit
    //var new_index = $scope.user.index+1;
    var farmData = {
      trees: $scope.user.trees,
      coords: coords,
      area: $scope.user.CalculatedArea,
      date: JSON.stringify(new Date()),
    //  index: new_index

    };


    var promise;
    if (edit) {
      promise = PouchDBService.getFarmDb().put($scope.user);
    } else {
      promise = PouchDBService.getFarmDb().post(farmData);
    }

    promise.then(function (res) {
      $ionicHistory.goBack();
    }).catch(function (err) {
      $cordovaDialogs.alert('Data is not stored correctly. Try again.', 'Whoops!');
      console.error(err);
    });
  };

  var addCustomerUrl = 'https://gula-server.herokuapp.com';

  $scope.user = {
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    IsReselling: "", //IsReselling: yes if it is middleman, no if it is not a middleman.
  };

  $scope.register = function () {
    $scope.user._id = "profile";

    $http({
      method: 'PUT',
      url: signupUrl + '/users',
    })
      .then(function (res) {
        console.log(res);

        return PouchDBService.initPouchDbs();
        // return PouchDBService.initSyncForUser();

      })
      .then(function () {
        return PouchDBService.getCustomerDb().put($scope.user)
          .then(function () {
            $state.go('/myCustomers');

          })
      })
      .then(function () {
      });

  };



});
