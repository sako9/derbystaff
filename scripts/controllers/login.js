angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/login', {
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl as ctrl'
    });
  }])
  .controller('LoginCtrl', ['User', '$location', function (User, $location) {

    var self = this;
    var user = new User();

    self.login = function () {
      user.login({
        email: self.user.email,
        password: self.user.password
      }).
      success(function (data) {
        self.errors = null;
        user.setMe(data);
        $location.path('/');
      }).
      error(function (data) {
        if (data) {
          self.errors = data.errors || ['An internal error has occurred'];
        }
      });
    };

    self.register = function () {
      user.register({
        email: self.user.email,
        password: self.user.password
      }).
      success(function (data) {
        self.errors = null;
        user.setMe(data);
        self.successes = ['You have successfully registered. Please wait for staff approval.'];
        self.showRegister = false;
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error has occurred'];
      });
    };

  }]);
