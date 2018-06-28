/* global _ angular */

var ioModule = angular.module('hod.io', [])

ioModule.factory('IOService', ['$http', '$state', function ($http, $state) {
  var me = this

  this.getConf = function (conf) {
    var result = {}
    if (!conf) {
      return result
    }
    return _.extend(result, conf)
  }

  this.get = function (url, data, conf) {
    conf = me.getConf(conf)
    if (data) {
      conf.params = data
    }

    var req = $http.get(url, conf)
    return req
  }

  this.post = function (url, data, conf) {
    conf = me.getConf(conf)
    return $http.post(url, data, conf)
  }

  return this
}])
