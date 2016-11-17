angular.module('matchesService', [])

  .service('Matches', function($http) {
    
    this.get = function() {
      return $http.get('/api/matches');
    };

  });
