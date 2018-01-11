'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPath = undefined;

var _is = require('./is');

var getPath = exports.getPath = function getPath(path) {
  return path.length > 1 ? function (value) {
    var res = value;
    for (var i = 0; i < path.length; i += 1) {
      if ((0, _is.isNil)(res)) return undefined;
      res = res[path[i]];
    }
    return res;
  } : function (value) {
    return (0, _is.isNil)(value) ? undefined : value[path[0]];
  };
};

exports.default = function (name) {
  return getPath(Array.isArray(name) ? name : name.split('.'));
};