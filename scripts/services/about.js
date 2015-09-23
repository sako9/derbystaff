angular
  .module('khe')
  .factory('About', ['$http', 'socketFactory', 'User', function ($http, socket, User) {

    var About = function () {

      var self = this;
      var user = new User();

      /**
      * A socket connected to /about
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var s = io.connect(config.api + '/about');
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Create/update the about page
      * @param text The text to post (markdown)
      * @return An $http promise
      */
      self.update = function (text) {
        var req = user.authorize({
          method: 'PUT',
          url: config.api + '/about',
          data: {text: text}
        });
        return $http(req);
      };

      /**
      * Retreive the about page
      * @return An $http promise
      */
      self.get = function () {
        var req = {
          method: 'GET',
          url: config.api + '/about'
        };
        return $http(req);
      };

    };

    return About;

  }]);