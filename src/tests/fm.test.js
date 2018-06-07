/* global describe it beforeEach inject _ expect */

var getTestIndividual = function (n) {
  switch (n) {
    case 'Bilbo':
      return {
        forename: 'Bilbo',
        surname: 'Baggins',
        nino: 'BB123456B'
      }
    case 'Gandalf':
      return {
        forename: 'Gandalf',
        surname: 'Mithrandir',
        nino: 'GG123456G'
      }
    case 'Gollum':
      return {
        forename: 'Gollum',
        surname: 'Smeegol',
        nino: 'GO123456M'
      }
  }
}

var getTestCheck = function (pass, cat, type) {
  return {
    category: cat,
    calculationType: type,
    passed: pass,
    applicationRaisedDate: '2015-01-03',
    assessmentStartDate: '2014-07-03',
    failureReason: '',
    threshold: '128.64',
    individuals: [
      {
        nino: 'TL123456A',
        employers: [
          'ZX Spectrum 48K'
        ]
      },
      {
        nino: 'BB123456R',
        employers: [
          'ZX Spectrum 48K'
        ]
      }
    ]
  }
}

var getTestResponse = function () {
  return {
    data: {
      individuals: [
        getTestIndividual('Bilbo')
      ],
      categoryChecks: [
        getTestCheck(false, 'B', 'non-salaried'),
        getTestCheck(true, 'A', 'salaried'),
        getTestCheck(false, 'B', 'joint salaried')
      ]
    }
  }
}

describe('app: hod.proving', () => {
  beforeEach(module('hod.proving'))
  beforeEach(module('hod.familymigration'))

  describe('FamilymigrationService', () => {
    let fm

    beforeEach(inject(function (FamilymigrationService) {
      fm = FamilymigrationService
      fm.reset()
    }))

    describe('getSearch', () => {
      it('should get the details object', () => {
        let testObj = fm.getSearch()
        expect(testObj.applicationRaisedDate).toEqual('')
        expect(testObj.dependants).toEqual('')
        expect(_.isArray(testObj.individuals)).toBeTruthy()
        expect(testObj.individuals.length).toEqual(1)

        let individual = testObj.individuals[0]
        expect(_.has(individual, 'forename')).toBeTruthy()
        expect(_.has(individual, 'surname')).toBeTruthy()
        expect(_.has(individual, 'nino')).toBeTruthy()
      })
    })
    describe('reset', () => {
      it('should be able to reset the object clearing out any data', () => {
        let testObj = fm.getSearch()
        testObj.dependants = 99
        testObj.individuals[0].forename = 'Bill'
        testObj.individuals.push({ forename: 'Frank' })

        fm.reset()
        testObj = fm.getSearch()
        expect(testObj.dependants).toEqual('')
        expect(testObj.individuals[0].forename).toEqual('')
        expect(testObj.individuals.length).toEqual(1)
      })
    })

    describe('getApplicant', () => {
      it('should return the first individual in the FamilyDetails object', () => {
        let testObj = fm.getSearch()
        testObj.individuals[0].forename = 'Bill'
        testObj.individuals.push({ forename: 'Frank' })

        let applicant = fm.getApplicant()
        expect(applicant.forename).toEqual('Bill')
      })
    })

    describe('getParter', () => {
      it('should return the second individual in the FamilyDetails object', () => {
        let testObj = fm.getSearch()
        testObj.individuals[0].forename = 'Bill'
        testObj.individuals.push({ forename: 'Frank' })

        let partner = fm.getPartner()
        expect(partner.forename).toEqual('Frank')
      })

      it('should return null if there is no second individual', () => {
        let partner = fm.getPartner()
        expect(partner).toEqual(null)
      })
    })

    describe('addPartner', () => {
      it('should add a second individual', () => {
        let testObj = fm.getSearch()
        expect(testObj.individuals.length).toEqual(1)
        let partner = fm.addPartner()
        expect(_.has(partner, 'forename')).toBeTruthy()
        expect(_.has(partner, 'surname')).toBeTruthy()
        expect(_.has(partner, 'nino')).toBeTruthy()
        expect(testObj.individuals.length).toEqual(2)
      })

      it('should not add a another individual if two already exists', () => {
        let testObj = fm.getSearch()
        let partner = fm.addPartner()
        partner.forename = 'Fred'
        expect(testObj.individuals.length).toEqual(2)

        let anotherPartner = fm.addPartner()
        expect(testObj.individuals.length).toEqual(2)
        expect(anotherPartner.forename).toEqual('Fred')
      })
    })

    describe('setLastAPIresponse & getLastAPIresponse', () => {
      it('should be able to set the last API response', () => {
        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: [{ passed: true }]} })
        let test = fm.getLastAPIresponse()
        expect(test.status).toEqual(200)
        expect(_.has(test, 'data')).toBeTruthy()
        expect(_.has(test.data, 'categoryChecks')).toBeTruthy()
        expect(test.data.categoryChecks.length).toEqual(1)
        expect(test.data.categoryChecks[0].passed).toEqual(true)

        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: [{ passed: false }]} })
        test = fm.getLastAPIresponse()
        expect(test.data.categoryChecks[0].passed).toEqual(false)
      })
    })

    describe('getPassingCheck', () => {
      it('should return a passing check from the categoryChecks of the last API response', () => {
        fm.setLastAPIresponse({ status: 200,
          data: {categoryChecks: [
          { passed: false, calculationType: 'salaried joint' },
          { passed: true, calculationType: 'nonsalaried' },
          { passed: false, calculationType: 'salaried' }
          ]}
        })

        let test = fm.getPassingCheck()
        expect(test.passed).toEqual(true)
        expect(test.calculationType).toEqual('nonsalaried')
      })

      it('should return null if there is no passing check', () => {
        fm.setLastAPIresponse({ status: 200,
          data: {categoryChecks: [
          { passed: false, calculationType: 'salaried joint' },
          { passed: false, calculationType: 'nonsalaried' },
          { passed: false, calculationType: 'salaried' }
          ]}
        })

        let test = fm.getPassingCheck()
        expect(test).toEqual(null)
      })

      it('should return null if there are no checks at all', () => {
        fm.setLastAPIresponse({ status: 200,
          data: {categoryChecks: []}
        })

        expect(fm.getPassingCheck()).toEqual(null)
      })

      it('should return null if there is no categoryChecks property', () => {
        fm.setLastAPIresponse({ status: 200,
          data: {categoryChecksX: []}
        })

        expect(fm.getPassingCheck()).toEqual(null)
      })
    })

    describe('getResultSummary', () => {
      it('should get the passing result summary', () => {
        var res = getTestResponse()
        fm.setLastAPIresponse(res)

        var test = fm.getResultSummary()
        expect(test.category).toEqual('A')
      })
    })
  })
})
