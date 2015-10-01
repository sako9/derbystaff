angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/attendees', {
      templateUrl: '/views/attendees.html',
      controller: 'AttendeesCtrl as att'
    });
  }])
  .controller('AttendeesCtrl', ['User', 'Application', 'Stats', function (User, Application, Stats) {

    /**
    * The interface that a template can use. To see all variables available
    * to the template, just console.log(view) at the bottom of this controller.
    */
    var view = this;

    var Models = {
      user: new User(),
      application: new Application(),
      stats: new Stats()
    };

    /**
    * The currently logged in user
    */
    view.me = Models.user.getMe();

    /**
    * An array of the currently displayed users
    */
    view.users = [];

    /**
    * Arrays of different types of users
    */
    view.all = [];
    view.applied = [];
    view.going = [];
    view.approved = [];
    view.waitlisted = [];
    view.pending = [];
    view.denied = [];
    view.travel = [];
    view.checked = [];

    /**
    * Get a list of all users with applications
    */
    function get() {
      Models.application.list().
      success(function (data) {
        view.errors = null;
        view.all = data.users;
        reload();
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error has occurred'];
      });
    }

    /**
    * Set up socket listeners
    */
    function listen() {
      // User created
      Models.user.socket().on('create', function (user) {
        view.all.push(user);
        reload();
      });

      // User updated
      Models.user.socket().on('update', function (user) {
        view.all = view.all.map(function (u) {
          if (u._id == user._id) {
            u.email = user.email;
          }
          return u;
        });
        reload();
      });

      // User deleted
      Models.user.socket().on('delete', function (user) {
        view.all = view.all.filter(function (u) {
          return u._id != user._id;
        });
        reload();
      });

      // Application created
      Models.application.socket().on('create', function (user) {
        view.all = view.all.map(function (u) {
          if (u._id == user._id) {
            u = user;
          }
          return u;
        });
        reload();
      });

      // Application updated
      Models.application.socket().on('update', function (user) {
        view.all = view.all.map(function (u) {
          if (u._id == user._id) {
            u = user;
          }
          return u;
        });
        reload();
      });

      // Application deleted
      Models.application.socket().on('delete', function (user) {
        view.all = view.all.map(function (u) {
          if (u._id == user._id) {
            u.application = null;
          }
          return u;
        });
        reload();
      });
    }

    /**
    * Trigger reload of the user list
    * Call this function each time the list of users changes somehow
    */
    function reload() {
      view.filter.init();
      view.filter.apply(view.filter.current);
      estimateAttendees();
    }

    /**
    * Get an estimate # of attendees
    * Estimate is about 33% of Applied or 75% of RSVPs
    */
    function estimateAttendees() {
      var minEst = (0.30) * view.applied.length;
      if (view.going.length > minEst) {
        var emin = (0.65) * view.going.length;
        minEst = (minEst + emin) / 2;
      }

      var maxEst = (0.50) * view.applied.length;
      if (view.going.length > maxEst) {
        var emax = (0.85) * view.going.length;
        maxEst = (maxEst + emax) / 2;
      }

      view.minimumEstimate = Math.floor(minEst);
      view.maximumEstimate = Math.ceil(maxEst);
    }

    /**
    * Structure to filter users
    */
    view.filter = {

      /**
      * The currently applied filter
      */
      current: 'all',

      /**
      * Initialize every array with the different types of users
      */
      init: function () {
        view.applied = view.all.filter(function (user) {
          return user.application;
        });

        view.probable = view.all.filter(function (user) {
          return user.application && user.application.probable;
        });

        view.going = view.all.filter(function (user) {
          return user.application && user.application.going;
        });

        view.approved = view.all.filter(function (user) {
          return user.application && user.application.status == 'approved';
        });

        view.waitlisted = view.all.filter(function (user) {
          return user.application && user.application.status == 'waitlisted';
        });

        view.pending = view.all.filter(function (user) {
          return user.application && user.application.status == 'pending';
        });

        view.denied = view.all.filter(function (user) {
          return user.application && user.application.status == 'denied';
        });

        view.travel = view.all.filter(function (user) {
          return user.application && user.application.travel;
        });

        view.checked = view.all.filter(function (user) {
          return user.application && user.application.checked;
        });
      },

      /**
      * Apply a filter to the list of current users
      * @param filter The name of the filter to apply
      */
      apply: function (filter) {
        this.current = filter;
        switch (filter) {
          case 'all':
            view.users = view.all;
            break;
          case 'applied':
            view.users = view.applied;
            break;
          case 'probable':
            view.users = view.probable;
            break;
          case 'going':
            view.users = view.going;
            break;
          case 'approved':
            view.users = view.approved;
            break;
          case 'waitlisted':
            view.users = view.waitlisted;
            break;
          case 'pending':
            view.users = view.pending;
            break;
          case 'denied':
            view.users = view.denied;
            break;
          case 'travel':
            view.users = view.travel;
            break;
          case 'checked':
            view.users = view.checked;
            break;
        }
      }

    };

    view.visibility = {

      /**
      * Toggle the expanded view of a given user
      */
      toggle: function (user) {
        if (this.expandedId == user._id) {
          this.expandedId = '';
        } else {
          this.expandedId = user._id;
        }
      },

      /**
      * Check to see whether a user is expanded
      */
      check: function (user) {
        return this.expandedId == user._id;
      }

    };

    view.status = {

      /**
      * Edit the status of a user
      */
      edit: function (user) {
        user.application.oldStatus = user.application.status;
        user.editingStatus = true;
      },

      /**
      * Save the status of a user
      */
      save: function (user) {
        Models.application.updateById(user._id, {
          status: user.application.status
        }).
        success(function (data) {
          view.errors = null;
          user.editingStatus = false;
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error occurred'];
        });
      },

      /**
      * Cancel editing the status of a user
      */
      cancel: function (user) {
        user.application.status = user.application.oldStatus;
        user.editingStatus = false;
      }

    };

    view.checkedIn = {

      /**
      * Edit the checked in status of a user
      */
      edit: function (user) {
        user.application.oldChecked = user.application.checked;
        user.editingChecked = true;
      },

      /**
      * Save the checked-in status of a user
      */
      save: function (user) {
        Models.application.updateById(user._id, {
          checked: user.application.checked
        }).
        success(function (data) {
          view.errors = null;
          user.editingChecked = false;
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error occurred'];
        });
      },

      /**
      * Cancel editing the checked-in status of a user
      */
      cancel: function (user) {
        user.application.checked = user.application.oldChecked;
        user.editingChecked = false;
      }

    };

    view.role = {

      /**
      * Edit the role of a user
      */
      edit: function (user) {
        user.oldRole = user.role;
        user.editingRole = true;
      },

      /**
      * Save the role of a user
      */
      save: function (user) {
        Models.user.updateById(user._id, {
          role: user.role
        }).
        success(function (data) {
          view.errors = null;
          user.editingRole = false;
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error occurred'];
        });
      },

      /**
      * Cancel editing the role
      */
      cancel: function (user) {
        user.role = user.oldRole;
        user.editingRole = false;
      }

    };

    view.del = {

      /**
      * Toggle delete button visibility
      * @param user A user object
      */
      toggle: function (user) {
        if (this.deleteId == user._id) {
          this.deleteId = '';
        } else {
          this.deleteId = user._id;
        }
      },

      /**
      * Check delete button visibility
      * @param user A user object
      */
      check: function (user) {
        return this.deleteId == user._id;
      },

      /**
      * Delete the user
      * @param user A user object
      */
      yes: function (user) {
        Models.user.delete(user._id).
        success(function (data) {
          view.all = view.all.filter(function (u) {
            return u._id != data._id;
          });
          reload();
        }).
        error(function (data) {
          view.errors = data.errors;
        });
      }

    };

    view.prob = {

      /**
      * Toggle the probable status of the user
      * @param user A user object
      */
      toggle: function (user) {
        Models.application.updateById(user._id, {
          probable: !user.application.probable
        }).
        success(function (user) {
          view.all = view.all.map(function (u) {
            if (u._id == user._id) u = user;
            return u;
          });
        }).
        error(function (data) {
          view.errors = data.errors;
        });
      }

    };

    /**
    * Initialize the controller
    */
    get();
    listen();

  }]);
