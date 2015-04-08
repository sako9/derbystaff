angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/tools/urls', {
      templateUrl: '/views/tools/urls.html',
      controller: 'ToolsUrlsCtrl as urls'
    });
  }])
  .controller('ToolsUrlsCtrl', ['User', 'Url', function (User, Url) {

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
    view.all = [];

    /**
    * Get an initial list of existing urls
    */
    function get() {
      Models.url.list().
      success(function (data) {
        view.errors = null;
        view.all = data.urls;
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
        view.all.push(url);
      });

      // Url deleted
      Models.url.socket().on('delete', function (url) {
        view.all = view.all.filter(function (u) {
          return u._id != url._id;
        });
      });
    }

    view.single = {

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
