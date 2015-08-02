angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router
      .when('/', {
        templateUrl: '/views/home.html',
        controller: 'HomeCtrl as home'
      });
  }])
  .controller('HomeCtrl', ['User', 'Stats', '$location', function (User, Stats, $location) {

    var view = this;

    var Models = {
      user: new User(),
      stats: new Stats()
    };

    view.user = Models.user.getMe();

    if (!view.user || view.user.role == 'attendee') {
      $location.path('/login');
    }

    view.logout = function () {
      user.removeMe();
      $location.path('/login');
    };

    /**
    * Registration graph
    */
    view.registrations = {
      graph: null,
      get: function (query) {
        var self = this;
        self.graph = null;
        Models.stats.registrations(query).
        success(function (data) {
          self.graph = data;
        });
      }
    };

    /**
    * Shirts graph
    */
    view.shirts = {
      graph: null,
      get: function (query) {
        var self = this;
        self.graph = null;
        Models.stats.shirts(query).
        success(function (data) {
          self.graph = data;
        });
      }
    };

    /**
    * Dietary restrictions graph
    */
    view.dietary = {
      graph: null,
      get: function (query) {
        var self = this;
        self.graph = null;
        Models.stats.dietary(query).
        success(function (data) {
          self.graph = data;
        });
      }
    };

    /**
    * Gender graph
    */
    view.gender = {
      graph: null,
      get: function (query) {
        var self = this;
        self.graph = null;
        Models.stats.gender(query).
        success(function (data) {
          self.graph = data;
        });
      }
    };

    /**
    * Schools graph
    */
    view.schools = {
      graph: null,
      get: function (query) {
        var self = this;
        self.graph = null;
        Models.stats.schools(query).
        success(function (data) {
          self.graph = data;
        });
      }
    };

    // Call filters
    view.filterCharts = function (query) {
      view.registrations.get(query);
      view.shirts.get(query);
      view.dietary.get(query);
      view.gender.get(query);
      view.schools.get(query);
    };

    // Initialize graphs
    if (view.user) {
      view.filterCharts();
    }

  }]);
