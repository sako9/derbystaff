angular
  .module('khe')
  .directive('staffheader', ['$compile', 'Ticket', 'User', function ($compile, Ticket, User) {

    var Models = {
      ticket: new Ticket()
    };

    return {

      restrict: 'E',
      templateUrl: '/views/directives/staffheader.html',
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope);
        $(document).foundation();

        var view = {};

        Models.ticket.list().
        success(function (data) {
          scope.tickets = data.tickets.filter(function (ticket) {
            return ticket.open && !ticket.inProgress;
          }).length;
        }).
        error(function (data) {});

        scope.logout = new User().logout;

      }

    };
  }]);