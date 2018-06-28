/* global ga angular moment _ */

/* jshint node: true */

'use strict'

var familymigrationModule = angular.module('hod.familymigration', [])

// #### ROUTES #### //
familymigrationModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  // define a route for the details of the form
  $stateProvider.state({
    name: 'familymigration',
    url: '/familymigration',
    title: 'Family migration: Query',
    views: {
      'content@': {
        templateUrl: 'modules/familymigration/familymigration.html',
        controller: 'FamilymigrationDetailsCtrl'
      }
    }
  })
}])

// fill in the details of the form
familymigrationModule.controller(
'FamilymigrationDetailsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'FamilymigrationService', 'IOService', '$window', '$timeout',
  function ($rootScope, $scope, $state, $stateParams, FamilymigrationService, IOService, $window) {
    // track that we're now on the main form details page
    ga('set', 'page', $state.href($state.current.name, $stateParams))
    ga('send', 'pageview')

    $scope.search = FamilymigrationService.getSearch()
    $scope.applicant = FamilymigrationService.getApplicant()
    $scope.partner = FamilymigrationService.getPartner()
    $scope.showJoint = ($scope.partner && $scope.partner.forename.length > 0)
    $scope.partnerBtnText = 'Add a second individual'

    var appRaisedDateMsg = {
      summary: 'The "Application raised date" is invalid',
      msg: 'Enter a valid "Application raised date"'
    }

    var ninoValidation = function (val) {
      if (val) {
        var v = val.replace(/[^a-zA-Z0-9]/g, '')
        if (/(^((?!(BG|GB|KN|NK|NT|TN|ZZ)|([DFIQUV])[A-Z]|[A-Z]([DFIOQUV]))[A-Z]{2})[0-9]{6}[A-D]?$)/.test(v)) {
          return true
        }
      }
      return false
    }

    $scope.conf = {
      forename: {},
      surname: {},
      nino: {
        validate: ninoValidation
      },
      dateOfBirth: {
        max: moment().subtract(10, 'years').format('YYYY-MM-DD'),
        errors: {
          max: {
            msg: 'Enter a valid "Date of birth"'
          }
        }
      },
      partner: {
        forename: {},
        surname: {},
        nino: {
          validate: ninoValidation
        },
        dateOfBirth: {
          max: moment().subtract(10, 'years').format('YYYY-MM-DD'),
          errors: {
            max: {
              msg: 'Enter a valid "Date of birth"'
            }
          }
        }
      },
      dependants: {
        required: false,
        max: 99,
        classes: { 'form-control-1-8': true },
        validate: function (v, s) {
          var n = Number(v)
          var ok = true
          if (n < 0 || n > 99) {
            ok = false
          }

          if (v.length === 0) {
            ok = false
          }

          if (Math.ceil(n) !== Math.floor(n)) {
            // not a whole number
            ok = false
          }

          if (ok) {
            return true
          }
          return false
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
    }

    $scope.submitButton = {
      text: 'Check eligibility',
      disabled: false
    }

    $scope.secondIndividualtoggle = function () {
      var partner = FamilymigrationService.getPartner()
      if (!partner) {
        $scope.showJoint = true
        $scope.partner = FamilymigrationService.addPartner()
        $scope.partnerBtnText = 'Remove second individual'
      } else {
        $scope.showJoint = false
        FamilymigrationService.removePartner()
        $scope.partner = null
        $scope.partnerBtnText = 'Add a second individual'
      }
    }

    $scope.detailsSubmit = function (isValid, formScope) {
      FamilymigrationService.trackFormSubmission(formScope)
      if (isValid) {
        _.each($scope.search.individuals, function (i) {
          var n1 = i.nino
          var n2 = n1.replace(/[^a-z0-9]*/gi, '')
          i.nino = n2
        })
        $scope.submitButton.text = 'Sending'
        $scope.submitButton.disabled = true

        FamilymigrationService.submit($scope.search)
      }
    }
  }
])
