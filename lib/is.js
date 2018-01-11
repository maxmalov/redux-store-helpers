'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isFunction = isFunction;
exports.isString = isString;
exports.isObject = isObject;
exports.isNil = isNil;
function isFunction(fn) {
  return typeof fn === 'function';
}

function isString(str) {
  return typeof str === 'string';
}

function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function isNil(obj) {
  return obj == null;
}