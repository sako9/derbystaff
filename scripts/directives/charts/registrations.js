angular
  .module('khe')
  .directive('registrations', ['$compile', function ($compile) {

    /**
    * Add tooltips for viewing values at each point
    */
    function addTooltips() {
      var $chart = $('#registrations.ct-chart');
      var $toolTip = $chart
        .append('<div class="tooltip"></div>')
        .find('.tooltip')
        .hide();

      $chart.on('mouseenter', '.ct-point', function() {
        var $point = $(this),
          value = $point.attr('ct:value');
        $toolTip.html(value).show();
      });

      $chart.on('mouseleave', '.ct-point', function() {
        $toolTip.hide();
      });

      $chart.on('mousemove', function(event) {
        $toolTip.css({
          left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 + 50,
          top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() + 80
        });
      });
    }

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

        addTooltips();

      }

    };
  }]);