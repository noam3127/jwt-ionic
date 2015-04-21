angular.module('starter.services', [])

.factory('Auth', ['$rootScope', '$http', '$localStorage', '$state', 'urls',
  function ($rootScope, $http, $localStorage, $state, urls) {
    function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += '==';
          break;
        case 3:
          output += '=';
          break;
        default:
          throw 'Illegal base64url string!';
       }
      return window.atob(output);
    }
    var setToken = function(data) {
      $localStorage.token = data.token;
      $localStorage.user = data.user;
      $rootScope.isLoggedIn = true;
    };

    var tokenClaims = (function() {
      var user = {};
      var encoded;
      if (angular.isDefined($localStorage.token)) {
        encoded = $localStorage.token.split('.')[1];
        user = JSON.parse(urlBase64Decode(encoded));
      }
      return user;
    }());

    return {
      signup: function(data) {
        return $http.post(urls.BASE_AUTH + '/signup', data);
      },

      login: function(data, success, err)  {
        return $http.post(urls.BASE_AUTH + '/login', data);
      },
      setToken: setToken,
      logout: function() {
        tokenClaims: {};
        delete $localStorage.token;
        $rootScope.auth.isLoggedIn = false;
        return $state.go('login');
      },

      getTokenClaims: function() {
        return tokenClaims;
      },

      authenticate: function() {
        if ($localStorage.user && $localStorage.token) {
         // console.log('LOGGED IN', tokenClaims, moment());
          return true;
        } else {
          return false;
        }
      }
    };
  }
])
.run(['Auth', '$rootScope', function(Auth, $rootScope){
  $rootScope.auth = Auth;
}])
.factory('Data',['$http', 'urls', function($http, urls) {
  return {
    getPrivateData: function(success, err) {
      $http.get(urls.BASE_API).success(success).error(err);
    }
  }
}])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
