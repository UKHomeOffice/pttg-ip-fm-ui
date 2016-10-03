/* jshint node: true */

'use strict';

var familymigrationModule = angular.module('hod.familymigration', ['ui.router']);


familymigrationModule.factory('FamilymigrationService', ['IOService', '$state', function (IOService, $state) {
  var lastAPIresponse = {};
  var familyDetails = {
    nino: '',
    applicationRaisedDate: '',
    dependants: ''
  };

  this.submit = function (nino, dependants, applicationRaisedDate) {
    IOService.get('incomeproving/v1/individual/' + nino + '/financialstatus', {dependants: dependants, applicationRaisedDate: applicationRaisedDate}, {timeout: 5000 }).then(function (res) {
      lastAPIresponse = res;
      $state.go('familymigrationResults');
    }, function (res) {
      lastAPIresponse = res;
      $state.go('familymigrationResults');
    });
  };

  this.getLastAPIresponse = function () {
    return lastAPIresponse;
  };

  this.getFamilyDetails = function () {
    return familyDetails;
  };

  this.reset = function () {
    familyDetails.nino = '';
    familyDetails.applicationRaisedDate = '';
    familyDetails.dependants = '';
  };

  return this;
}]);


// #### ROUTES #### //
familymigrationModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // define a route for the details of the form
  $stateProvider.state({
    name: 'familymigration',
    url: '/familymigration',
    title: 'Family migration: Query',
    views: {
      'content@': {
        templateUrl: 'modules/familymigration/familymigration.html',
        controller: 'FamilymigrationDetailsCtrl'
      },
    },
  });
}]);

// fill in the details of the form
familymigrationModule.controller(
'FamilymigrationDetailsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'FamilymigrationService', 'IOService', '$window', '$timeout',
function ($rootScope, $scope, $state, $stateParams, FamilymigrationService, IOService, $window) {
  $scope.familyDetails = FamilymigrationService.getFamilyDetails();

  $scope.conf = {
    nino: {
      validate: function (val) {

        if (val) {
          var v = val.replace(/[^a-zA-Z0-9]/g, '');
          if (/^[a-zA-Z]{2}[0-9]{6}[a-dA-D]{1}$/.test(v)) {
            return true;
          }
        }
        return { summary: 'The National Insurance Number is invalid', msg: 'Enter a valid National Insurance Number'};
      }
    },
    dependants: {
      required: false
    },
    applicationRaisedDate: {
      max: moment().format('YYYY-MM-DD'),
      errors: {
        required: {
          msg: 'Enter a valid application raised date'
        },
        invalid: {
          msg: 'Enter a valid application raised date'
        },
        max: {
          msg: 'Enter a valid application raised date'
        }
      }
    }
  };

  $scope.detailsSubmit = function (isValid) {
    $scope.familyDetails.nino = ($scope.familyDetails.nino.replace(/[^a-zA-Z0-9]/g, '')).toUpperCase();
    if (isValid) {
      FamilymigrationService.submit($scope.familyDetails.nino, $scope.familyDetails.dependants, $scope.familyDetails.applicationRaisedDate);
    }
  };
}]);
