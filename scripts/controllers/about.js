angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/about', {
      templateUrl: '/views/about.html',
      controller: 'AboutCtrl as about'
    });
  }])
  .controller('AboutCtrl', ['User', 'About', function (User, About) {

    /**
    * The template interface
    */
    var view = this;

    var Models = {
      user: new User(),
      about: new About()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

    /**
    * The about page object
    */
    view.page = {};

    /**
    * Populate the list of messages
    */
    function get() {
      Models.about.get().
      success(function (data) {
        view.errors = null;
        view.page = data;
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
      Models.about.socket().on('create', function (about) {
        view.page = about;
      });

      // Message updated
      Models.about.socket().on('update', function (about) {
        view.page = about;
      });
    }

    view.update = {

      text: null,

      /**
      * Edit the page
      */
      edit: function () {
        this.text = view.page.text;
        view.editing = true;
      },

      /**
      * Cancel editing
      */
      cancel: function () {
        view.editing = false;
        this.text = view.page.text;
      },

      /**
      * Save the edits
      */
      save: function () {
        var self = this;
        Models.about.update(this.text).
        success(function (data) {
          view.errors = null;
          view.page = data;
          self.text = null;
          view.editing = false;
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
