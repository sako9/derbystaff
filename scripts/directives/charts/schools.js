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

          data.schools.sort(function (a, b) {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            return 0;
          });

          var labels = data.schools.map(function (r) {
            return r.name;
          });

          var numbers = data.schools.map(function (r) {
            return r.count;
          });

          new Chartist.Bar('#schools.ct-chart', {
            labels: labels,
            series: [numbers]
          }, {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            axisY: {
              offset: 150,
              showGrid: false
            },
            axisX: {
              labelInterpolationFnc: function(value) {
                if (value % 1 === 0) return value;
              }
            }
          });

          $("#schools.ct-chart").height(data.schools.length * 45);

        });

      }

    };
  }]);
