angular.module('khe', ['ngRoute', 'ngCookies', 'btford.socket-io']);

angular
  .module('khe')
  .config(['$locationProvider', function ($locationProvider) {
    // $locationProvider.html5Mode(true);
  }])
  .service('Config', [function () {
    return {

      apiUrl: 'http://localhost:3000',

      resolve: function (route) {
        return this.apiUrl + route;
      }

    };
  }]);