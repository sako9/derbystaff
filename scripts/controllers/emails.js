angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router
      .when('/emails', {
        templateUrl: '/views/emails.html',
        controller: 'StaffEmailCtrl'
      })
      .when('/emails/new', {
        templateUrl: '/views/emails-new.html',
        controller: 'StaffEmailCtrl'
      });
  }])
  .controller('StaffEmailCtrl', ['User', 'Email', 'Application', function (User, Email, Application) {

    var self = this;
    var user = new User();
    var email = new Email();
    var application = new Application();

    self.me = user.getMe();
    self.users = [];

    self.emails = [];
    self.new = {};
    self.new.group = 'all';

    // Initialize the list of emails
    function get() {
      // Get list of old emails
      email.list().
      success(function (data) {
        if (data.emails.length == 0) {
          self.errors = ['No emails have been sent yet'];
        }
        self.emails = data.emails;
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });

      // Get list of users
      application.list().
      success(function (data) {
        self.users = data.users;
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error occurred'];
      });
    }
    get();

    // Send an email
    this.send = function () {
      var payload = {
        subject: self.new.subject,
        body: self.new.body
      };

      if (self.new.group != 'custom') {
        // set up our where clause
        switch (self.new.group) {
          case 'all':
            angular.extend(payload, {
              recipients: {
                nickname: 'All',
                emails: self.users.map(function (user) {
                  return user.email;
                })
              }
            });
            break;
          case 'staff':
            angular.extend(payload, {
              recipients: {
                nickname: 'Staff',
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
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
                emails: self.users.filter(function (user) {
                  return user.application && user.application.checked;
                }).map(function (user) {
                  return user.email;
                })
              }
            });
            break;
        }

      } else {
        // We have a list of individual emails
        angular.extend(payload, {
          recipients: {
            emails: self.new.emails.split(', ')
          }
        });
      }

      // send the email
      email.send(payload).
      success(function (data) {
        self.new = {};
        self.new.group = 'all';
        self.successes = ['Your message has been sent'];
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error has occurred'];
      });

    };

  }]);
