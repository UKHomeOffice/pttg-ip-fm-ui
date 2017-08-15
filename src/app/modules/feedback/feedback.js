/* global angular */

var feedbackModule = angular.module('hod.feedback', [])

// #### ROUTES #### //
feedbackModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  // define a route for the results operation
  $stateProvider.state({
    name: 'feedback',
    url: '/feedback',
    title: 'Financial Status : Result',
    parent: 'familymigration',
    views: {
      'content@': {
        templateUrl: 'modules/feedback/feedback.html',
        controller: 'FeedbackCtrl'
      }
    }
  })
}])

feedbackModule.controller('FeedbackCtrl',
  [
    '$scope',
    '$state',
    '$stateParams',
    'FamilymigrationService',
    'IOService',
    function (
      $scope,
      $state,
      $stateParams,
      FamilymigrationService,
      IOService
    ) {

      var getCookieValue = function (a) {
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)')
        return b ? b.pop() : ''
      }
      
      var showSatisfactionEveryNth = 5
      var nTimesSinceFeedbackShown = Number(getCookieValue('pttg-ip-fm-sincefeedback')) || 0
      var showSatisfaction = nTimesSinceFeedbackShown === showSatisfactionEveryNth - 1
      $scope.showSatisfaction = showSatisfaction
      // console.log(nTimesSinceFeedbackShown, showSatisfaction)
      document.cookie = 'pttg-ip-fm-sincefeedback=' + ((nTimesSinceFeedbackShown + 1) % showSatisfactionEveryNth)
      



      ga('set', 'page', $state.href($state.current.name, $stateParams))
      ga('send', 'pageview')

      var lastCheckDetails = FamilymigrationService.getFamilyDetails()

      $scope.showForm = true
      $scope.feedback = {}
      $scope.yesNoOptions = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
      $scope.scoreOptions = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 }
      ]

      var conditionalIfNo = function (fieldName, v, err) {
        console.log(fieldName, $scope.feedback[fieldName])
        if ($scope.feedback[fieldName] !== 'no') {
          // not relevant as everything was OK
          return true
        }

        if (_.isString(v) && v.length) {
          return true
        }

        return err
      }

      $scope.conf = {
        correctIndividual: {
          inline: true
        },
        correctIndividualComment: {
          classes: {'form-control-1-4': false},
          required: false,
          validate: function (v, sc) {
            return conditionalIfNo('correctIndividual', v, { summary: 'Comment on what went wrong is blank', msg: 'What went wrong is blank' })
          }
        },
        match: {
          inline: true
        },
        matchComment: {
          classes: {'form-control-1-4': false},
          required: false,
          validate: function (v, sc) {
            return conditionalIfNo('match', v, { summary: 'Comment on why IPS did not match paper assessment', msg: 'What did not match?' })
          }
        },
        satisfactionEase: {
          inline: true,
          hidden: !showSatisfaction
        },
        satisfactionClarityQ: {
          inline: true,
          hidden: !showSatisfaction
        },
        satisfactionClarityI: {
          inline: true,
          hidden: !showSatisfaction
        },
        satisfactionFuncionality: {
          inline: true,
          hidden: !showSatisfaction
        },
        anyOtherFeedback: {
          classes: {'form-control-1-4': false},
          required: false,
          hidden: !showSatisfaction
        }
      }

      $scope.newSearch = function () {
        FamilymigrationService.reset()
        $state.go('familymigration')
      }

      $scope.feedbackSubmit = function (valid) {
        if (valid) {
          
          var details = angular.copy($scope.feedback)
          details.nino = lastCheckDetails.nino
          // console.log(details)
          IOService.post('feedback', details).then(function (res) {
            // console.log(res)
            $scope.showForm = false

          }, function (err) {
            console.log(err)
            $scope.showForm = false
          })
        }
      }
    }
  ]
)
