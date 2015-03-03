angular
  .module('khe')
  .service('Socket', ['socketFactory', function (socketFactory) {
    var socket = io.connect(config.api);
    return socketFactory({ioSocket: socket});
  }]);