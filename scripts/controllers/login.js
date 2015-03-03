angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/login', {
      templateUrl: '/views/login.html'
    });
  }])
  .controller('StaffLoginCtrl', ['User', '$location', function (User, $location) {

    var self = this;
    var user = new User();

    self.login = function () {
      user.login({
        email: self.user.email,
        password: self.user.password
      }).
      success(function (data) {
        self.errors = data.errors;
        if (!data.errors) {
          user.setMe(data);
          $location.path('/');
        }
      }).
      error(function () {
        self.errors = ['An internal error has occurred'];
      });
    };

  }]);