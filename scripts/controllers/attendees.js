angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/attendees', {
      templateUrl: '/views/attendees.html',
      controller: 'StaffAttendeesCtrl'
    });
  }])
  .controller('StaffAttendeesCtrl', ['User', 'Application', function (User, Application) {

    var self = this;
    var applicationModel = new Application();
    var userModel = new User();
    self.user = userModel.getMe();

    self.users = [];
    self.current = [];
    self.updatable = [];

    // Get all users
    applicationModel.list().
    success(function (data) {
      self.users = data.users;
      readable();
      self.updatable = self.current = self.users;
    }).
    error(function (data) {
      self.errors = data.errors || ['An internal error has occurred'];
    });

    // Display all users
    self.all = function () {
      self.current = self.users;
    };

    // Display users with submitted applications
    self.applied = function () {
      self.current = self.users.filter(function (user) {
        return user.application;
      });
    };

    // Display users that have RSVPd yes
    self.going = function () {
      self.current = self.users.filter(function (user) {
        return user.application && user.application.going == 'Going';
      });
    };

    // Display approved users
    self.approved = function () {
      self.current = self.users.filter(function (user) {
        return user.application && user.application.status == 'approved';
      });
    };

    // Display waitlisted users
    self.waitlisted = function () {
      self.current = self.users.filter(function (user) {
        return user.application && user.application.status == 'waitlisted';
      });
    };

    // Display pending users
    self.pending = function () {
      self.current = self.users.filter(function (user) {
        return user.application && user.application.status == 'pending';
      });
    };

    // Display denied users
    self.denied = function () {
      self.current = self.users.filter(function (user) {
        return user.application && user.application.status == 'denied';
      });
    };

    // Display users that have requested travel
    self.travel = function () {
      self.current = self.users.filter(function (user) {
        return user.application && user.application.travel == 'Yes';
      });
    };

    // Display only checked in users
    self.checked = function () {
      self.current = self.users.filter(function (user) {
        return user.application && user.application.checked == 'Yes';
      });
    };

    // Expand a user
    self.toggle = function (user) {
      if (self.expandedId == user._id) {
        self.expandedId = '';
      } else {
        self.expandedId = user._id;
      }
    };

    // Check if a user is expanded
    self.expanded = function (user) {
      return self.expandedId == user._id;
    };

    // Edit the status of a user
    self.editStatus = function (user) {
      user.application.oldStatus = user.application.status;
      user.editingStatus = true;
    };

    // Save the status of a user
    self.saveStatus = function (user) {
      applicationModel.updateById(user._id, {
        status: user.application.status
      }).
      success(function (data) {
        user.editingStatus = false;
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });
    };

    // Cancel editing the status
    self.cancelEditStatus = function (user) {
      user.application.status = user.application.oldStatus;
      user.editingStatus = false;
    };

    // Edit checked in status of a user
    self.editChecked = function (user) {
      user.application.oldChecked = user.application.checked;
      user.editingChecked = true;
    };

    // Save the checked in status of a user
    self.saveChecked = function (user) {
      var checked = (user.application.checked == 'Yes' ? true : false);
      applicationModel.updateById(user._id, {
        checked: checked
      }).
      success(function (data) {
        user.editingChecked = false;
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });
    };

    // Cancel editing the checked in status of a user
    self.cancelEditChecked = function (user) {
      user.application.checked = user.application.oldChecked;
      user.editingChecked = false;
    };

    // Edit the role of a user
    self.editRole = function (user) {
      user.oldRole = user.role;
      user.editingRole = true;
    };

    // Save the role of a user
    self.saveRole = function (user) {
      userModel.updateById(user._id, {role: user.role}).
      success(function (data) {
        user.editingRole = false;
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });
    };

    // Cancel editing the role
    self.cancelEditRole = function (user) {
      user.role = user.oldRole;
      user.editingRole = false;
    };

    // Make the data human-readable
    // Possibly move this into filters? It's pretty inefficient currently
    function readable() {
      for (var i = 0; i < self.users.length; i++) {
        var user = self.users[i];
        if (user.application) {
          switch (user.application.shirt) {
            case 'S':
              user.application.shirt = 'Small';
              break;
            case 'M':
              user.application.shirt = 'Medium';
              break;
            case 'L':
              user.application.shirt = 'Large';
              break;
            case 'XL':
              user.application.shirt = 'X-Large';
              break;
          }
          if (!user.application.gender) user.application.gender = '-';
          user.application.first = (user.application.first ? 'Yes' : 'No');
          if (user.application.dietary.length) {
            var diet = user.application.dietary[0];
            for (var j = 1; j < user.application.dietary.length; j++) {
              diet = diet + ', ' + user.application.dietary[j];
            }
            user.application.dietary = diet;
          } else {
            user.application.dietary = 'None';
          }
          user.application.travel = (user.application.travel ? 'Yes' : 'No');
          user.application.checked = (user.application.checked ? 'Yes': 'No');
          if (user.application.going === undefined) {
            user.application.going = 'None';
          } else if (user.application.going === false) {
            user.application.going = 'Not Going';
          } else {
            user.application.going = 'Going';
          }
        }
      };
    }

  }]);
