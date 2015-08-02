angular
  .module('khe')
  .directive('gender', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      scope: {
        graph: '=graph'
      },
      templateUrl: '/views/directives/charts/gender.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        var d = scope.graph;

        var data = {
          labels: ['Male', 'Female', 'Other'],
          series: [d.male, d.female, d.other]
        };

        var total = d.male + d.female + d.other;

        new Chartist.Pie('#gender.ct-chart', data, {
          labelInterpolationFnc: function(value) {
            var key = value.toLowerCase(); // male, female, or other
            var percent = Math.round((d[key] / total) * 100);
            return value + ' (' + percent + '%)';
          }
        });

      }

    };
  }]);