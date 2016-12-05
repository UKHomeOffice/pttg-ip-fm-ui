/* global angular Clipboard moment _ */

/* jshint node: true */

'use strict'

var familymigrationModule = angular.module('hod.familymigration')

// #### ROUTES #### //
familymigrationModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
      }
    }
  })
}])

familymigrationModule.constant('RESULT_TEXT', {
  copybtn: 'Copy to clipboard',
  copiedbtn: 'Copied',
  copysummary: 'The check financial status service confirmed that {{name}} {{passed}} the requirements as the daily closing balance was {{above}} the total funds required.'
})

familymigrationModule.controller('FamilymigrationResultCtrl', ['$scope', '$state', '$filter', 'FamilymigrationService', 'RESULT_TEXT', '$timeout', function ($scope, $state, $filter, FamilymigrationService, RESULT_TEXT, $timeout) {
  var res = FamilymigrationService.getLastAPIresponse()
  $scope.familyDetails = FamilymigrationService.getFamilyDetails()

  var displayDate = function (d) {
    return moment(d).format('DD/MM/YYYY')
  }

  if (!res.status) {
    $state.go('familymigration')
    return
  }

  $scope.familyDetails.displayDate = displayDate($scope.familyDetails.applicationRaisedDate)

  $scope.haveResult = (res.data && res.data.categoryCheck)
  if ($scope.haveResult) {
    $scope.employers = res.data.categoryCheck.employers || []
    $scope.threshold = res.data.categoryCheck.threshold
    $scope.individual = res.data.individual
    $scope.outcomeBoxIndividualName = res.data.individual.forename + ' ' + res.data.individual.surname
    $scope.outcomeFromDate = displayDate(res.data.categoryCheck.assessmentStartDate)
    $scope.outcomeToDate = displayDate(res.data.categoryCheck.applicationRaisedDate)

    if (res.data.categoryCheck.passed) {
      $scope.copysummary = $scope.outcomeBoxIndividualName + ' meets the Category A requirement'
      $scope.success = true
    } else {
      $scope.copysummary = $scope.outcomeBoxIndividualName + ' does not meet the Category A requirement'
      $scope.success = false
      // $scope.heading = res.data.individual.forename + ' ' + res.data.individual.surname + ' doesn\'t meet the Category A requirement';
      switch (res.data.categoryCheck.failureReason) {
        case 'NOT_ENOUGH_RECORDS':
          $scope.reason = 'They haven\'t been with their current employer for 6 months.'
          break

        default:
          $scope.reason = 'They haven\'t met the required monthly amount.'
      }
    }
  } else {
    if (res.status === 404) {
      $scope.heading = 'There is no record for ' + $scope.familyDetails.nino + ' with HMRC'
      $scope.reason = 'We couldn\'t perform the financial requirement check as no income information exists with HMRC.'
    } else {
      $scope.heading = 'You can’t use this service just now. The problem will be fixed as soon as possible'
      $scope.reason = 'Please try again later.'
    }
  };

  $scope.newSearch = function () {
    FamilymigrationService.reset()
    $state.go('familymigration')
  }

  // edit search button
  $scope.editSearch = function () {
    $state.go('familymigration')
  }

  // ######################## //
  // #### COPY AND PASTE #### //
  // ######################## //
  $scope.copyToClipboardBtnText = RESULT_TEXT.copybtn
  var lineLength = function (str, len) {
    while (str.length < len) {
      str += ' '
    }
    return str
  }

  // compile the copy text
  var copyText = ''// (($scope.success) ? 'PASSED': 'NOT PASSED') + '\n'
  if ($scope.success) {
    copyText += 'PASSED\n'
    copyText += $scope.outcomeBoxIndividualName + ' meets the Category A requirement\n\n'
  } else {
    copyText += 'NOT PASSED\n'
    copyText += $scope.reason + '\n\n'
  }

  copyText += 'RESULTS\n'
  copyText += lineLength('Individual: ', 36) + $scope.outcomeBoxIndividualName + '\n'
  copyText += lineLength('Threshold: ', 36) + $scope.threshold + '\n'
  copyText += lineLength('Income within date range: ', 36) + $scope.outcomeFromDate + ' - ' + $scope.outcomeFromDate + '\n'
  _.each($scope.employers, function (e, i) {
    if (i === 0) {
      copyText += lineLength('Employers: ', 36) + e + '\n'
    } else {
      copyText += lineLength('', 36) + e + '\n'
    }
  })

  // add the your search to it
  copyText += '\n\nSEARCH CRITERIA\n'
  copyText += lineLength('Dependants: ', 36) + $scope.familyDetails.dependants + '\n'
  copyText += lineLength('NINO: ', 36) + $scope.familyDetails.nino + '\n'
  copyText += lineLength('Application raised: ', 36) + $scope.familyDetails.displayDate + '\n'

  // init the clipboard object
  var clipboard = new Clipboard('.button--copy', {
    text: function () {
      return copyText
    }
  })

  var timeoutResetButtonText = function () {
    $timeout(function () {
      $scope.copyToClipboardBtnText = RESULT_TEXT.copybtn
      $scope.$applyAsync()
    }, 2000)
  }

  clipboard.on('success', function (e) {
    $scope.copyToClipboardBtnText = RESULT_TEXT.copiedbtn
    $scope.$applyAsync()
    e.clearSelection()
    timeoutResetButtonText()
  })
  clipboard.on('error', function (e) {
    console.log('ClipBoard error', e)
    $scope.copysummary = e.action + ' ' + e.trigger
    $scope.$applyAsync()
  })
}])
