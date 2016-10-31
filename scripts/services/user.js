/**
* User model
* Connects to the /users part of the API
* Also stores user locally via cookies
*/
angular
  .module('khe')
  .factory('User', ['$http','$window', '$cookieStore', '$filter', 'socketFactory', '$location', function ($http, $window, $cookieStore ,$filter, socket, $location) {
      
      
      function base64_decode( str )   {  
            console.log(str);
        if (window.atob) // Internet Explorer 10 and above  
            return decodeURIComponent(escape(window.atob( str )));  
        else  
        {  
            // Cross-Browser Method (compressed)  
          
            // Create Base64 Object  
            var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}  
            // Encode the String  
            return decodeURIComponent(escape(Base64.decode( str )));  
        }  
    }  

    var User = function () {
        
        

      var self = this;

      /**
      * A socket connected to /users
      */
      var connection;
      this.socket = function () {
        if (!connection) {
          var me = this.getMe();
          var encoded = $filter('base64Encode')(me.key + ':' + me.token);
          var s = io.connect(config.api + '/users', {
            query: 'authorization=' + encoded
          });
          connection = socket({ioSocket: s});
        }
        return connection;
      };

      /**
      * Store the user locally
      * @param me An object representing the logged-in user
      *           {key: String, token: String, role: String, refresh: String, expires: Date}
      */
      this.setMe = function (token) {
        $window.localStorage['derby-token'] = token;
      };

      /**
      * Retrieve the logged in user from local storage
      * @return {key: String, token: String, role: String, refresh: String, expires: Date}
      */
      this.getToken = function () {
          return $window.localStorage['derby-token'];
      };
        
    this.getMe = function () {
        var token = self.getToken();
        if (!token) {
          $location.path('/');
          return;
        }
        console.log(token);
        payload = token.split('.')[1];
        payload = base64_decode(payload)
        payload = JSON.parse(payload);
        return payload;
      };

      /**
      * Delete the stored user
      */
      this.removeMe = function () {
        $window.localStorage.removeItem('derby-token');
      };

      /**
      * Log a user out
      */
      this.logout = function () {
        self.removeMe();
        $location.path('/login');
      };

      /**
      * Check if logged in.
      * If the user's token exists and hasn't expired, the callback is called
      * immediately.
      * @param callback (Optional) called when finished
      */
      function refreshToken(callback) {
        var token = self.getToken();
        if (!token) {
          $location.path('/');
          return;
        }
        payload = token.split('.')[1];
        payload = base64_decode(payload)
        payload = JSON.parse(payload);
        console.log(payload);
        if(payload.exp < Date.now() / 1000){
            console.log(payload);
            self.logout();
        }else{
            return callback && callback();
        }
      }

      /**
      * Adds authorization headers to a request object
      * @param req A request object to authorize
      * @return The request object with auth headers attached
      */
      this.authorize = function (req) {
        refreshToken();
        var token = this.getToken();
        var ext = {
          headers: {
            'Authorization': 'Bearer '+ token
          }
        };
        angular.extend(req, ext);
        return req;
      };

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
          url: config.api + '/login',
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