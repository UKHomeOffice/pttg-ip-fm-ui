/* global angular Clipboard moment _ ga */

var familymigrationModule = angular.module('hod.familymigration')

familymigrationModule.constant('RESULTCODES', {
  PAY_FREQUENCY_CHANGE: 'PAY_FREQUENCY_CHANGE',
  MULTIPLE_EMPLOYERS: 'MULTIPLE_EMPLOYERS',
  UNKNOWN_PAY_FREQUENCY: 'UNKNOWN_PAY_FREQUENCY',
  NOT_ENOUGH_RECORDS: 'NOT_ENOUGH_RECORDS'
})

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

familymigrationModule.controller('FamilymigrationResultCtrl',
  [
    '$scope',
    '$state',
    '$stateParams',
    '$filter',
    'FamilymigrationService',
    'RESULT_TEXT',
    '$timeout',
    '$window',
    'RESULTCODES',
    'IOService',
    function (
    $scope,
    $state,
    $stateParams,
    $filter,
    FamilymigrationService,
    RESULT_TEXT,
    $timeout,
    $window,
    RESULTCODES,
    IOService
  ) {
      var state = 'error'
      var res = FamilymigrationService.getLastAPIresponse()
      $scope.familyDetails = FamilymigrationService.getFamilyDetails()
      $scope.showJoint = ($scope.familyDetails.partner.forename.length > 0)
      $scope.showFeedbackForm = true
      $scope.showFeedbackThanks = false
      $scope.showNewSearchButton = false
      $scope.feedback = {}
      $scope.yesNoOptions = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]

      $scope.feedback = { whynot: {} }

      $scope.dFormat = 'dd/MM/yyyy'

      if (!res.status) {
        console.log(res)
        $state.go('familymigration')
        return
      }

      $scope.haveResult = (res.data && res.data.categoryCheck)
      if ($scope.haveResult) {
        $scope.threshold = res.data.categoryCheck.threshold
        $scope.showJoint = (res.data.partner) ? (res.data.partner.forename.length > 0) : false

    // applicant
        $scope.individual = res.data.individual
        $scope.individual.employers = res.data.categoryCheck.employers || []
        $scope.individual.outcomeFromDate = res.data.categoryCheck.assessmentStartDate
        $scope.individual.outcomeToDate = res.data.categoryCheck.applicationRaisedDate
        $scope.outcomeBoxIndividualName = res.data.individual.forename + ' ' + res.data.individual.surname

    // partner
        if (_.has(res.data.categoryCheck, 'partner')) {
          $scope.partner = res.data.partner
          $scope.partner.employers = res.data.categoryCheck.partner.employers || []
          $scope.partner.outcomeFromDate = res.data.categoryCheck.partner.assessmentStartDate
          $scope.partner.outcomeToDate = res.data.categoryCheck.applicationRaisedDate
        }

        if (res.data.categoryCheck.passed) {
          state = 'passed'
          $scope.copysummary = $scope.outcomeBoxIndividualName + ' meets the Category ' + res.data.categoryCheck.category + ' requirement'
          $scope.success = true
        } else {
          $scope.copysummary = $scope.outcomeBoxIndividualName + ' does not meet either Category A or B requirements'
          $scope.success = false
      // $scope.heading = res.data.individual.forename + ' ' + res.data.individual.surname + ' doesn\'t meet the Category A requirement';
          switch (res.data.categoryCheck.failureReason) {
            case RESULTCODES.PAY_FREQUENCY_CHANGE:
              state = 'notpassed/paymentfrequencychange'
              $scope.reason = 'Change in payment frequency.'
              break

            case RESULTCODES.MULTIPLE_EMPLOYERS:
              state = 'notpassed/multipleemployers'
              $scope.reason = 'Payments from multiple employers.'
              break

            case RESULTCODES.UNKNOWN_PAY_FREQUENCY:
              state = 'notpassed/unknownfrequency'
              $scope.reason = 'Unable to calculate a payment frequency.'
              break

            case RESULTCODES.NOT_ENOUGH_RECORDS:
              state = 'notpassed/recordcount'
              $scope.reason = 'They haven\'t been with their current employer for 6 months.'
              break

            default:
              state = 'notpassed/threshold'
              $scope.reason = 'They haven\'t met the required monthly amount.'
          }
        }
      } else {
        console.log('ERROR', res)
        if (res.status === 404 && res.data && res.data.status && res.data.status.code === '0009') {
          state = 'failure/norecord'
          $scope.heading = 'There is no record for ' + $scope.familyDetails.nino + ' with HMRC'
          $scope.reason = 'We couldn\'t perform the financial requirement check as no income information exists with HMRC.'
          $scope.showFeedbackForm = false
          $scope.showFeedbackThanks = false
          $scope.showNewSearchButton = true
        } else if (res.status === 404) {
          $scope.heading = 'Incoming Proving Service Currently Unavailable'
          $scope.reason = 'The page will now reload.'
          state = 'failure'
          $timeout(function () {
            $window.location.reload()
          }, 2000)
        } else if (res.status === 307) {
          $scope.heading = 'Your Keycloak session has timed out'
          $scope.reason = 'The page will now reload.'
          state = 'failure'
          $timeout(function () {
            $window.location.reload()
          }, 2000)
        } else {
          $scope.heading = 'You can’t use this service just now. The problem will be fixed as soon as possible'
          $scope.reason = 'Please try again later.'
          state = 'failure'
        }
      };

      var conditionalIfNo = function (fieldName, v, err) {
        if ($scope.feedback[fieldName] !== 'no') {
      // not relevant as everything was OK
          return true
        }

        if (_.isString(v) && v.length) {
          return true
        }

        return err
      }

      // #### FEEDBACK #### //

      $scope.conf = {
        match: {
          label: 'Did IPS match the paper assessment?',
          inline: true,
          onClick: function (opt, scope) {
            setFeedbackVisibility(opt.value)
          }
        },
        whynot: {
          id: 'whynot',
          options: [
            { value: 'passed-a-salaried', label: 'Passed on Cat A Salaried' },
            { value: 'passed-a-nonsalaried', label: 'Passed on Cat A Non-Salaried' },
            { value: 'passed-b-salaried', label: 'Passed on Cat B Salaried' },
            { value: 'passed-b-nonsalaried', label: 'Passed on Cat B Non-Salaried' },
            { value: 'failed-a-salaried', label: 'Not Passed on Cat A Salaried' },
            { value: 'failed-a-nonsalaried', label: 'Not Passed on Cat A Non-Salaried' },
            { value: 'failed-b-salaried', label: 'Not Passed on Cat B Salaried' },
            { value: 'failed-b-nonsalaried', label: 'Not Passed on Cat B Non-Salaried' }
          ]
          // validate: function (v, sc) {
          //   console.log('validate whynot')
          //   var n = _.reduce($scope.feedback.whynot, function (memo, bool) { return (bool) ? memo + 1 : memo }, 0)
          //   console.log('validate', n, $scope.feedback.matchOther)
          //   if (n || $scope.feedback.matchOther) return true
          //   return { summary: 'The "Why do you think that the paper assessment did not match the IPS result?" is blank', msg: 'Select one or more from below' }
          // }
        },
        matchOther: {
          classes: {'form-control-1-4': false},
          required: false
        }
      }

      var setFeedbackVisibility = function (v) {
        $scope.conf.whynot.hidden = true
        $scope.conf.matchOther.hidden = true

        if (v === 'no') {
          $scope.conf.whynot.hidden = false
          $scope.conf.matchOther.hidden = false
        }
      }

      setFeedbackVisibility()

      $scope.feedbackSubmit = function (valid) {
        if (!valid) return
        var details = angular.copy($scope.feedback)
        _.each($scope.conf, function (conf, ref) {
          if (conf.hidden) {
            delete details[ref]
          }
        })

        // #### END FEEDBACK ####

        var lastCheckDetails = FamilymigrationService.getFamilyDetails()
        details.nino = lastCheckDetails.nino

        var reload = function () {
      // track
          ga('set', 'page', $state.href($state.current.name, $stateParams) + '/' + state + '/feedback/' + details.match)
          ga('send', 'pageview')

          $scope.showFeedbackForm = false
          $scope.showFeedbackThanks = true
          $scope.showNewSearchButton = true
        }

        IOService.post('feedback', details).then(function (res) {
          reload()
        }, function (err) {
          console.log('ERROR', err)
          reload()
        })
      }

      $scope.newSearch = function () {
        $window.location.reload()
      }

  // edit search button
      $scope.editSearch = function () {
        $state.go('familymigration')
      }

  // track
      ga('set', 'page', $state.href($state.current.name, $stateParams) + '/' + state)
      ga('send', 'pageview')

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
      copyText += lineLength('Threshold: ', 36) + $filter('currency')($scope.threshold, '£') + '\n'
      copyText += lineLength('Income within date range: ', 36) + $scope.outcomeFromDate + ' - ' + $scope.outcomeToDate + '\n'
      _.each($scope.employers, function (e, i) {
        if (i === 0) {
          copyText += lineLength('Employers: ', 36) + e + '\n'
        } else {
          copyText += lineLength('', 36) + e + '\n'
        }
      })

  // add the your search to it
      copyText += '\n\nSEARCH CRITERIA\n'
      copyText += lineLength('First name: ', 36) + $scope.familyDetails.forename + '\n'
      copyText += lineLength('Surname: ', 36) + $scope.familyDetails.surname + '\n'
      copyText += lineLength('Date of birth: ', 36) + $scope.familyDetails.dateOfBirth + '\n'
      copyText += lineLength('Dependants: ', 36) + $scope.familyDetails.dependants + '\n'
      copyText += lineLength('NINO: ', 36) + $scope.familyDetails.nino + '\n'
      copyText += lineLength('Application raised: ', 36) + $filter('date')($scope.familyDetails.applicationRaisedDate, $scope.dFormat) + '\n'
  // familyDetails.applicationRaisedDate | date: dFormat

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
