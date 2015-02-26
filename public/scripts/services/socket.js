angular
  .module('khe')
  .service('Socket', [function () {

    return io.connect('http://localhost:3000');

  }]);