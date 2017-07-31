/* global ga angular _ moment */

/* jshint node: true */

'use strict'

var familymigrationModule = angular.module('hod.familymigration', ['ui.router'])

familymigrationModule.factory('FamilymigrationService', ['IOService', '$state', function (IOService, $state) {
  var lastAPIresponse = {}
  var familyDetails = {
    forename: '',
    surname: '',
    dateOfBirth: '',
    nino: '',
    applicationRaisedDate: '',
    dependants: ''
  }

  this.submit = function (fam) {
    var nino = fam.nino
    fam = angular.copy(fam)
    delete fam.nino

    IOService.get('individual/' + nino + '/financialstatus', fam, {timeout: 30000}).then(function (res) {
      lastAPIresponse = res
      $state.go('familymigrationResults')
    }, function (res) {
      lastAPIresponse = res
      $state.go('familymigrationResults')
    })
  }

  this.getLastAPIresponse = function () {
    return lastAPIresponse
  }

  this.getFamilyDetails = function () {
    return familyDetails
  }

  this.reset = function () {
    familyDetails = {
      dateOfBirth: '',
      forename: '',
      surname: '',
      nino: '',
      applicationRaisedDate: '',
      dependants: ''
    }
  }

  this.trackFormSubmission = function (frm) {
    var errcount = 0
    var errcountstring = ''
    _.each(frm.objs, function (o) {
      if (o.error && o.error.msg) {
        errcount++
        ga('send', 'event', frm.name, 'validation', o.config.id)
      }
    })
    errcountstring = '' + errcount
    while (errcountstring.length < 3) {
      errcountstring = '0' + errcountstring
    }
    ga('send', 'event', frm.name, 'errorcount', errcountstring)
  }

  return this
}])

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

    $scope.familyDetails = FamilymigrationService.getFamilyDetails()

    var appRaisedDateMsg = {
      summary: 'The application raised date is invalid',
      msg: 'Enter a valid application raised date'
    }

    $scope.conf = {
      forename: {

      },
      surname: {

      },
      nino: {
        validate: function (val) {
          if (val) {
            var v = val.replace(/[^a-zA-Z0-9]/g, '')
            if (/^[a-zA-Z]{2}[0-9]{6}[a-dA-D]{1}$/.test(v)) {
              return true
            }
          }
          return { summary: 'The National Insurance number is invalid', msg: 'Enter a valid National Insurance number' }
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

          return {
            summary: 'The number of dependants is invalid',
            msg: 'Enter a valid number of dependants'
          }
        }
      },
      applicationRaisedDate: {
        max: moment().format('YYYY-MM-DD'),
        errors: {
          required: appRaisedDateMsg,
          invalid: appRaisedDateMsg,
          max: appRaisedDateMsg
        }
      },
      dateOfBirth: {
        max: moment().subtract(10, 'years').format('YYYY-MM-DD'),
        errors: {
          max: {
            msg: 'Enter a valid date of birth'
          }
        }
      },
    }

    $scope.submitButton = {
      text: 'Check eligibility',
      disabled: false
    }

    $scope.detailsSubmit = function (isValid, formScope) {
      FamilymigrationService.trackFormSubmission(formScope)
      $scope.familyDetails.nino = ($scope.familyDetails.nino.replace(/[^a-zA-Z0-9]/g, '')).toUpperCase()
      if (isValid) {
        $scope.submitButton.text = 'Sending'
        $scope.submitButton.disabled = true

        FamilymigrationService.submit($scope.familyDetails)

        // .then(function () {
        //   // eveything was OK go to the results page
        //   $state.go('familymigrationResults');
        // }, function (err) {
        //   if (err.availability) {
        //     // something went wrong but availability check says OK so just show generic error page
        //     $state.go('familymigrationResults');
        //   } else {
        //     // something is wrong, availability reports down, so stay here and poll until issue resolved
        //     $rootScope.$broadcast('retestAvailability');
        //     $scope.submitButton.text = 'Check eligibility';
        //     $scope.submitButton.disabled = false;
        //   }
        // });
      }
    }
  }
])
