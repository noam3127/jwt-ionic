var app = angular.module('starter.controllers', []);

app.controller('LoginCtrl', [
	'$scope', '$rootScope', '$location', '$localStorage', 'Auth', '$state',
	function($scope, $rootScope, $location, $localStorage, Auth, $state) {
    $rootScope.auth = Auth;
    $scope.user = {};
    $scope.validationError = '';

    $scope.login = function() {
      var formData = {
        email: $scope.user.email,
        password: $scope.user.password
      };

      Auth.login(formData)
        .success(function(res) {
          Auth.setToken(res);
          $state.go('tab.chats');
        })
        .error(function(err) {
          $scope.validationError = err;
        });

      $scope.user.password = '';
    };

    $scope.signup = function() {
      var formData = {
        email: $scope.user.email,
        password: $scope.user.password
      };
      Auth.signup(formData)
        .success(function(res) {
          Auth.setToken(res);
          $state.go('tab.chats');
        })
        .error(function(err) {
          $scope.validationError = err;
        });
      $scope.user.password = '';
    };

    // $scope.logout = Auth.logout;
    // $scope.token = $localStorage.token;
    // $scope.tokenClaims = Auth.getTokenClaims();
  }
]);

app.controller('RestrictedCtrl', [
  '$rootScope', '$scope', 'Data',
  function($rootScope, $scope, Data) {
    Data.getRestrictedData(function(res) {
      $scope.data = res.data;
    }, function(err) {
      $rootScope.error = 'Failed to fetch restricted content.';
    });

    Data.getApiData(function(res) {
      $scope.api = res.data;
    }, function(err) {
      $rootScope.error = 'Failed to fetch restricted API content.';
    });
  }
]);

app.controller('DashCtrl', function($scope) {})

app.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
});

app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});

app.controller('AccountCtrl', function(Auth, $scope) {
  $scope.auth = Auth;

  $scope.settings = {
    enableFriends: true
  };
});
