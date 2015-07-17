angular
  .module('khe')
  .directive('schools', ['$compile', 'Stats', function ($compile, Stats) {

    var Models = {
      stats: new Stats()
    };

    return {

      restrict: 'E',
      templateUrl: '/views/directives/charts/schools.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        Models.stats.schools().
        success(function (data) {

          scope.schools = data.schools;

          data.schools.sort(function (a, b) {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            return 0;
          });

        });

      }

    };
  }]);
