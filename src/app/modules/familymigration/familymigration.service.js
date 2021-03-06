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
    IOService.post('/financialstatus', fam, {timeout: 100000}).then(function (res) {
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
    if (!this.haveResult()) {
      return null
    }
    return _.findWhere(lastAPIresponse.data.categoryChecks, {passed: true}) || null
  }

  this.getCheckWithMostApplicants = function () {
    if (!this.haveResult()) {
      return null
    }
    var checkWithMostApplicants = null
    _.forEach(lastAPIresponse.data.categoryChecks, function (catCheck) {
      if (checkWithMostApplicants == null) {
        checkWithMostApplicants = catCheck
      } else {
        if (catCheck.individuals.length > checkWithMostApplicants.individuals.length) {
          checkWithMostApplicants = catCheck
        }
      }
    })
    return checkWithMostApplicants
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
    var check = this.getPassingCheck() || this.getCheckWithMostApplicants()

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

  this.getCopyPasteSummary = function (asArray) {
    var search = this.getSearch()
    var summ = this.getResultSummary()
    var copyText = ''
    var BLANK = ''
    var lines = []
    if (summ) {
      var individual = _.first(summ.individuals)

      if (summ.passed) {
        lines.push('PASSED')
        lines.push(individual.forename + ' ' + individual.surname + ' meets the Income Proving requirement')
      } else {
        lines.push('NOT PASSED')
        lines.push(summ.failureReason)
      }

      lines.push(BLANK)

      lines.push('RESULTS')

      _.each(summ.individuals, function (i) {
        lines.push(i.forename + ' ' + i.surname)
        lines.push(['Income within date range:', moment(summ.assessmentStartDate).format(fmt) + ' - ' + moment(summ.applicationRaisedDate).format(fmt)])
        _.each(i.employers, function (e, n) {
          if (n === 0) {
            lines.push(['Employers:', e])
          } else {
            lines.push(['', e])
          }
        })
      })
    } else {
      lines.push('ERROR')
      lines.push('There is no record for ' + _.first(search.individuals).nino + ' with HMRC')
    }

    lines.push(BLANK)
    lines.push(BLANK)

    lines.push('SEARCH CRITERIA')

    _.each(search.individuals, function (ind, n) {
      lines.push(n === 0 ? 'APPLICANT:' : 'PARTNER:')
      lines.push(['First name:', ind.forename])
      lines.push(['Surname:', ind.surname])
      lines.push(['Date of birth:', moment(ind.dateOfBirth).format(fmt)])
      lines.push(['National Insurance number:', ind.nino])
      lines.push(BLANK)
    })

    lines.push(['Dependants:', search.dependants])
    lines.push(['Application raised:', moment(search.applicationRaisedDate).format(fmt)])

    if (asArray) {
      return lines
    }

    _.each(lines, function (l) {
      if (_.isArray(l)) {
        copyText += lineLength(l[0], 36) + l[1] + '\n'
      } else {
        copyText += l + '\n'
      }
    })

    return copyText
  }
  this.getNotFoundNino = function (notFoundErrorMessage, applicantNino, partnerNino) {
    var redactedNinoRegex = /.*([A-Z]{2}[0-9]{3}).*/
    var returnedNino = notFoundErrorMessage.match(redactedNinoRegex)[1]
    var failedNino = ''
    if (returnedNino === applicantNino.substr(0, 5)) {
      failedNino = applicantNino
    } else if (returnedNino === partnerNino.substr(0, 5)) {
      failedNino = partnerNino
    } else {
      console.error('Unexpected nino found in error message: ' + notFoundErrorMessage)
    }
    return failedNino
  }

  this.calculateEndOfTaxYear = function (assessmentStartDate) {
    var assessmentStartDateSplit = assessmentStartDate.split('-')
    var assessmentStartDateYear = parseInt(assessmentStartDateSplit[0])
    return '05/04/' + (assessmentStartDateYear + 1)
  }

  this.reset()
  return this
}])
