var express = require('express')
var serveStatic = require('serve-static')
var app = express()
var apiRoot = process.env.API_ROOT || 'http://localhost:8081'
var uiBaseUrl = '/incomeproving/v2/'
var apiBaseUrl = apiRoot + '/incomeproving/v2/'
var request = require('request')
var port = process.env.SERVER_PORT || '8000'
var moment = require('moment')
var uuid = require('uuid/v4')
var fs = require('fs')

// required when running BDDs to force to root directory
var path = require('path')
process.chdir(path.resolve(__dirname))


var stdRelay = function (req, res, uri, qs) {
  var headers = {}
  if (req.headers['x-auth-userid']) {
    headers['x-auth-userid'] = req.headers['x-auth-userid']
  }

  if (req.headers['kc-access']) {
    headers['kc-access'] = req.headers['kc-access']
  }

  headers['x-correlation-id'] = uuid()
  var opts = {uri: uri, qs: qs, headers: headers}
  opts = addCaCertsForHttps(opts, headers)
  // console.log(opts)

  request(opts, function (error, response, body) {
    var status = (response && response.statusCode) ? response.statusCode : 500
    if ((body === '' || body === '""') && status === 200) {
      status = 500
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(status)
    res.send(body)

    if (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('ERROR: Connection refused', uri)
      } else {
        console.log('ERROR', error)
      }
    }
  })
}

app.use(serveStatic('public/', { 'index': ['index.html'] }))

app.listen(port, function () {
  console.log('ui on:' + port)
  console.log('apiRoot is:' + apiRoot)
})

app.get('/ping', function (req, res) {
  res.send('')
})

app.get('/healthz', function (req, res) {
  res.send({env: process.env.ENV, status: 'OK'})
})

app.get(uiBaseUrl + 'availability', function (req, res) {
  stdRelay(req, res, apiRoot + '/healthz', '')
})

app.get(uiBaseUrl + 'individual/:nino/financialstatus', function (req, res) {
  stdRelay(req, res, apiBaseUrl + 'individual/' + req.params.nino + '/financialstatus', req.query)
})

function addCaCertsForHttps (opts, headers) {
  log("About to call " + opts.uri, headers)
  if (opts.uri && opts.uri.toLowerCase().startsWith('https')) {
    log("Loading certs from  " + process.env.CA_CERTS_PATH, headers)
    opts.agentOptions = {
      ca: fs.readFileSync(process.env.CA_CERTS_PATH)
    }
    opts.ca = fs.readFileSync(process.env.CA_CERTS_PATH)
  }
  log("Request opts  " + JSON.stringify(opts), headers)
  return opts
}

function log(message, headers) {
  var logMessage = {
    message: message,
    'x-correlation-id': headers['x-correlation-id'],
    'x-auth-userid': headers['x-auth-userid']
  }

  console.log(JSON.stringify(logMessage))
}
