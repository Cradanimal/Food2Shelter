angular.module('mainController', [])

  .controller('mainController', function($scope, $http, Matches){

    $scope.name = '';
    Matches.get()
      .success(function(data) {
        $scope.matches = data;
        console.log(data)
      })
      .error(function(err) {
        console.log('Error: ' + err);
      });
  });