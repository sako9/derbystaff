angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router
      .when('/emails', {
        templateUrl: '/views/emails.html',
        controller: 'EmailCtrl as ctrl'
      })
      .when('/emails/new', {
        templateUrl: '/views/emails-new.html',
        controller: 'EmailCtrl as ctrl'
      });
  }])
  .controller('EmailCtrl', ['User', 'Email', 'Application', 'News', function (User, Email, Application, News) {

    /**
    * The interface for any templates using this controller.
    */
    var view = this;

    var Models = {
      user: new User(),
      email: new Email(),
      application: new Application(),
      news: new News()
    };

    /**
    * The currently logged in user
    */
    view.me = Models.user.getMe();

    /**
    * An array of users that emails can be sent to
    */
    var users = [];

    /**
    * An array of people on the newsletter
    */
    var news = [];

    /**
    * An array of sent emails
    */
    view.emails = [];

    /**
    * Initialize the list of emails and users
    */
    function get() {
      // Get list of old emails
      Models.email.list().
      success(function (data) {
        view.errors = null;
        view.emails = data.emails;
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error occurred'];
      });

      // Get list of users
      Models.application.list().
      success(function (data) {
        view.errors = null;
        view.users = data.users;
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error occurred'];
      });

      // Get a list of people on the newsletter
      Models.news.list().
      success(function (data) {
        view.errors = null;
        news = data.news;
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error occurred'];
      });
    }

    /**
    * Set up socket listeners
    */
    function listen() {
      // New email created
      Models.email.socket().on('create', function (email) {
        view.emails.push(email);
      });

      // Email deleted
      Models.email.socket().on('delete', function (email) {
        view.emails = view.emails.filter(function (e) {
          return e._id != email._id;
        });
      });
    }

    /**
    * Compose and send a new email
    */
    view.compose = {

      /**
      * An object holding the information about the new email
      */
      email: {},
      group: 'all',

      /**
      * Send a new email
      */
      send: function () {
        var self = this;

        var payload = {
          subject: self.email.subject,
          body: self.email.body
        };

        if (self.group == 'custom') {
          // We have a list of individual emails
          angular.extend(payload, {
            recipients: {
              emails: self.email.emails.split(', ')
            }
          });
        } else if (self.group == 'news') {
          angular.extend(payload, {
            recipients: {
              emails: news.map(function (obj) {
                return obj.email;
              })
            }
          });
        } else {
          // set up our where clause
          switch (self.group) {
            case 'all':
              angular.extend(payload, {
                recipients: {
                  nickname: 'All',
                  emails: view.users.map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'staff':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Staff',
                  emails: view.users.filter(function (user) {
                    return user.role == 'staff' || user.role == 'admin';
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'applied':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Applied',
                  emails: view.users.filter(function (user) {
                    return user.application;
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'going':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Going',
                  emails: view.users.filter(function (user) {
                    return user.application && user.application.going;
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'approved':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Approved',
                  emails: view.users.filter(function (user) {
                    return user.application && user.application.status == 'approved';
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'waitlisted':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Waitlisted',
                  emails: view.users.filter(function (user) {
                    return user.application && user.application.status == 'waitlisted';
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'pending':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Pending',
                  emails: view.users.filter(function (user) {
                    return user.application && user.application.status == 'pending';
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'denied':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Denied',
                  emails: view.users.filter(function (user) {
                    return user.application && user.application.status == 'denied';
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'travel':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Travel',
                  emails: view.users.filter(function (user) {
                    return user.application && user.application.travel;
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
            case 'checked':
              angular.extend(payload, {
                recipients: {
                  nickname: 'Checked In',
                  emails: view.users.filter(function (user) {
                    return user.application && user.application.checked;
                  }).map(function (user) {
                    return user.email;
                  })
                }
              });
              break;
          }

        }

        // send the email
        Models.email.send(payload).
        success(function (data) {
          view.errors = null;
          self.email = {};
          self.group = 'all';
          view.successes = ['Your message has been sent'];
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error has occurred'];
        });
      }

    };

    /**
    * Initilize this controller
    */
    get();
    listen();

  }]);
