angular.module('Gula.controllers').controller('myProfileController', function ($scope, $stateParams, PouchDBService) {
  // Fetch database Singleton
  var db = PouchDBService.getDb

  // Initializing the scope to its previous value
  db.get("profile").then(function (res) {
    $scope.farmer = {MyName: res.MyName, Phone_Number: res.Phone_Number, Address: res.Address}
  })
    .catch(function () {
      $scope.farmer = {MyName: "No Name", Phone_Number: "+60123456789", Address: "My Address"}
    })


  // This function is binded to the submit button
  $scope.submit = function () {
    // Update Farm information
    db.get("profile").then(function (res) {
      // Instance where the farm exists
      console.log("Document Exists. Updating.")
      db.put({
        _id: "profile",
        _rev: res._rev,
        MyName: $scope.farmer.MyName,
        Phone_Number: $scope.farmer.Phone_Number,
        Address: $scope.farmer.Address
      }).then(function (res) {
        console.log(res);
      })

    }).catch(function (res) {
      // Instance where the farm does not exist
      console.log("The document does not exist. Creating a new doc")
      db.put({
        _id: "profile",
        MyName: $scope.farmer.MyName,
        Phone_Number: $scope.farmer.Phone_Number,
        Address: $scope.farmer.Address
      }).then(function (res) {
        console.log(res)
      })
    });
  }

});