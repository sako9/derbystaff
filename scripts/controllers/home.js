angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router
      .when('/', {
        templateUrl: '/views/home.html'
      });
  }])
  .controller('StaffHomeCtrl', ['User', '$location', function (User, $location) {

    var self = this;
    var user = new User();
    self.user = user.getMe();

    if (!self.user) {
      $location.path('/login');
    }

  }]);