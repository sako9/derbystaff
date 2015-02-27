angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router
      .when('/', {
        templateUrl: '/views/home.html'
      });
  }])
  .controller('StaffHomeCtrl', ['User', function (User) {

    var self = this;
    var user = new User();
    self.user = user.getMe();

  }]);