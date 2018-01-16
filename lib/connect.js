'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connect;
exports.connectActions = connectActions;
exports.bindProps = bindProps;
exports.bindActions = bindActions;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _bindActionCreators = require('redux/lib/bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _connect = require('react-redux/lib/connect/connect');

var _connect2 = _interopRequireDefault(_connect);

var _is = require('./is');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connect(getters, actions, options) {
  var propsBinder = (0, _is.isFunction)(getters) ? getters : bindProps(getters);
  var actionsBinder = actions && bindActions(actions);
  return (0, _connect2.default)(propsBinder, actionsBinder, undefined, options);
}

function connectActions(actions, options) {
  return (0, _connect2.default)(null, bindActions(actions), undefined, options);
}

function bindProps(getters) {
  (0, _invariant2.default)((0, _is.isObject)(getters), '[connect]: getters should be an object');
  var keys = Object.keys(getters);
  keys.forEach(function (key) {
    return (0, _invariant2.default)((0, _is.isFunction)(getters[key]), '[connect]: getter %s should be function', key);
  });
  return function bindStateToProps(state, ownProps) {
    var bound = {};
    keys.forEach(function (key) {
      return bound[key] = getters[key](state, ownProps);
    });
    return bound;
  };
}

function bindActions(actions) {
  (0, _invariant2.default)((0, _is.isObject)(actions) || (0, _is.isFunction)(actions), '[connect]: actions should be an object or function');
  return (0, _is.isFunction)(actions) ? function (dispatch, props) {
    return (0, _bindActionCreators2.default)(actions(props, dispatch), dispatch);
  } : function (dispatch) {
    return (0, _bindActionCreators2.default)(actions, dispatch);
  };
}