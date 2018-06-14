/* global angular _ ga moment */

var fmt = 'DD/MM/YYYY'
var familymigrationModule = angular.module('hod.familymigration')

familymigrationModule.factory('FamilymigrationService', ['IOService', '$state', function (IOService, $state) {
  var lastAPIresponse = {}
  var search

  var lineLength = function (str, len) {
    while (str.length < len) {
      str += ' '
    }
    return str
  }

  this.reset = function () {
    search = {
      applicationRaisedDate: '',
      dependants: '',
      individuals: [
        {
          dateOfBirth: '',
          forename: '',
          surname: '',
          nino: ''
        }
      ]
    }
  }

  this.submit = function (fam) {
    fam = angular.copy(fam)

    var me = this
    IOService.post('individual/financialstatus', fam, {timeout: 30000}).then(function (res) {
      me.setLastAPIresponse(res)
      $state.go('familymigrationResults')
    }, function (err) {
      me.setLastAPIresponse(err)
      $state.go('familymigrationResults')
    })
  }

  this.getSearch = function () {
    return search
  }

  this.getApplicant = function () {
    return _.first(search.individuals)
  }

  this.getPartner = function () {
    return (search.individuals.length > 1) ? search.individuals[1] : null
  }

  this.addPartner = function () {
    if (search.individuals.length === 1) {
      var partner = {
        dateOfBirth: '',
        forename: '',
        surname: '',
        nino: ''
      }
      search.individuals.push(partner)
    }
    return this.getPartner()
  }

  this.removePartner = function () {
    search.individuals.splice(1)
    return search
  }

  this.setLastAPIresponse = function (res) {
    lastAPIresponse = res
    return lastAPIresponse
  }

  this.getLastAPIresponse = function () {
    return lastAPIresponse
  }

  this.haveResult = function () {
    return (_.has(lastAPIresponse.data, 'categoryChecks') && _.isArray(lastAPIresponse.data.categoryChecks) && lastAPIresponse.data.categoryChecks.length >= 1)
  }

  this.getPassingCheck = function () {
    return _.findWhere(lastAPIresponse.data.categoryChecks, {passed: true}) || null
  }

  this.getFirstCheck = function () {
    return _.first(lastAPIresponse.data.categoryChecks) || null
  }

  this.getEmployers = function (check, nino) {
    var individual = _.findWhere(check.individuals, {nino: nino})
    if (individual && individual.employers) {
      return individual.employers
    }
    return null
  }

  this.getResultSummary = function () {
    var me = this
    var check = this.getPassingCheck() || this.getFirstCheck()

    if (!check) {
      return null
    }

    check = JSON.parse(JSON.stringify(check))
    _.each(check.individuals, function (i) {
      var person = _.findWhere(lastAPIresponse.data.individuals, {nino: i.nino})
      if (person) {
        i.forename = person.forename
        i.surname = person.surname
        i.employers = me.getEmployers(check, i.nino)
      }
    })

    return check
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

  this.getCopyPasteSummary = function () {
    var search = this.getSearch()
    var summ = this.getResultSummary()
    if (summ) {
      var individual = _.first(summ.individuals)

      var copyText = ''
      if (summ.passed) {
        copyText += 'PASSED\n'
        copyText += individual.forename + ' ' + individual.surname + ' meets the Category A requirement\n\n'
      } else {
        copyText += 'NOT PASSED\n'
        copyText += summ.failureReason + '\n\n'
      }

      copyText += 'RESULTS\n'

      _.each(summ.individuals, function (i) {
        copyText += i.forename + ' ' + i.surname + '\n\n'
        copyText += lineLength('Income within date range: ', 36) + moment(summ.assessmentStartDate).format(fmt) + ' - ' + moment(summ.applicationRaisedDate).format(fmt) + '\n'
        _.each(i.employers, function (e, n) {
          if (n === 0) {
            copyText += lineLength('Employers: ', 36)
          } else {
            copyText += lineLength('', 36)
          }
          copyText += e + '\n'
        })
      })
    } else {
      copyText += 'ERROR\n'
      copyText += 'There is no record for ' + _.first(search.individuals).nino + ' with HMRC\n'
    }

    copyText += '\n\nSEARCH CRITERIA\n'

    _.each(search.individuals, function (ind, n) {
      copyText += lineLength('First name: ', 36) + ind.forename + '\n'
      copyText += lineLength('Surname: ', 36) + ind.surname + '\n'
      copyText += lineLength('Date of birth: ', 36) + moment(ind.dateOfBirth).format(fmt) + '\n'
      copyText += lineLength('National Insurance number: ', 36) + ind.nino + '\n\n'
    })

    copyText += lineLength('Dependants: ', 36) + search.dependants + '\n'
    copyText += lineLength('Application raised: ', 36) + moment(search.applicationRaisedDate).format(fmt) + '\n'

    return copyText
  }

  this.reset()
  return this
}])
