/* global angular _ */

var fm = angular.module('hod.familymigration')

fm.directive('fmFeedback', ['IOService', function (IOService) {
  return {
    restrict: 'E',
    scope: {
      passed: '=',
      callback: '='
    },
    templateUrl: 'modules/familymigration/familymigrationFeedback.html',
    compile: function (element, attrs) {
      return function ($scope, element, attrs) {
        $scope.showForm = true
        $scope.showThanks = false
        $scope.feedback = {
          reasonForNotMatch: {}
        }

        var options
        if ($scope.passed) {
          options = [{
              value: 'failed-a-salaried',
              label: 'Not Passed on Cat A Salaried'
            },
            {
              value: 'failed-b-nonsalaried',
              label: 'Not Passed on Cat B Non-Salaried'
            },
            {
              value: 'failed-f',
              label: 'Not Passed on Cat F Self Assessment (1 Year)'
            },
            {
              value: 'failed-g',
              label: 'Not Passed on Cat G Self Assessment (2 Years)'
            }
          ]
        } else {
          options = [{
              value: 'passed-a-salaried',
              label: 'Passed on Cat A Salaried'
            },
            {
              value: 'passed-b-nonsalaried',
              label: 'Passed on Cat B Non-Salaried'
            },
            {
              value: 'passed-f',
              label: 'Passed on Cat F Self Assessment (1 Year)'
            },
            {
              value: 'passed-g',
              label: 'Passed on Cat G Self Assessment (2 Years)'
            }
          ]
        }

        $scope.conf = {
          match: {
            label: 'Did IPS match the paper assessment?',
            inline: true,
            options: [{
              value: 'yes',
              label: 'Yes'
            }, {
              value: 'no',
              label: 'No'
            }],
            onClick: function (options) {
              setFeedbackVisibility(options.value)
            }
          },
          reasonForNotMatch: {
            id: 'reasonForNotMatch',
            options: options,
            validate: function (v, sc) {
              var numselected = _.reduce($scope.feedback.reasonForNotMatch, function (memo, bool) {
                return (bool) ? memo + 1 : memo
              }, 0)
              if (numselected || $scope.feedback.matchOther) return true
              return {
                summary: 'The "Why do you think that the paper assessment did not match the IPS result?" is blank',
                msg: 'Select an option'
              }
            }
          },
          matchOther: {
            classes: {
              'form-control-1-4': false
            },
            required: false
          }
        }

        var setFeedbackVisibility = function (didMatch) {
          $scope.conf.reasonForNotMatch.hidden = true
          $scope.conf.matchOther.hidden = true
          if (didMatch === 'no' && $scope.passed) {
            $scope.conf.reasonForNotMatch.hidden = false
            $scope.conf.matchOther.hidden = false
          } else if (didMatch === 'no' && !$scope.passed) {
            $scope.conf.reasonForNotMatch.hidden = false
          }
        }
        setFeedbackVisibility();

        $scope.feedbackSubmit = function (valid) {
          if (!valid) return
          var details = angular.copy($scope.feedback)
          _.each($scope.conf, function (conf, ref) {
            if (conf.hidden) {
              delete details[ref]
            }
          })

          details.nino = attrs.nino

          var feedbackDone = function (ok) {
            // track
            // ga('set', 'page', $state.href($state.current.name, $stateParams) + '/' + state + '/feedback/' + details.match)
            // ga('send', 'pageview')
            $scope.showForm = false
            $scope.showThanks = true
            $scope.$applyAsync()
            if (typeof $scope.callback === 'function') {
              $scope.callback(ok)
            }
          }

          IOService.post('/feedback', details).then(function (res) {
            feedbackDone(true)
          }, function (err) {
            console.log('ERROR', err)
            feedbackDone(false)
          })
        }
      }
    }
  }
}])
