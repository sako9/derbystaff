angular
  .module('khe')
  .filter('application', function () {

    var self = this;

    self.shirt = function (abbr) {
      switch (abbr) {
        case 'S':
          return 'Small';
          break;
        case 'M':
          return 'Medium';
          break;
        case 'L':
          return 'Large';
          break;
        case 'XL':
          return 'X-Large';
          break;
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

    return function (input, fn) {
      return self[fn](input);
    };

  });