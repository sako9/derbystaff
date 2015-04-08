angular
  .module('khe')
  .directive('requireadmin', ['$location', 'User', function ($location, User) {
    var user = new User().getMe();
    if (!user || user.role != 'admin') {
      $location.path('/login');
    }

    return {

      restrict: 'E',
      transclude: true,

      templateUrl: '/views/directives/requireadmin.html',

      scope: {
        user: '=user',
        error: '=error'
      }

    };
  }]);