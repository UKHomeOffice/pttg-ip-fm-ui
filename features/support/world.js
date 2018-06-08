// require OUR APPLICATION THAT WE'RE TESTING
require('../../server.js')
//

require('chromedriver')

var mockdata = require('../step_definitions/mockdata')
var seleniumWebdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var {defineSupportCode} = require('cucumber')
var globalDriver
var path = require('path')
var reportPath = path.resolve('report/')

// config
var shareBrowserInstances = true
var browserName = 'chrome'
var headless = (process.env.HEADLESS !== false && process.env.HEADLESS !== 'false')
//

var getNewBrowser = function (name) {
  var builder = new seleniumWebdriver.Builder()
  var opts = new chrome.Options()
  if (headless) {
    opts.addArguments(['headless', 'no-sandbox'])
  }
  opts.addArguments('disable-extensions')
  // opts.setChromeBinaryPath('/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary')
  builder.setChromeOptions(opts)

  var forBrowser = builder.forBrowser(name)

  var driver = forBrowser.build()
  return driver
}

if (shareBrowserInstances) {
  globalDriver = getNewBrowser(browserName)
}

function CustomWorld (done) {
  mockdata.clearAll()

  this.driver = shareBrowserInstances ? globalDriver : getNewBrowser(browserName)
  this.defaults = {
    dateOfBirth: '04/05/1980',
    forename: 'Ant',
    surname: 'Dec',
    applicationRaisedDate: '01/05/2016',
    dependants: '0',
    nino: 'AA123456A'
  }
  this.driver.get('http://127.0.0.1:8000/#!/fs/').then(done)
}

defineSupportCode(function ({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
})

defineSupportCode(function ({registerHandler}) {
  registerHandler('AfterFeatures', function (features, callback) {
    callback()
  })
})

defineSupportCode(function ({setDefaultTimeout}) {
  setDefaultTimeout(60 * 1000)
})
