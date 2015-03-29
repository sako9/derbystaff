angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/tools', {
      templateUrl: '/views/tools.html',
      controller: 'StaffToolsCtrl as tools'
    });
  }])
  .controller('StaffToolsCtrl', ['User', 'Url', function (User, Url) {

    /**
    * Template interface
    */
    var view = this;

    var Models = {
      user: new User(),
      url: new Url()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

    /**
    * Array of existing urls
    */
    view.urls = [];

    /**
    * Get an initial list of existing urls
    */
    function get() {
      Models.url.list().
      success(function (data) {
        view.errors = null;
        view.urls = data.urls;
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error has occurred'];
      });
    }

    /**
    * Set up socket connections
    */
    function listen() {
      // Url created
      Models.url.socket().on('create', function (url) {
        view.urls.push(url);
      });

      // Url deleted
      Models.url.socket().on('delete', function (url) {
        view.urls = view.urls.filter(function (u) {
          return u._id != url._id;
        });
      });
    }

    view.url = {

      /**
      * The model for a new URL
      */
      new: {},

      /**
      * Save the new url
      */
      save: function () {
        var self = this;
        Models.url.shorten(self.new.full, self.new.short).
        success(function (data) {
          view.errors = null;
          self.new = {};
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error occurred'];
        });
      },

      /**
      * Delete a given URL
      */
      remove: function (url) {
        Models.url.remove(url._id).
        success(function (data) {
          view.errors = null;
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error occurred'];
        });
      }

    };

    /**
    * Initialize controller
    */
    get();
    listen();

  }]);
