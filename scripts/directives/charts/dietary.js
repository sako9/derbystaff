angular
  .module('khe')
  .directive('dietary', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      scope: {
        graph: '=graph'
      },
      templateUrl: '/views/directives/charts/dietary.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        var data = scope.graph;

        data.restrictions.sort(function (a, b) {
          if (a.count > b.count) return -1;
          if (a.count < b.count) return 1;
          return 0;
        });

        var labels = data.restrictions.map(function (r) {
          return r.name + ' (' + r.count + ')';
        });

        var numbers = data.restrictions.map(function (r) {
          return r.count;
        });

        new Chartist.Bar('#dietary.ct-chart', {
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

        $("#dietary.ct-chart").height(data.restrictions.length * 35);

      }

    };
  }]);