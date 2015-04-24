angular
  .module('khe')
  .factory('Event', ['$http', 'socketFactory', 'User', function ($http, socket, User) {

    var Event = function () {

      var self = this;
      var user = new User();

      /**
      * A socket connected to /events
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var s = io.connect(config.api + '/events');
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Create a new event
      * @param event An event object
      * @return An $http promise
      */
      self.create = function (event) {
        var req = user.authorize({
          method: 'POST',
          url: config.api + '/events',
          data: event
        });
        return $http(req);
      };

      /**
      * Get a list of events
      * @return An $http promise
      */
      self.list = function () {
        var req = {
          method: 'GET',
          url: config.api + '/events'
        };
        return $http(req);
      };

      /**
      * Get an event by id
      * @param id The event id
      * @return An $http promise
      */
      self.get = function (id) {
        var req = {
          method: 'GET',
          url: config.api + '/events/' + id
        };
        return $http(req);
      };

      /**
      * Update an event
      * @param id The event id
      * @param event An event object
      * @return An $http promise
      */
      self.update = function (id, event) {
        var req = user.authorize({
          method: 'PATCH',
          url: config.api + '/events/' + id,
          data: event
        });
        return $http(req);
      };

      /**
      * Delete an event
      * @param id The event ID
      * @return An $http promise
      */
      self.delete = function (id) {
        var req = user.authorize({
          method: 'DELETE',
          url: config.api + '/events/' + id
        });
        return $http(req);
      };

    };

    return Event;

  }]);