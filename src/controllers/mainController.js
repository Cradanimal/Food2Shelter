angular.module('mainController', [])

  .controller('mainController', function($scope, $http, Matches){


    Matches.get()
      .success(function(data) {
        $scope.matches = data;
        console.log(data)
      })
      .error(function(err) {
        console.log('Error: ' + err);
      });
  });