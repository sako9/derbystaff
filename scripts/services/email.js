angular
  .module('khe')
  .factory('Email', ['$http', '$filter', 'User', 'socketFactory', function ($http, $filter, User, socket) {

    var Email = function () {

      var user = new User();

      /**
      * A socket connected to /emails
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var me = user.getMe();
          var encoded = $filter('base64Encode')(me.key + ':' + me.token);
          var s = io.connect(config.api + '/emails', {
            query: 'authorization=' + encoded
          });
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Send an email
      * @param email An email object (see API docs)
      * @return An $http promise
      */
      this.send = function (email) {
        var req = user.authorize({
          method: 'POST',
          url: config.api + '/emails',
          data: email
        });
        return $http(req);
      };

      /**
      * Get a list of sent emails
      * @return An $http promise
      */
      this.list = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/emails'
        });
        return $http(req);
      };

    };

    return Email;

  }]);