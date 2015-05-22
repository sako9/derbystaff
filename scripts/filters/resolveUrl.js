angular
  .module('khe')
  .filter('fullUrl', function () {
    return function (input) {
      if (!input.match(/^[a-zA-Z]+:\/\//)) {
        input = 'http://' + input;
      }
      return input;
    };
  });