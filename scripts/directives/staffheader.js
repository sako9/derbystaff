angular
  .module('khe')
  .directive('staffheader', ['$compile', function ($compile) {
    return {

      restrict: 'E',
      templateUrl: '/views/directives/staffheader.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);
        $(document).foundation();
      }

    };
  }]);