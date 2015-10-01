angular
  .module('khe')
  .factory('Stats', ['$http', 'User', function ($http, User) {

    var Stats = function () {

      var self = this;
      var user = new User();

      /**
      * Number of people registered each month
      */
      this.registrations = function (query) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/registrations',
          params: query
        });
        return $http(req);
      };

      /**
      * Get the t-shirt size distribution
      */
      this.shirts = function (query) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/shirts',
          params: query
        });
        return $http(req);
      };

      /**
      * Get the distribution of dietary restrictions
      */
      this.dietary = function (query) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/dietary',
          params: query
        });
        return $http(req);
      };

      /**
      * Get a gender comparison
      */
      this.gender = function (query) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/gender',
          params: query
        });
        return $http(req);
      };

      /**
      * Get a distribution of schools
      */
      this.schools = function (query) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/schools',
          params: query
        });
        return $http(req);
      };

      /**
      * Get a count of attendees
      */
      this.count = function (query) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/count',
          params: query
        });
        return $http(req);
      };

    };

    return Stats;

  }]);