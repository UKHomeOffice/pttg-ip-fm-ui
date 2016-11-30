/* jshint node: true */

'use strict';

var familymigrationModule = angular.module('hod.familymigration', ['ui.router']);


familymigrationModule.factory('FamilymigrationService', ['IOService', '$state', 'AvailabilityService', '$rootScope',
  function (IOService, $state, AvailabilityService, $rootScope) {
  var lastAPIresponse = {};
  var familyDetails = {
    nino: '',
    applicationRaisedDate: '',
    dependants: ''
  };

  this.submit = function (nino, dependants, applicationRaisedDate) {
    return new Promise (function (resolve, reject) {
      IOService.get('individual/' + nino + '/financialstatus', {dependants: dependants, applicationRaisedDate: applicationRaisedDate}, {timeout: 5000 }).then(function (res) {
        lastAPIresponse = res;
        return resolve();

      }, function (res) {
        // An error occurred
        lastAPIresponse = res;

        // test the availability again
        var availableconf = AvailabilityService.getConfig();
        IOService.get(availableconf.url).then(function (res) {
          $state.go('familymigrationResults');
          return reject({response: lastAPIresponse, availability: true});
        }, function (err) {
          // stay where we are, but tell the availability test to re-fire

          return reject({response: lastAPIresponse, availability: false});
        });
      });
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

  var appRaisedDateMsg = {
    summary: 'The application raised date is invalid',
    msg:     'Enter a valid application raised date'
  };

  var dependantsMsg = {
    summary: 'The number of dependants is invalid',
    msg:     'Enter a valid number of dependants'
  }

  $scope.conf = {
    nino: {
      validate: function (val) {

        if (val) {
          var v = val.replace(/[^a-zA-Z0-9]/g, '');
          if (/^[a-zA-Z]{2}[0-9]{6}[a-dA-D]{1}$/.test(v)) {
            return true;
          }
        }
        return { summary: 'The National Insurance number is invalid', msg: 'Enter a valid National Insurance number'};
      }
    },
    dependants: {
      required: false,
      max: 99,
      classes: { 'form-control-1-8': true },
      validate: function (v, s) {
        var n = Number(v);
        var ok = true;
        if (n < 0 || n > 99) {
          ok = false;
        }

        if (v.length === 0) {
          ok = false;
        }

        if (Math.ceil(n) !== Math.floor(n)) {
          // not a whole number
          ok = false;
        }

        if (ok) {
          return true;
        }

        return {
          summary: 'The number of dependants is invalid',
          msg: 'Enter a valid number of dependants'
        };
      }
    },
    applicationRaisedDate: {
      max: moment().format('YYYY-MM-DD'),
      errors: {
        required: appRaisedDateMsg,
        invalid: appRaisedDateMsg,
        max: appRaisedDateMsg
      }
    }
  };

  $scope.submitButton = {
    text: 'Check eligibility',
    disabled: false
  };

  $scope.detailsSubmit = function (isValid) {
    $scope.familyDetails.nino = ($scope.familyDetails.nino.replace(/[^a-zA-Z0-9]/g, '')).toUpperCase();
    if (isValid) {
      $scope.submitButton.text = 'Sending';
      $scope.submitButton.disabled = true;

      FamilymigrationService.submit($scope.familyDetails.nino, $scope.familyDetails.dependants, $scope.familyDetails.applicationRaisedDate).then(function () {
        // eveything was OK go to the results page
        $state.go('familymigrationResults');
      }, function (err) {
        if (err.availability) {
          // something went wrong but availability check says OK so just show generic error page
          $state.go('familymigrationResults');
        } else {
          // something is wrong, availability reports down, so stay here and poll until issue resolved
          $rootScope.$broadcast('retestAvailability');
          $scope.submitButton.text = 'Check eligibility';
          $scope.submitButton.disabled = false;
        }
      });
    }
  };
}]);
