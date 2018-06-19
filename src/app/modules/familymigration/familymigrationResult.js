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

      $scope.search = FamilymigrationService.getSearch()
      $scope.applicant = FamilymigrationService.getApplicant()
      $scope.partner = FamilymigrationService.getPartner()
      $scope.showJoint = ($scope.partner)
      $scope.haveResult = FamilymigrationService.haveResult()

      $scope.showFeedbackForm = true
      $scope.showFeedbackThanks = false
      $scope.showNewSearchButton = false
      $scope.feedback = {}
      $scope.yesNoOptions = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]

      $scope.feedback = { whynot: {} }
      $scope.dFormat = 'dd/MM/yyyy'

      if (!res.status) {
        $state.go('familymigration')
        return
      }

      var summary = FamilymigrationService.getResultSummary()
      console.log(summary)
      $scope.success = summary && summary.passed
      if (summary) {
        $scope.summary = summary
        $scope.showJoint = (summary.individuals && summary.individuals.length > 1)
        $scope.individual = _.first(summary.individuals)
        $scope.outcomeBoxIndividualName = $scope.individual.forename + ' ' + $scope.individual.surname

        if (summary.passed) {
          state = 'passed'
          $scope.copysummary = $scope.outcomeBoxIndividualName + ' meets the Income Proving requirement'
          $scope.success = true
        } else {
          $scope.copysummary = $scope.outcomeBoxIndividualName + ' does not meet the Income Proving requirement'
          $scope.success = false
      // $scope.heading = res.data.individual.forename + ' ' + res.data.individual.surname + ' doesn\'t meet the Category A requirement';
          switch (summary.failureReason) {
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
        console.log($scope.applicant)
        if (res.status === 404 && res.data && res.data.status && res.data.status.code === '0009') {
          state = 'failure/norecord'
          $scope.heading = 'There is no record for ' + $scope.applicant.nino + ' with HMRC'
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

      // #### FEEDBACK #### //
      var options
      if (summary && summary.passed) {
        options = [
            {value: 'failed-a-salaried', label: 'Not Passed on Cat A Salaried' },
            { value: 'failed-b-nonsalaried', label: 'Not Passed on Cat B Non-Salaried' },
            { value: 'failed-f', label: 'Not Passed on Cat F Self Assessment (1 Year)' },
            { value: 'failed-g', label: 'Not Passed on Cat G Self Assessment (2 Years)' }]
      } else {
        options = [
            { value: 'passed-a-salaried', label: 'Passed on Cat A Salaried' },
            { value: 'passed-b-nonsalaried', label: 'Passed on Cat B Non-Salaried' },
            { value: 'passed-f', label: 'Passed on Cat F Self Assessment (1 Year)' },
            { value: 'passed-g', label: 'Passed on Cat G Self Assessment (2 Years)' }
        ]
      }
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
          options: options
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

        // var lastCheckDetails = FamilymigrationService.getFamilyDetails()
        // details.nino = lastCheckDetails.nino
        details.nino = _.pluck(res.data.individuals, 'nino').join(',')

        var reload = function () {
          // track
          // ga('set', 'page', $state.href($state.current.name, $stateParams) + '/' + state + '/feedback/' + details.match)
          // ga('send', 'pageview')

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

      $scope.copyToClipboardBtnText = RESULT_TEXT.copybtn

      var copyText = FamilymigrationService.getCopyPasteSummary()
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
