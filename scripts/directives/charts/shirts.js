angular
  .module('khe')
  .directive('shirts', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      scope: {
        graph: '=graph'
      },
      templateUrl: '/views/directives/charts/shirts.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        var data = scope.graph;

        var labels = [
          'Small (' + data.small + ')',
          'Medium (' + data.medium + ')',
          'Large (' + data.large + ')',
          'X-Large (' + data.xlarge + ')'
        ];
        var numbers = [
          data.small,
          data.medium,
          data.large,
          data.xlarge
        ];

        new Chartist.Bar('#shirts.ct-chart', {
          labels: labels,
          series: [numbers]
        }, {
          seriesBarDistance: 10,
          reverseData: true,
          horizontalBars: true,
          axisY: {
            offset: 70,
            showGrid: false
          },
          axisX: {
            labelInterpolationFnc: function(value) {
              if (value % 1 === 0) return value;
            }
          }
        });

        $("#shirts.ct-chart").height(4 * 35);

        // Get the total # of shirts
        scope.total = data.small + data.medium + data.large + data.xlarge;

      }

    };
  }]);