var path = require('path');
var merge = require('lodash.merge');
var debounce = require('lodash.debounce');
var isExpired = require('./is-ticket-expired');
var FILENAME = ".mozu.authentication-cache.json";
var HOMEDIR = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var cacheFileName = path.join(HOMEDIR, FILENAME);

function stripExpired(cache) {
  Object.keys(cache).forEach(function(key) {
    if (isExpired(cache[key])) {
      delete cache[key];
    }
  });
}

var HomedirStorage = module.exports = function(fsAdapter, resolution) {

  var cacheMap = {};

  var read = function(cb) {
    return fsAdapter.readFile(cacheFileName, 'utf-8', function(err, txt) {
      try {
        cb(JSON.parse(txt));
      } catch(e) {
        cb({});
      }
    });
  }

  var write = debounce(function(callback) {
    stripExpired(cacheMap);
    fsAdapter.writeFile(cacheFileName, JSON.stringify(cacheMap, null, 2), 'utf-8', callback)
  }, 400);

  return Object.create({
    retrieve: function(key, cb) {
      if (cacheMap[key]) {
        return setImmediate(cb.bind(null, null, cacheMap[key]));
      }
      return read(function(res) {
        if (!err) {
          merge(cacheMap, res)
        }
        return cb(null, cacheMap[key]);
      });
    },
    save: function(key, value, cb) {
      return read(function(err, res) {
        if (err) cb(err);
        merge(cacheMap, res);
        cacheMap[key] = value;
        return write(cb);
      });
    },
    remove: function(key) {
      // todo: a quick queue system
      delete cacheMap[key];
      write(function() {})
    }
  }, {
    constructor: {
      value: HomedirStorage,
      writable: false,
      enumerable: false,
      configurable: false
    }
  });
};