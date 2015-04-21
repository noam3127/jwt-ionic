
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('urls', {
  BASE: 'http://127.0.0.1:3003',
  BASE_AUTH: 'http://127.0.0.1:3003/auth',
  BASE_API: 'http://127.0.0.1:3003/api'
})

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
  var authenticate = ['$q', '$state', '$timeout', 'Auth', function($q, $state, $timeout, Auth) {
    if (Auth.authenticate()) {
      console.log('authed');
      return $q.when();
    } else {
      $timeout(function() {
        $state.go('login')
      });
      return $q.reject()
    }
  }];

  $stateProvider
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'LoginCtrl',
    resolve: {
      userStatus: ['$state', '$q', 'Auth', '$timeout', function($state, $q, Auth, $timeout) {
        if (!Auth.authenticate()) {
          return $q.when();
        } else {
          $timeout(function() {
            $state.go('tab.account');
          });
          return $q.reject();
        }
      }]
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    resolve: {
      userStatus: ['$state', '$q', 'Auth', '$timeout', function($state, $q, Auth, $timeout) {
        if (!Auth.authenticate()) {
          return $q.when();
        } else {
          $timeout(function() {
            $state.go('tab.dash');
          });
          return $q.reject();
        }
      }]
    }
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
    //resolve: {authenticate: authenticate}
  })

  // Each tab has its own nav history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    },
    resolve: {authenticate: authenticate}
  })

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
    //resolve: {authenticate: authenticate}
  })
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    },
    resolve: {authenticate: authenticate}
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
    resolve: {authenticate: authenticate}
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab.account');

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
    return {
      request: function(config) {
        config.Headers = config.Headers || {};
        if ($localStorage.token) {
          config.Headers.Authorization = 'Bearer' + $localStorage.token;
        }
        return config;
      },
      responseError: function(response) {
        console.log('err',response);
        if (response.code === 401 || response.code === 403) {
          $location.path('/login');
        }
        return $q.reject(response);
      }
    };
  }]);
}])

.run(['$rootScope', '$state', 'Auth',
  function($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      if (!Auth.authenticate() && !toState.name.match(/^login/) && !toState.name.match(/^signup/)) {
        return $state.go('login');
      }
    });
  }
]);

