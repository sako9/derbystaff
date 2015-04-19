angular
  .module('khe')
  .directive('registrations', ['$compile', 'Stats', function ($compile, Stats) {

    var Models = {
      stats: new Stats()
    };

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
          value = $point.attr('ct:value'),
          seriesName = $point.parent().attr('ct:series-name');
        $toolTip.html(seriesName + '<br>' + value).show();
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
      templateUrl: '/views/directives/charts/registrations.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);

        Models.stats.registrations().
        success(function (data) {

          var labels = data.months.map(function (month) {
            return month.name;
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
            axisX: {
              showGrid: false
            }
          });

          addTooltips();

        });

      }

    };
  }]);