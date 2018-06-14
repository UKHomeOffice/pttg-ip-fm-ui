var express = require('express')
var serveStatic = require('serve-static')
var app = express()
var apiRoot = process.env.API_ROOT || 'http://localhost:8050'
var feedbackRoot = process.env.FEEDBACK_ROOT || 'http://localhost:8082'
var httpauth = process.env.IP_API_AUTH || ''
var uiBaseUrl = '/incomeproving/v2/'
var apiBaseUrl = apiRoot + '/incomeproving/v2/'
var feedbackBaseUrl = feedbackRoot + '/feedback'
var request = require('request')
var port = process.env.SERVER_PORT || '8000'
// PROXY_DISCOVERY_URL eg https://sso.digital.homeoffice.gov.uk/auth/realms/pttg-qa or pttg-production
var PROXY_DISCOVERY_URL = process.env.PROXY_DISCOVERY_URL || ''
var PROXY_REDIRECTION_URL = process.env.PROXY_REDIRECTION_URL || ''
var moment = require('moment')
var uuid = require('uuid/v4')
var fs = require('fs')
var _ = require('underscore')
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// required when running BDDs to force to root directory
var path = require('path')
process.chdir(path.resolve(__dirname))

var addSecureHeaders = function (res) {
  res.setHeader('Cache-control', 'no-store, no-cache')
}

var stdRelay = function (req, res, uri, qs, postdata) {
  var headers = {}

  addSecureHeaders(res)

  if (req.headers['x-auth-userid']) {
    headers['x-auth-userid'] = req.headers['x-auth-userid']
  }

  if (req.headers['kc-access']) {
    headers['kc-access'] = req.headers['kc-access']
  }

  if (httpauth) {
    headers['Authorization'] = 'Basic ' + new Buffer(httpauth).toString('base64')
  }

  headers['x-correlation-id'] = uuid()
  var opts = {
    uri: uri,
    qs: qs,
    headers: headers,
    followRedirect: false
  }
  opts = addCaCertsForHttps(opts, headers)

  if (postdata) {
    opts.method = 'POST'
    opts.json = true
    opts.headers['content-type'] = 'application/json'
    opts.body = postdata
    // console.log(opts.body)
  }

  console.log(moment().toISOString(), 'REQUEST', headers['x-correlation-id'], opts.method, opts.uri)
  request(opts, function (error, response, body) {
    var status = (response && response.statusCode) ? response.statusCode : 500
    if ((body === '' || body === '""') && status === 200) {
      status = 500
    }

    console.log(moment().toISOString(), 'RESPONSE', headers['x-correlation-id'], opts.method, opts.uri, status, error)
    console.log(body)

    res.setHeader('Content-Type', 'application/json')
    res.status(status)
    res.send(body)

    if (error) {
      console.log(headers['x-correlation-id'], body)
      if (error.code === 'ECONNREFUSED') {
        console.log('ERROR: Connection refused', uri)
      } else {
        console.log('ERROR', error)
      }
    }
  })
}

app.use(serveStatic('public/', { 'index': ['index.html'], setHeaders: addSecureHeaders }))

app.listen(port, function () {
  console.log('ui on:' + port)
  console.log('apiRoot is:' + apiRoot)
})

app.get('/ping', function (req, res) {
  res.send('')
})

app.get('/logout', function (req, res) {
  if (!PROXY_REDIRECTION_URL || !PROXY_DISCOVERY_URL) {
    // NB: same as when the KC session has timed out
    res.statusCode = 307
    res.send()
    return
  }
  let url = PROXY_REDIRECTION_URL + '/oauth/logout?redirect=' + encodeURIComponent(PROXY_DISCOVERY_URL + '/protocol/openid-connect/logout?post_logout_redirect_uri=' + PROXY_REDIRECTION_URL)
  res.setHeader('Content-Type', 'application/json')
  res.send({logout: url})
})

app.get('/healthz', function (req, res) {
  res.send({env: process.env.ENV, status: 'OK'})
})

app.get(uiBaseUrl + 'availability', function (req, res) {
  stdRelay(req, res, apiRoot + '/healthz', '')
})

app.post(uiBaseUrl + 'individual/financialstatus', function (req, res) {
  stdRelay(req, res, apiBaseUrl + 'individual/financialstatus', '', req.body)
})

app.post(uiBaseUrl + 'feedback', function (req, res) {
  stdRelay(req, res, feedbackBaseUrl, '', req.body)
})

app.all('*', function (req, res, next) {
  // ### 404 ###

  if (req.url.toLowerCase().startsWith('/oauth')) {
    console.log('404 -> 307', req.method, req.url)
    res.status(307)
  } else {
    console.log(404, req.method, req.url)
    res.status(404)
  }
  res.send('404')
})

function addCaCertsForHttps (opts, headers) {
  // log("About to call " + opts.uri, headers)
  if (opts.uri && opts.uri.toLowerCase().startsWith('https')) {
    // log("Loading certs from  " + process.env.CA_CERTS_PATH, headers)
    opts.ca = fs.readFileSync(process.env.CA_CERTS_PATH, 'utf8')
    // DSP certs do not include root ca - so we can not validate entire chain that OpenSSL requires
    // so until we have entire chain in bundle lets not be strict
    opts.strictSSL = false
  }
  return opts
}

function log (message, headers) {
  var logMessage = {
    message: message,
    'x-correlation-id': headers['x-correlation-id'],
    'x-auth-userid': headers['x-auth-userid']
  }

  console.log(JSON.stringify(logMessage))
}
