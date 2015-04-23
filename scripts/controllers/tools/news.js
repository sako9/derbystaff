angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/tools/news', {
      templateUrl: '/views/tools/news.html',
      controller: 'ToolsNewsCtrl as news'
    });
  }])
  .controller('ToolsNewsCtrl', ['User', 'News', function (User, News) {

    /**
    * Template interface
    */
    var view = this;

    var Models = {
      user: new User(),
      news: new News()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

    /**
    * All the email addresses on the list
    */
    view.all = [];

    /**
    * Get a list of everyone signed up
    */
    function get() {
      Models.news.list().
      success(function (data) {
        view.errors = null;
        view.all = data.news;
      }).
      error(function (data) {
        view.errors = data.errors;
      });
    }

    /**
    * Use sockets to keep UI up to date
    */
    function listen() {
      Models.news.socket().on('create', function (person) {
        view.all.push(person);
      });

      Models.news.socket().on('delete', function (person) {
        view.all = view.all.filter(function (p) {
          return p._id != person._id;
        });
      });
    }

    get();
    listen();

  }]);
