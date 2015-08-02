angular
  .module('khe')
  .directive('registrations', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      scope: {
        graph: '=graph'
      },
      templateUrl: '/views/directives/charts/registrations.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        var data = scope.graph;

        var labels = data.months.map(function (month) {
          return month.name + ' (' + month.count + ')';
        });
        var points = data.months.map(function (month) {
          return month.count;
        });

        new Chartist.Line('#registrations.ct-chart', {
          labels: labels,
          series: [{
            name: 'Registrations',
            data: points
          }]
        }, {
          low: 0,
          showArea: true,
          lineSmooth: 0,
          axisY: {
            labelInterpolationFnc: function (value) {
              if (value % 1 === 0) return value;
            }
          },
          axisX: {
            showGrid: false
          }
        });

        // get total # of registrations
        scope.total = 0;
        for (var i = 0; i < points.length; i++) {
          scope.total += points[i];
        }

      }

    };
  }]);