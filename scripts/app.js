angular.module('khe', ['ngRoute', 'ngCookies', 'btford.socket-io', 'angular-loading-bar', 'angularMoment']);

angular
  .module('khe')
  .config(['$locationProvider', 'cfpLoadingBarProvider', function ($locationProvider, loadingBar) {
    $locationProvider.html5Mode(true);
    loadingBar.includeSpinner = false;
    loadingBar.latencyThreshold = 50;
  }]);
