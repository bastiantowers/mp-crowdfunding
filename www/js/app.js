// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('mpCrowdApp', ['ionic', 'mpCrowdApp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })
  .state('app.createCampaign', {
      url: '/createCampaign',
      views: {
        'menuContent': {
          templateUrl: 'templates/create_campaign.html',
          controller: 'newCampaignCtrl'
        }
      }
    })
  .state('app.listCampaigns', {
      url: '/listCampaigns',
      views: {
        'menuContent': {
          templateUrl: 'templates/list_campaigns.html',
          controller: 'listCampaignsCtrl'
        }
      }
    })
  .state('app.devOptions', {
      url: '/devOptions',
      views: {
        'menuContent': {
          templateUrl: 'templates/devOptions.html',
          controller: 'devOptionsCtrl'
        }
      }
    })
  .state('app.shareCampaign', {
      url: '/shareCampaign',
      views: {
        'menuContent': {
          templateUrl: 'templates/shareCampaign.html',
          controller: 'shareCampaignCtrl'
        }
      }
    })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})
;
