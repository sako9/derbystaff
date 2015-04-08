angular
  .module('khe')
  .factory('News', ['$http', '$filter', 'socketFactory', 'User', function ($http, $filter, socket, User) {

    var News = function () {

      var self = this;
      var user = new User();

      /**
      * A socket connected to /news
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var me = user.getMe();
          var encoded = $filter('base64Encode')(me.key + ':' + me.token);
          var s = io.connect(config.api + '/news', {
            query: 'authorization=' + encoded
          });
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Add an email to the list
      * @param email An email address
      */
      this.create = function (email) {
        var req = {
          method: 'POST',
          url: config.api + '/news',
          data: {
            email: email
          }
        };
        return $http(req);
      };

      /**
      * Get an email by id
      * @param id
      */
      this.get = function (id) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/news/' + id
        });
        return $http(req);
      };

      /**
      * Get a list of emails
      */
      this.list = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/news'
        });
        return $http(req);
      };

      /**
      * Delete an email from the list
      * @param id
      */
      this.delete = function (id) {
        var req = user.authorize({
          method: 'DELETE',
          url: config.api + '/news/' + id
        });
        return $http(req);
      };

    };

    return News;

  }]);