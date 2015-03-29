angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/live', {
      templateUrl: '/views/live.html',
      controller: 'LiveCtrl as live'
    });
  }])
  .controller('LiveCtrl', ['User', 'Message', function (User, Message) {

    /**
    * The template interface
    */
    var view = this;

    var Models = {
      user: new User(),
      message: new Message()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

    /**
    * An array of all messages
    */
    view.messages = [];

    /**
    * Populate the list of messages
    */
    function get() {
      Models.message.list().
      success(function (data) {
        view.errors = null;
        view.messages = data.messages;
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error has occurred'];
      });
    }

    /**
    * Set up socket connections
    */
    function listen() {
      // Message created
      Models.message.socket().on('create', function (message) {
        view.messages.push(message);
      });

      // Message updated
      Models.message.socket().on('update', function (message) {
        view.messages = view.messages.map(function (m) {
          if (m._id == message._id) {
            m = message;
          }
          return m;
        });
      });

      // Message deleted
      Models.message.socket().on('delete', function (message) {
        view.messages = view.messages.filter(function (m) {
          return m._id != message._id;
        });
      });
    }

    view.message = {

      /**
      * An object containing the new message
      */
      new: {},

      /**
      * Send the new message
      */
      create: function () {
        var self = this;
        Models.message.create(self.new.text).
        success(function (data) {
          view.errors = null;
          self.new = {};
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error had occurred'];
        });
      },

      /**
      * Delete a given message
      */
      delete: function (message) {
        Models.message.delete(message._id).
        success(function (data) {
          view.errors = null;
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error has occurred'];
        });
      }

    };

    /**
    * Initialize controller
    */
    get();
    listen();

  }]);
