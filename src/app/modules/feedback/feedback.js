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
    'FamilymigrationService',
    function (
      $scope,
      $state,
      FamilymigrationService
    ) {
      $scope.feedback = {documents: {}}
      $scope.yesNoOptions = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
      $scope.scoreOptions = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 }
      ]
      $scope.conf = {
        match: {
          inline: true
        },
        correctIndividual: {
          inline: true
        },
        matchComment: {
          classes: {'form-control-1-4': false},
          required: false
        },
        documentSA103: {
          inline: true
        },
        documentSA302: {
          inline: true
        },
        documentBank: {
          inline: true
        },
        documentPayslip: {
          inline: true
        },
        documentsOther: {
          classes: {'form-control-1-4': false},
          required: false
        },
        satisfactionEase: {
          inline: true
        },
        satisfactionClarityQ: {
          inline: true
        },
        satisfactionClarityI: {
          inline: true
        },
        satisfactionFuncionality: {
          inline: true
        }
      }
    }
  ]
)
