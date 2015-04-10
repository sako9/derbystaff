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

    /**
    * Fetch a list of every registered user
    */
    Registrations.prototype.fetch = function (callback) {
      var self = this;
      Models.application.list().
      success(function (data) {
        self.users = data.users.filter(function (user) {
          return user.application;
        }).map(function (user) {
          return {_id: user._id, created: user.application.created};
        });
        self.buildMonths();
        self.count();
        return callback && callback();
      }).
      error(function (data) {
        self.buildMonths();
        self.count();
        return callback && callback();
      });
    };

    /**
    * Get the times and dates for May through October. Note: we are using 2015
    * for the year, but when we select registrations, we effectively ignore the
    * year by setting every application's year to 2015.
    */
    Registrations.prototype.buildMonths = function () {
      this.months = [
        {
          name: 'January',
          start: new Date(2015, 1, 1),
          end: new Date(2015, 1, 31),
          count: 0
        },
        {
          name: 'February',
          start: new Date(2015, 2, 1),
          end: new Date(2015, 2, 28),
          count: 0
        },
        {
          name: 'March',
          start: new Date(2015, 3, 1),
          end: new Date(2015, 3, 31),
          count: 0
        },
        {
          name: 'April',
          start: new Date(2015, 4, 1),
          end: new Date(2015, 4, 30),
          count: 0
        },
        {
          name: 'May',
          start: new Date(2015, 5, 1),
          end: new Date(2015, 5, 31),
          count: 0
        },
        {
          name: 'June',
          start: new Date(2015, 6, 1),
          end: new Date(2015, 6, 30),
          count: 0
        },
        {
          name: 'July',
          start: new Date(2015, 7, 1),
          end: new Date(2015, 7, 31),
          count: 0
        },
        {
          name: 'August',
          start: new Date(2015, 8, 1),
          end: new Date(2015, 8, 31),
          count: 0
        },
        {
          name: 'September',
          start: new Date(2015, 9, 1),
          end: new Date(2015, 9, 30),
          count: 0
        },
        {
          name: 'October',
          start: new Date(2015, 10, 1),
          end: new Date(2015, 10, 31),
          count: 0
        }
      ];
    };

    /**
    * Count the number of registrations in each month
    */
    Registrations.prototype.count = function () {
      var self = this;
      for (var i = 0; i < this.months.length; ++i) {
        this.months[i].count = this.users.filter(function (user) {
          var created = new Date(user.created).setFullYear(2015);
          return (created > self.months[i].start && created <= self.months[i].end);
        }).length;
      }
    };

    Registrations.prototype.getLabels = function () {
      return this.months.map(function (month) {
        return month.name;
      });
    };

    Registrations.prototype.getValues = function () {
      return this.months.map(function (month) {
        return month.count;
      });
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
            lineSmooth: 0,
            axisX: {
              showGrid: false
            }
          });
        });

        addTooltips();

      }

    };
  }]);