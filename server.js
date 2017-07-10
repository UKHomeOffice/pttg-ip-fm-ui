var express = require('express')
var serveStatic = require('serve-static')
var app = express()
var apiRoot = process.env.API_ROOT || 'http://localhost:8080'
var uiBaseUrl = '/incomeproving/v1/'
var apiBaseUrl = apiRoot + '/v1/'
var request = require('request')
var port = process.env.SERVER_PORT || '8000'
var moment = require('moment')

// required when running BDDs to force to root directory
var path = require('path')
process.chdir(path.resolve(__dirname))

var stdRelay = function (res, uri, qs) {
  request({uri: uri, qs: qs}, function (error, response, body) {
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
  stdRelay(res, apiRoot + '/healthz', '')
})

app.get(uiBaseUrl + ':tier/threshold', function (req, res) {
  stdRelay(res, apiBaseUrl + req.params.tier + '/maintenance/threshold', req.query)
})
