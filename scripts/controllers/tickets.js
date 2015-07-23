angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/tickets', {
      templateUrl: '/views/tickets.html',
      controller: 'TicketCtrl as ctrl'
    });
  }])
  .controller('TicketCtrl', ['User', 'Ticket', function (User, Ticket) {

    /**
    * Template interface
    */
    var view = this;

    var Models = {
      user: new User(),
      ticket: new Ticket()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

    /**
    * Arrays of different types of tickets
    */
    view.all = [];
    view.open = [];
    view.progress = [];
    view.closed = [];

    /**
    * An array of the currently displayed tickets
    */
    view.tickets = [];

    /**
    * Fetch a list of all tickets
    */
    function get() {
      Models.ticket.list().
      success(function (data) {
        view.errors = null;
        view.all = data.tickets;
        reload();
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error occurred'];
      });
    }

    /**
    * Set up socket listeners
    */
    function listen() {
      // New ticket created
      Models.ticket.socket().on('create', function (ticket) {
        view.tickets.push(ticket);
        reload();
      });

      // Ticket updated
      Models.ticket.socket().on('update', function (ticket) {
        view.all = view.all.map(function (t) {
          if (t._id == ticket._id) {
            t = ticket;
          }
          return t;
        });
        reload();
      });

      // Ticket deleted
      Models.ticket.socket().on('delete', function (ticket) {
        view.all = view.all.filter(function (t) {
          return t._id != ticket._id;
        });
        reload();
      });
    }

    /**
    * Make the status of a ticket human-readable
    * @param tickets An array of tickets
    */
    function prettifyStatus(tickets) {
      for (var i = 0; i < tickets.length; i++) {
        var ticket = tickets[i];
        if (ticket.open && !ticket.inProgress) {
          ticket.prettyStatus = 'Open';
        } else if (ticket.open && ticket.inProgress) {
          ticket.prettyStatus = 'In Progress';
        } else {
          ticket.prettyStatus = 'Closed';
        }
      }
    }

    /**
    * Resets the controller
    * Call this function whenever the array of all tickets changes
    */
    function reload() {
      prettifyStatus(view.all);
      view.filter.init();
      view.filter.apply(view.filter.current);
    }

    /**
    * Display different types of tickets
    */
    view.filter = {

      /**
      * The currently applied filter
      */
      current: 'open',

      /**
      * Create arrays of each different type of ticket
      */
      init: function () {
        view.open = view.all.filter(function (ticket) {
          return ticket.prettyStatus == 'Open';
        });

        view.progress = view.all.filter(function (ticket) {
          return ticket.prettyStatus == 'In Progress';
        });

        view.closed = view.all.filter(function (ticket) {
          return ticket.prettyStatus == 'Closed';
        });
      },

      /**
      * A way to view a given set of tickets
      */
      apply: function (filter) {
        this.current = filter;
        switch (filter) {
          case 'all':
            view.tickets = view.all;
            break;
          case 'open':
            view.tickets = view.open;
            break;
          case 'in progress':
            view.tickets = view.progress;
            break;
          case 'closed':
            view.tickets = view.closed;
            break;
        }
      }

    };

    /**
    * Deal with the expansion/contraction of tickets
    */
    view.visibility = {

      /**
      * Toggle the expansion of a ticket
      */
      toggle: function (ticket) {
        if (this.expandedId == ticket._id) {
          this.expandedId = '';
        } else {
          this.expandedId = ticket._id;
        }
      },

      /**
      * Check to see whether a ticket is expanded
      */
      check: function (ticket) {
        return this.expandedId == ticket._id;
      }

    };

    /**
    * Modify the status of a ticket
    */
    view.status = {

      /**
      * Go into editing mode
      */
      edit: function (ticket) {
        ticket.editingStatus = true;
        ticket.oldOpen = ticket.open;
        ticket.oldInProgress = ticket.inProgress;
      },

      /**
      * Cancel editing mode
      */
      cancel: function (ticket) {
        ticket.editingStatus = false;
        ticket.open = ticket.oldOpen;
        ticket.inProgress = ticket.oldInProgress;
        self.prettifyStatus([ticket]);
      },

      /**
      * Save changes made
      */
      save: function (ticket) {
        var open, inProgress;
        if (ticket.prettyStatus == 'Open') {
          open = true;
          inProgress = false;
        } else if (ticket.prettyStatus == 'In Progress') {
          open = true;
          inProgress = true;
        } else {
          open = false;
          inProgress = false;
        }
        Models.ticket.update(ticket._id, {
          open: open,
          inProgress: inProgress,
          worker: view.me.email
        }).
        success(function (data) {
          view.errors = null;
          ticket.editingStatus = false;
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error occurred'];
        });
      }

    };

    /**
    * Initialize controller
    */
    get();
    listen();

  }]);
