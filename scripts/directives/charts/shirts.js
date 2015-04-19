angular
  .module('khe')
  .directive('shirts', ['$compile', 'Stats', function ($compile, Stats) {

    var Models = {
      stats: new Stats()
    };

    return {

      restrict: 'E',
      templateUrl: '/views/directives/charts/shirts.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        Models.stats.shirts().
        success(function (data) {

          var labels = ['Small', 'Medium', 'Large', 'X-Large'];
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

        });

      }

    };
  }]);