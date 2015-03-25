angular
  .module('khe')
  .factory('Ticket', ['$http', '$filter', 'socketFactory', 'User', function ($http, $filter, socket, User) {

    var Ticket = function () {

      var self = this;
      var user = new User();

      /**
      * A socket connected to /tickets
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var me = user.getMe();
          var encoded = $filter('base64Encode')(me.key + ':' + me.token);
          var s = io.connect(config.api + '/tickets', {
            query: 'authorization=' + encoded
          });
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Get a list of tickets
      */
      self.list = function () {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/tickets'
        });
        return $http(req);
      };

      /**
      * Get a single ticket
      * @param id The ticket ID
      */
      self.get = function (id) {
        var req = user.authorize({
          method: 'GET',
          url: config.api + '/tickets/'+id
        });
        return $http(req);
      };

      /**
      * Create a new ticket
      * @param ticket {subject: String, body: String, replyTo: String}
      */
      self.create = function (ticket) {
        var req = {
          method: 'POST',
          url: config.api + '/tickets',
          data: ticket
        };
        return $http(req);
      };

      /**
      * Update a ticket by ID
      * @param id The ticket ID
      * @param toUpdate An object containing the fields to update
      */
      self.update = function (id, toUpdate) {
        var req = user.authorize({
          method: 'PATCH',
          url: config.api + '/tickets/'+id,
          data: toUpdate
        });
        return $http(req);
      };

      /**
      * Delete a ticket
      * @param id The ticket ID
      */
      self.delete = function (id) {
        var req = user.authorize({
          method: 'DELETE',
          url: config.api + '/tickets/'+id
        });
        return $http(req);
      };

    };

    return Ticket;

  }]);