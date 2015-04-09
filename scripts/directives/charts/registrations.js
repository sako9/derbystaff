angular
  .module('khe')
  .directive('registrations', ['$compile', 'Application', function ($compile, Application) {

    var Models = {
      application: new Application()
    };

    function Registrations() {
      this.users = [];
      this.months = [];
    }

    Registrations.prototype.fetch = function(callback) {
      return callback && callback();
    };

    Registrations.prototype.buildMonths = function() {

    };

    Registrations.prototype.count = function() {

    };

    Registrations.prototype.getLabels = function() {
      return ['April', 'May', 'June', 'July', 'August', 'September', 'October'];
    };

    Registrations.prototype.getValues = function() {
      return [0, 86, 179, 137, 208, 90, 32];
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

        /**
        * Get the data
        */
        var regs = new Registrations();
        regs.fetch(function () {
          var labels = regs.getLabels();
          var points = regs.getValues();

          new Chartist.Line('#registrations.ct-chart', {
            labels: labels,
            series: [{
              name: 'Registrations',
              data: points
            }]
          }, {
            low: 0,
            showArea: true,
            axisX: {
              showGrid: false
            }
          });
        });

      }

    };
  }]);