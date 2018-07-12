/* global describe it beforeEach inject _ expect */

const getTestIndividual = (n) => {
  switch (n) {
    case 'Bilbo':
      return {
        forename: 'Bilbo',
        surname: 'Baggins',
        nino: 'BB123456B',
        dateOfBirth: '1970-05-13',
        employers: ['Bag End', 'The Dwarves', 'Rivendell']
      }
    case 'Gandalf':
      return {
        forename: 'Gandalf',
        surname: 'Mithrandir',
        nino: 'GG123456G',
        dateOfBirth: '1920-06-01',
        employers: ['The Dwarves', 'The Fellowship of the Ring']
      }
    case 'Gollum':
      return {
        forename: 'Gollum',
        surname: 'Smeegol',
        nino: 'GO123456M',
        dateOfBirth: '1800-01-01',
        employers: ['The Ring']
      }
  }
}

const getTestCheck = (pass, cat, type) => {
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
      }
    ]
  }
}

const getSearchIndividuals = (applicant, partner) => {
  let individuals = []
  individuals.push(getTestIndividual(applicant))
  if (partner) {
    individuals.push(getTestIndividual(partner))
  }
  return individuals
}

const getTestResponse = (applicant, partner) => {
  let applicantObj = getTestIndividual(applicant)
  let partnerObj = partner ? getTestIndividual(partner) : null
  let data = {
    individuals: [
      applicantObj
    ],
    categoryChecks: [
      getTestCheck(false, 'B', 'non-salaried'),
      getTestCheck(true, 'A', 'salaried'),
      getTestCheck(false, 'B', 'joint salaried')
    ]
  }

  _.each(data.categoryChecks, (c) => {
    c.individuals[0] = {
      nino: applicantObj.nino,
      employers: applicantObj.employers
    }

    if (partnerObj) {
      c.individuals[1] = {
        nino: partnerObj.nino,
        employers: partnerObj.employers
      }
    }
  })

  if (partnerObj) {
    data.individuals.push(partnerObj)
  }

  return { data }
}

const getTestSearchAndResponse = (fm, applicant, partner) => {
  let testObj = fm.getSearch()
  testObj.applicationRaisedDate = '2018-05-13'
  testObj.dependants = 2
  testObj.individuals = getSearchIndividuals(applicant, partner)

  fm.setLastAPIresponse(getTestResponse(applicant, partner))
  return testObj
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

    describe('removePartner', () => {
      it('should be able to remove the second individual it has added', () => {
        let testObj = fm.getSearch()
        fm.addPartner()
        expect(testObj.individuals.length).toEqual(2)
        fm.removePartner()
        expect(testObj.individuals.length).toEqual(1)
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

    describe('haveResult', () => {
      it('should be able to determine if we have data for a result', () => {
        expect(fm.haveResult()).toBeFalsy()
        fm.setLastAPIresponse({ })
        expect(fm.haveResult()).toBeFalsy()
        fm.setLastAPIresponse({ data: {} })
        expect(fm.haveResult()).toBeFalsy()
        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: [{ passed: false }]} })
        expect(fm.haveResult()).toBeTruthy()
      })

      it('should be able to determine if we result data is not right', () => {
        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: []} })
        expect(fm.haveResult()).toBeFalsy()
        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: 'abc'} })
        expect(fm.haveResult()).toBeFalsy()
        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: [{abc: 'abc'}]} })
        expect(fm.haveResult()).toBeTruthy()
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

    describe('getCheckWithMostApplicants', () => {
      it('should be able to return the first check or null', () => {
        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: [ {data: 'a', individuals: [{p: '1'}, {p: '2'}]}, {data: 'b', individuals: [{ p: '1'}]}, {data: 'c', individuals: [{p: '1'}]} ]} })
        let testObj = fm.getCheckWithMostApplicants()
        expect(testObj.data).toEqual('a')

        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: [ {data: 'b', individuals: [{ p: '1'}]}, {data: 'c', individuals: [{ p: '1'}, {p: '2'}]}]} })
        testObj = fm.getCheckWithMostApplicants()
        expect(testObj.data).toEqual('c')

        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: [{ data: 'c' }]} })
        testObj = fm.getCheckWithMostApplicants()
        expect(testObj.data).toEqual('c')

        fm.setLastAPIresponse({ status: 200, data: {categoryChecks: []} })
        testObj = fm.getCheckWithMostApplicants()
        expect(testObj).toEqual(null)
      })
    })

    describe('getResultSummary', () => {
      it('should get the passing result summary', () => {
        var res = getTestResponse('Bilbo')
        fm.setLastAPIresponse(res)

        var test = fm.getResultSummary()
        expect(test.category).toEqual('A')
      })
    })

    describe('getCopyPasteSummary JOINT', () => {
      beforeEach(() => {
        getTestSearchAndResponse(fm, 'Bilbo', 'Gollum')
      })

      it('should get a text summary when copy function is used', () => {
        let txt = fm.getCopyPasteSummary()
        expect(typeof txt).toEqual('string')
      })

      it('should summarise the application result', () => {
        let txt = fm.getCopyPasteSummary(true)
        expect(typeof txt).toEqual('object')
        expect(txt[0]).toEqual('PASSED')
        expect(txt[1]).toEqual('Bilbo Baggins meets the Income Proving requirement')
        expect(txt[3]).toEqual('RESULTS')
      })

      it('should summarise the main applicant', () => {
        let txt = fm.getCopyPasteSummary(true)
        expect(txt[4]).toEqual('Bilbo Baggins')
        expect(txt[5][0]).toEqual('Income within date range:')
        expect(txt[5][1]).toEqual('03/07/2014 - 03/01/2015')
        expect(txt[6][0]).toEqual('Employers:')
        expect(txt[6][1]).toEqual('Bag End')
        expect(txt[7][1]).toEqual('The Dwarves')
        expect(txt[8][1]).toEqual('Rivendell')
      })

      it('should summarise the partner', () => {
        let txt = fm.getCopyPasteSummary(true)
        expect(txt[9]).toEqual('Gollum Smeegol')
        expect(txt[10][0]).toEqual('Income within date range:')
        expect(txt[10][1]).toEqual('03/07/2014 - 03/01/2015')
        expect(txt[11][0]).toEqual('Employers:')
        expect(txt[11][1]).toEqual('The Ring')
      })

      it('should summarise the search criteria: applicant', () => {
        let txt = fm.getCopyPasteSummary(true)
        expect(txt[14]).toEqual('SEARCH CRITERIA')
        expect(txt[15]).toEqual('APPLICANT:')
        expect(txt[16][0]).toEqual('First name:')
        expect(txt[16][1]).toEqual('Bilbo')
        expect(txt[17][0]).toEqual('Surname:')
        expect(txt[17][1]).toEqual('Baggins')
        expect(txt[18][0]).toEqual('Date of birth:')
        expect(txt[18][1]).toEqual('13/05/1970')
        expect(txt[19][0]).toEqual('National Insurance number:')
        expect(txt[19][1]).toEqual('BB123456B')
      })

      it('should summarise the search criteria: partner', () => {
        let txt = fm.getCopyPasteSummary(true)
        expect(txt[21]).toEqual('PARTNER:')
        expect(txt[22][0]).toEqual('First name:')
        expect(txt[22][1]).toEqual('Gollum')
        expect(txt[23][0]).toEqual('Surname:')
        expect(txt[23][1]).toEqual('Smeegol')
        expect(txt[24][0]).toEqual('Date of birth:')
        expect(txt[24][1]).toEqual('01/01/1800')
        expect(txt[25][0]).toEqual('National Insurance number:')
        expect(txt[25][1]).toEqual('GO123456M')
      })

      it('should summarise the basic search criteria', () => {
        let txt = fm.getCopyPasteSummary(true)
        expect(txt[27][0]).toEqual('Dependants:')
        expect(txt[27][1]).toEqual(2)
        expect(txt[28][0]).toEqual('Application raised:')
        expect(txt[28][1]).toEqual('13/05/2018')
      })
    })

    describe('getCopyPasteSummary SINGLE', () => {
      beforeEach(() => {
        getTestSearchAndResponse(fm, 'Gandalf')
        let txt = fm.getCopyPasteSummary()
      })

      it('should get a text summary when copy function is used', () => {
        let txt = fm.getCopyPasteSummary(true)
        expect(txt[10]).toEqual('SEARCH CRITERIA')
        expect(txt[17][0]).toEqual('Dependants:')
      })
    })

    describe('getNotFoundNino', () => {
      it('should return the correct nino', () => {
        expect(fm.getNotFoundNino('Resource not found: RK123****', 'RK123456C', 'AB123456A')).toEqual('RK123456C')
        expect(fm.getNotFoundNino('Resource not found: AB123****', 'RK123456C', 'AB123456A')).toEqual('AB123456A')
        expect(fm.getNotFoundNino('Resource not found: XX123****', 'RK123456C', 'AB123456A')).toEqual('RK123456C')
        expect(fm.getNotFoundNino('Resource not found: RK123****', 'RK123456C', '')).toEqual('RK123456C')
      })
    })
  })
})
