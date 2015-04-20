angular
  .module('khe')
  .directive('gender', ['$compile', 'Stats', function ($compile, Stats) {

    var Models = {
      stats: new Stats()
    };

    return {

      restrict: 'E',
      templateUrl: '/views/directives/charts/gender.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        Models.stats.gender().
        success(function (d) {

          var data = {
            labels: ['Male', 'Female', 'Other'],
            series: [d.male, d.female, d.other]
          };

          var total = d.male + d.female + d.other;

          new Chartist.Pie('#gender.ct-chart', data, {
            labelInterpolationFnc: function(value) {
              var key = value.toLowerCase(); // male, female, or other
              var percent = Math.round((d[key] / total) * 100);
              var label = value + ' (' + percent + '%)';
              console.log(label);
              return label;
            }
          });

        });

      }

    };
  }]);