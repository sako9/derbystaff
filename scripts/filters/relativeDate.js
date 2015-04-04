angular
  .module('khe')
  .filter('relativeDate', function () {
    return function (input) {
      if (new Date(input).getTime() > Date.now()) {
        return 'just now';
      }
      return moment(input).fromNow();
    };
  });