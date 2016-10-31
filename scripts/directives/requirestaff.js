angular
  .module('khe')
  .directive('requirestaff', ['$location', 'User', function ($location, User) {
    var user = new User().getMe();
    if (!user ) {
        console.log("user")
        console.log(user);
     // $location.path('/login');
    }

    return {

      restrict: 'E',
      transclude: true,

      templateUrl: '/views/directives/requirestaff.html',

      scope: {
        user: '=user',
        error: '=error'
      }

    };
  }]);