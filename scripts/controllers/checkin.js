angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/attendees/checkin', {
      templateUrl: '/views/checkin.html',
      controller: 'StaffCheckInCtrl'
    });
  }])
  .controller('StaffCheckInCtrl', ['User', 'Application', 'Socket', '$scope', function (User, Application, Socket, $scope) {

    var self = this;
    var user = new User();
    var application = new Application();

    self.me = user.getMe();

    self.users = [];
    self.count = 0;

    function updateCount() {
      self.count = self.users.filter(function (user) {
        return user.application && user.application.checked;
      }).length;
    }

    // Populate our user list
    function get() {
      application.list().
      success(function (data) {
        self.users = data.users;
        updateCount();
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });
    }
    get();

    // Keep an update list of users
    Socket.on('/application/quick', function (user) {
      self.users.push(user);
      updateCount();
    });

    // Keep track of changes to individual users
    Socket.on('/application/update', function (user) {
      for (var i = 0; i < self.users.length; i++) {
        if (self.users[i]._id == user._id) {
          self.users[i] = user;
          updateCount();
          break;
        }
      }
    });

    // Hold the quick application object
    // (name, email, phone)
    self.quickApp = {};

    // Submit the quick registration form
    self.register = function () {
      self.quickApp.phone = self.quickApp.phone.replace(/\D/g,'');
      user.quick(self.quickApp).
      success(function (data) {
        self.quickApp = {};
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });
    };

    // Toggle the checked in status of the user
    self.toggleChecked = function (user) {
      application.updateById(user._id, {
        checked: user.application.checked
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });
    };

    // Save the currently edited user
    self.saveQuickEdit = function (user) {
      application.updateById(user._id, {
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
        console.log(data);
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error has occurred'];
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

  }]);
