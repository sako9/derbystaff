angular
  .module('khe')
  .factory('Message', ['$http', 'socketFactory', 'User', function ($http, socket, User) {

    var Message = function () {

      var self = this;
      var user = new User();

      /**
      * A socket connected to /messages
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var s = io.connect(config.api + '/messages');
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Get a list of messages
      * @return An $http promise
      */
      self.list = function () {
        var req = {
          method: 'GET',
          url: config.api + '/messages'
        };
        return $http(req);
      };

      /**
      * Get a message by id
      * @param id The message id
      * @return An $http promise
      */
      self.get = function (id) {
        var req = {
          method: 'GET',
          url: config.api + '/messages/' + id
        };
        return $http(req);
      };

      /**
      * Create a new message
      * @param text The string of the message
      * @return An $http promise
      */
      self.create = function (text) {
        var req = user.authorize({
          method: 'POST',
          url: config.api + '/messages',
          data: {text: text}
        });
        return $http(req);
      };

      /**
      * Delete a message
      * @param id The message ID
      * @return An $http promise
      */
      self.delete = function (id) {
        var req = user.authorize({
          method: 'DELETE',
          url: config.api + '/messages/' + id
        });
        return $http(req);
      };

    };

    return Message;

  }]);