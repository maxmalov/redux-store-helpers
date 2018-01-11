'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bind;
exports.bindReducers = bindReducers;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _property = require('./property');

var _property2 = _interopRequireDefault(_property);

var _is = require('./is');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bind(reducer) {
  var stateGetter = function stateGetter() {
    return undefined;
  };

  function binder(propName) {
    (0, _invariant2.default)((0, _is.isString)(propName) && propName.length > 0, '[bind]: state prop should be non empty string');
    stateGetter = (0, _property2.default)(propName);
    return reducer;
  }

  function get(state) {
    return stateGetter(state);
  }

  function wrapper(getter, name) {
    (0, _invariant2.default)((0, _is.isFunction)(getter), '[bind]: state getter %s should be function', name || getter);
    return getter.length > 1 ? function (state, arg) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return getter.apply(undefined, [stateGetter(state), arg].concat(args));
    } : function (state) {
      return getter(stateGetter(state));
    };
  }

  function wrapAll(getters) {
    (0, _invariant2.default)((0, _is.isObject)(getters), '[bind]: state getters should be object');
    var wrapped = {};
    Object.keys(getters).forEach(function (key) {
      wrapped[key] = wrapper(getters[key], key);
    });
    return wrapped;
  }

  return { binder: binder, wrapper: wrapper, wrapAll: wrapAll, get: get };
}

function bindReducers(binders) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var reducers = {};
  Object.keys(binders).forEach(function (name) {
    var binder = binders[name];
    (0, _invariant2.default)((0, _is.isFunction)(binder), '[bind]: reducer binder %s should be function', name);
    var reducer = binder(prefix + name);
    (0, _invariant2.default)((0, _is.isFunction)(reducer), '[bind]: reducer %s should be function', name);
    reducers[name] = reducer;
  });
  return reducers;
}