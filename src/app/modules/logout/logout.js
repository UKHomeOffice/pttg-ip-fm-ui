/* global angular moment */

var logoutModule = angular.module('hod.logout', [])

// #### ROUTES #### //
logoutModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  // define a route for the results operation
  $stateProvider.state({
    name: 'logout',
    url: '/logout',
    title: 'Financial Status : Sign out',
    // parent: 'familymigration',
    views: {
      'content@': {
        templateUrl: 'modules/logout/logout.html',
        controller: 'LogoutCtrl'
      }
    }
  })
}])

logoutModule.controller('LogoutCtrl',['$scope', '$http', '$window', function ($scope, $http, $window) {
  $http.get('/logout').then(function (result) {
    var logoutUrl = (result && result.data) ? result.data.logout : ''
    return $http.get(logoutUrl)
  }).then(function (result) {
    console.log('RESULT', result)
  }).catch(function (err) {
    console.log('ERROR', err)
  }).then(function () {
    setTimeout(function () {
      // $window.location = '/';
      console.log('timeout')
    }, 2000)
  })
}])
