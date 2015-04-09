angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/tools', {
      templateUrl: '/views/tools/stats.html'
    });
  }])
  .controller('StatsCtrl', ['User', 'Url', function (User, Url) {

    /**
    * Template interface
    */
    var view = this;

    var Models = {
      user: new User(),
      url: new Url()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

  }]);
