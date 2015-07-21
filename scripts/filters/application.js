angular
  .module('khe')
  .filter('application', function () {

    var self = this;

    self.icon = function (status) {
      if (status.toLowerCase() == 'approved') {
        return 'fa fa-check green';
      }
      if (status.toLowerCase() == 'waitlisted') {
        return 'fa fa-list orange';
      }
      if (status.toLowerCase() == 'denied') {
        return 'fa fa-times red';
      }
      if (status.toLowerCase() == 'pending') {
        return 'fa fa-clock-o';
      }
    };

    self.shirt = function (abbr) {
      switch (abbr) {
        case 'S':
          return 'Small';
        case 'M':
          return 'Medium';
        case 'L':
          return 'Large';
        case 'XL':
          return 'X-Large';
      }
    };

    self.first = function (first) {
      return (first) ? 'Yes' : 'No';
    };

    self.dietary = function (restrictions) {
      if (restrictions.length) {
        var diet = restrictions[0];
        for (var i = 1; i < restrictions.length; i++) {
          diet = diet + ', ' + restrictions[i];
        }
        return diet;
      }
      return 'None';
    };

    self.travel = function (travel) {
      return (travel) ? 'Yes' : 'No';
    };

    self.checked = function (checked) {
      return (checked) ? 'Yes' : 'No';
    };

    self.going = function (going) {
      if (going === undefined) {
        return 'None';
      } else if (going === false) {
        return 'Not Going';
      } else {
        return 'Going';
      }
    };

    self.gender = function (gender) {
      if (!gender) {
        return '-';
      }
      return gender;
    };

    self.resumeLink = function (filename) {
      if (!filename) return;
      return config.api + '/users/application/resume/' + filename;
    };

    return function (input, fn) {
      return self[fn](input);
    };

  });