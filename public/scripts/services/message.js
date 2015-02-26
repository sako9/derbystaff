angular
  .module('khe')
  .factory('Message', ['$http', 'User', 'Config', function ($http, User, Config) {

    var Message = function () {

      var self = this;
      var user = new User();

      /**
      * Get a list of messages
      * @return An $http promise
      */
      self.list = function () {
        var req = {
          method: 'GET',
          url: Config.resolve('/api/messages')
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
          url: Config.resolve('/api/messages/' + id)
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
          url: Config.resolve('/api/messages'),
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
          url: Config.resolve('/api/messages/' + id)
        });
        return $http(req);
      };

    };

    return Message;

  }]);