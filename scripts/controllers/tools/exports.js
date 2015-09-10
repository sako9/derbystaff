angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/tools/exports', {
      templateUrl: '/views/tools/exports.html',
      controller: 'ExportsCtrl as ctrl'
    });
  }])
  .controller('ExportsCtrl', ['User', function (User) {

    /**
    * Template interface
    */
    var view = this;

    var Models = {
      user: new User()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

    view.attendees = config.api + '/exports/attendees';
    view.resumes = config.api + '/exports/resumes';

  }]);
