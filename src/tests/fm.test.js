/* global describe it beforeEach inject _ expect moment */

describe('app: hod.proving', function () {
  beforeEach(module('hod.proving'))
  beforeEach(module('hod.familymigration'))

  describe('FamilymigrationService', function () {
    var fm

    beforeEach(inject(function (FamilymigrationService) {
      fm = FamilymigrationService
    }))

    describe('getFamilyDetails', function () {
      it('should get the details object', function () {
        var testObj = fm.getFamilyDetails()
        expect(testObj.nino).toEqual('')
        expect(testObj.applicationRaisedDate).toEqual('')
        expect(testObj.dependants).toEqual('')
      })
    })
  })
})
