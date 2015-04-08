angular
  .module('khe')
  .directive('requirelogin', ['$location', 'User', function ($location, User) {
    var user = new User().getMe();
    if (!user) {
      $location.path('/login');
    }

    return {

      restrict: 'E',
      transclude: true,

      templateUrl: '/views/directives/requirelogin.html',

      scope: {
        user: '=user',
        error: '=error'
      }

    };
  }]);