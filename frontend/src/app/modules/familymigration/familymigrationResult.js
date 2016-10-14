/* jshint node: true */

'use strict';

var familymigrationModule = angular.module('hod.familymigration');


// #### ROUTES #### //
familymigrationModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // define a route for the results operation
  $stateProvider.state({
    name: 'familymigrationResults',
    url: '/result',
    title: 'Financial Status : Result',
    parent: 'familymigration',
    views: {
      'content@': {
        templateUrl: 'modules/familymigration/familymigrationResult.html',
        controller: 'FamilymigrationResultCtrl'
      },
    },
  });
}]);


familymigrationModule.controller('FamilymigrationResultCtrl', ['$scope', '$state', '$filter', 'FamilymigrationService', function ($scope, $state, $filter, FamilymigrationService) {

  var res = FamilymigrationService.getLastAPIresponse();
  $scope.familyDetails = FamilymigrationService.getFamilyDetails();

  var displayDate = function (d) {
    return moment(d).format('DD/MM/YYYY');
  };

  if (!res.status) {
    $state.go('familymigration');
    return;
  }

  $scope.familyDetails.displayDate = displayDate($scope.familyDetails.applicationRaisedDate);
  $scope.individual = res.data.individual;

  $scope.haveResult = (res.data && res.data.categoryCheck) ? true: false;
  if ($scope.haveResult) {
    $scope.outcomeBoxIndividualName = res.data.individual.forename + ' ' + res.data.individual.surname;
    $scope.outcomeFromDate = displayDate(res.data.categoryCheck.assessmentStartDate);
    $scope.outcomeToDate = displayDate(res.data.categoryCheck.applicationRaisedDate);

    if (res.data.categoryCheck.passed) {
      $scope.success = true;
    } else {
      $scope.success = false;
      // $scope.heading = res.data.individual.forename + ' ' + res.data.individual.surname + ' doesn\'t meet the Category A requirement';
      switch (res.data.categoryCheck.failureReason) {
        case 'NOT_ENOUGH_RECORDS':
          $scope.reason = 'they haven\'t been with their current employer for 6 months.';
          break;

        default:
          $scope.reason = 'they haven\'t met the required monthly amount.';
      }

    }
  } else {
    if (res.status === 404) {
      $scope.heading = 'There is no record for ' + $scope.familyDetails.nino + ' with HMRC';
      $scope.reason = 'We couldn\'t perform the financial requirement check as no income information exists with HMRC for the National Insurance Number ' + $scope.familyDetails.nino + '.';
    } else {
      $scope.heading = 'You can’t use this service just now. The problem will be fixed as soon as possible';
      $scope.reason = 'Please try again later.';
    }
  };


  $scope.newSearch = function () {
    FamilymigrationService.reset();
    $state.go('familymigration');
  };

  // edit search button
  $scope.editSearch = function () {
    $state.go('familymigration');
  };
}]);