/**
* User model
* Connects to the /users part of the API
* Also stores user locally via cookies
*/
angular
  .module('khe')
  .factory('User', ['$http', '$cookieStore', '$filter', function ($http, $cookies, $filter) {

    var User = function () {

      /**
      * Store the user locally
      * @param me An object representing the logged-in user
      *           {key: String, token: String, role: String}
      */
      this.setMe = function (me) {
        if (Modernizr.localstorage) {
          localStorage.setItem('me', angular.toJson(me));
        } else {
          $cookies.put('me', me);
        }
      };

      /**
      * Retrieve the logged in user from local storage
      * @return {key: String, token: String, role: String}
      */
      this.getMe = function () {
        if (Modernizr.localstorage) {
          return angular.fromJson(localStorage.getItem('me'));
        } else {
          return $cookies.get('me');
        }
      };

      /**
      * Delete the stored user
      */
      this.removeMe = function () {
        var req = this.authorize({
          method: 'DELETE',
          url: config.api + '/users/token'
        });
        $http(req);
        if (Modernizr.localstorage) {
          localStorage.removeItem('me');
        } else {
          $cookies.remove('me');
        }
      };

      /**
      * Adds authorization headers to a request object
      * @param req A request object
      * @return The request object with auth headers attached
      */
      this.authorize = function (req) {
        var me = this.getMe();
        var encoded = $filter('base64Encode')(me.key + ':' + me.token);
        var ext = {
          headers: {
            'Authorization': 'Basic ' + encoded
          }
        };
        angular.extend(req, ext);
        return req;
      }

      /**
      * Register a user
      * @param user {email: String, password: String}
      * @return An $http promise
      */
      this.register = function (user) {
        var req = {
          method: 'POST',
          url: config.api + '/users',
          data: {
            email: user.email,
            password: user.password
          }
        };
        return $http(req);
      };

      /**
      * Quickly create a new user
      * @param user {name: String, email: String, phone: String}
      * @return An $http promise
      */
      this.quick = function (user) {
        var req = this.authorize({
          method: 'POST',
          url: config.api + '/users/quick',
          data: {
            name: user.name,
            email: user.email,
            phone: user.phone
          }
        });
        return $http(req);
      };

      /**
      * Login a user
      * @param user {email: String, password: String}
      * @return An $http promise
      */
      this.login = function (user) {
        var req = {
          method: 'POST',
          url: config.api + '/users/token',
          data: {
            email: user.email,
            password: user.password
          }
        };
        return $http(req);
      };

      /**
      * Return a list of all users (staff and admins only)
      * @return An $http promise
      */
      this.list = function () {
        var req = this.authorize({
          method: 'GET',
          url: config.api + '/users'
        });
        return $http(req);
      };

      /**
      * Get a user by ID
      * @param id The user's id
      */
      this.get = function (id) {
        var req = this.authorize({
          method: 'GET',
          url: config.api + '/users/' + id
        });
        return $http(req);
      };

      /**
      * Update the logged in user
      * @param user {email: String, password: String}
      */
      this.update = function (user) {
        var req = this.authorize({
          method: 'PATCH',
          url: config.api + '/users',
          data: user
        });
        return $http(req);
      };

      /**
      * Partially update a user
      * @param id The user's id
      * @param update The object to use for updating
      */
      this.updateById = function (id, update) {
        var req = this.authorize({
          method: 'PATCH',
          url: config.api + '/users/' + id,
          data: update
        });
        return $http(req);
      };


      /**
      * Completely delete a user
      * @param userId The ID of the user to delete
      * @return An $http promise
      */
      this.delete = function (userId) {
        var req = this.authorize({
          method: 'DELETE',
          url: config.api + '/users/' + userId
        });
        return $http(req);
      };

    };

    return User;

  }]);