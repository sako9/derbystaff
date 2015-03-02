angular
  .module('khe')
  .service('Socket', ['socketFactory', function (socketFactory) {
    var socket = io.connect('http://localhost:3000');
    return socketFactory({ioSocket: socket});
  }]);