/**
* Url model
* Connects to the /urls part of the API
*/
angular
  .module('khe')
  .factory('Url', ['$http', '$filter', 'socketFactory', 'User', function ($http, $filter, socket, User) {

    var Url = function () {

      var user = new User();

      /**
      * A socket connected to /urls
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var me = user.getMe();
          var encoded = $filter('base64Encode')(me.key + ':' + me.token);
          var s = io.connect(config.api + '/urls', {
            query: 'authorization=' + encoded
          });
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Shorten a url
      * @param full The full length URL to resolve to
      * @param small The shortcut URL
      * @return An $http promise
      */
      this.shorten = function (full, small) {
        var req = user.authorize({
          method: 'POST',
          url: config.api + '/urls',
          data: {
            full: full,
            short: small
          }
        });
        return $http(req);
      };

      /**
      * Remove a url
      * @param id The URL object's ID
      * @return An $http promise
      */
      this.remove = function (id) {
        var req = user.authorize({
          method: 'DELETE',
          url: config.api + '/urls/' + id,
        });
        return $http(req);
      };

      /**
      * Get a list of urls
      * @return An $http promise
      */
      this.list = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/urls'
        });
        return $http(req);
      };

    };

    return Url;

  }]);