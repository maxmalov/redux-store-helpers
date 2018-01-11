'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;

var _createStore = require('redux/es/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _applyMiddleware = require('redux/es/applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('redux/es/compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createStore(rootReducer, initialState, _ref) {
  var _ref$compose = _ref.compose,
      compose = _ref$compose === undefined ? _compose2.default : _ref$compose,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === undefined ? [] : _ref$middlewares;

  return (0, _createStore2.default)(rootReducer, initialState, compose(_applyMiddleware2.default.apply(undefined, _toConsumableArray(middlewares))));
}