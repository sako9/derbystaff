angular
  .module('khe')
  .factory('Stats', ['$http', 'User', function ($http, User) {

    var Stats = function () {

      var self = this;
      var user = new User();

      /**
      * Number of people registered each month
      */
      this.registrations = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/registrations'
        });
        return $http(req);
      };

      /**
      * Get the t-shirt size distribution
      */
      this.shirts = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/shirts'
        });
        return $http(req);
      };

      /**
      * Get the distribution of dietary restrictions
      */
      this.dietary = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/dietary'
        });
        return $http(req);
      };

      /**
      * Get a gender comparison
      */
      this.gender = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/stats/gender'
        });
        return $http(req);
      };

    };

    return Stats;

  }]);