angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/attendees/checkin', {
      templateUrl: '/views/checkin.html',
      controller: 'CheckInCtrl as checkin'
    });
  }])
  .controller('CheckInCtrl', ['User', 'Application', '$scope', function (User, Application, $scope) {

    /**
    * The view object is the interface for any template using this controller.
    * To see the interface, just console.log(view) at the bottom of this file
    */
    var view = this;

    var Models = {
      user: new User(),
      application: new Application()
    };

    /**
    * The logged in user
    */
    view.me = Models.user.getMe();

    /**
    * An array of all users
    */
    view.users = [];

    /**
    * A count of checked in users
    */
    view.count = 0;

    /**
    * Update the count of checked in users
    */
    function updateCount() {
      view.count = view.users.filter(function (user) {
        return user.application && user.application.checked;
      }).length;
    }

    /**
    * Retrieve a list of users
    */
    function get() {
      Models.application.list().
      success(function (data) {
        view.errors = null;
        view.users = data.users;
        updateCount();
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error occurred'];
      });
    }

    /**
    * Set up socket listeners
    */
    function listen() {
      // Application created
      Models.application.socket().on('create', function (user) {
        view.users.push(user);
        updateCount();
      });

      // Application updated
      Models.application.socket().on('update', function (user) {
        var i = view.users.length;
        while(i--) {
          if (view.users[i]._id == user._id) {
            view.users[i] = user;
            break;
          }
        }
        updateCount();
      });

      // Application deleted
      Models.application.socket().on('delete', function (user) {
        var i = view.users.length;
        while(i--) {
          if (view.users[i]._id == user._id) {
            view.users[i].application = null;
            break;
          }
        }
        updateCount();
      });

      // User created
      Models.user.socket().on('create', function (user) {
        view.users.push(user);
        updateCount();
      });

      // User updated
      Models.user.socket().on('update', function (user) {
        var i = view.users.length;
        while(i--) {
          if (view.users[i]._id == user._id) {
            view.users[i].email = user.email;
            break;
          }
        }
        updateCount();
      });

      // User deleted
      Models.user.socket().on('delete', function (user) {
        var i = view.users.length;
        while(i--) {
          if (view.users[i]._id == user._id) {
            view.users.splice(i, 1);
            break;
          }
        }
        updateCount();
      });
    }

    /**
    * Manage the quick application form
    */
    view.quick = {

      /**
      * Hold the application object
      */
      application: {},

      /**
      * Submit the quick application form
      */
      register: function () {
        var self = this;
        self.application.phone = self.application.phone.replace(/\D/g,'');
        Models.user.quick(self.application).
        success(function (data) {
          view.errors = null;
          self.application = {};
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error occurred'];
        });
      },

      /**
      * Save a user that is halfway registered (this is for someone that
      * has an email and password, but did not submit an application)
      */
      edit: function (user) {
        Models.application.updateById(user._id, {
          name: user.app.name,
          phone: user.app.phone,
          submitted: true,
          status: 'approved',
          going: true,
          checked: true,
          time: Date.now(),
          demographic: true,
          conduct: true,
          travel: false,
          waiver: true,
          door: true
        }).
        success(function (data) {
          view.errors = null;
          console.log(data);
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error has occurred'];
        });
      }

    };

    /**
    * Toggle the checked in status of the user
    */
    view.toggleChecked = function (user) {
      Models.application.updateById(user._id, {
        checked: user.application.checked
      }).
      success(function (data) {
        view.errors = null;
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error occurred'];
      });
    };

    /**
    * Expand/contract list view items
    */
    view.visibility = {

      /**
      * Expand a user
      */
      toggle: function (user) {
        if (this.expandedId == user._id) {
          this.expandedId = '';
        } else {
          this.expandedId = user._id;
        }
      },

      /**
      * Check to see if a user is expanded
      */
      check: function (user) {
        return this.expandedId == user._id;
      }

    };

    view.phone = {

      editingId: null,
      oldPhone: null,

      /**
      * Edit a user's phone number
      */
      edit: function (user) {
        this.editingId = user._id;
        this.oldPhone = user.application.phone;
      },

      /**
      * Stop editing a user's phone number
      */
      cancel: function (user) {
        this.editingId = null;
        user.application.phone = this.oldPhone;
        this.oldPhone = null;
      },

      /**
      * Save the user's phone number
      */
      save: function (user) {
        var self = this;
        Models.application.updateById(user._id, {
          phone: user.app.phone
        }).
        success(function (data) {
          console.log('success', data);
          view.errors = null;
          self.editingId = null;
          self.oldPhone = null;
        }).
        error(function (data) {
          console.log('error', data);
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
