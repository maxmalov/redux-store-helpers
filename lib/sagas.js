'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.createFetchAction = createFetchAction;
exports.actionDispatcher = actionDispatcher;
exports.composeSaga = composeSaga;
exports.composeActionHandler = composeActionHandler;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _createAction = require('redux-actions/es/createAction');

var _createAction2 = _interopRequireDefault(_createAction);

var _io = require('redux-saga/es/internal/io');

var _is = require('./is');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createFetchAction(type, payloadCreator) {
  return (0, _createAction2.default)(type, payloadCreator, function () {
    return { cancelPrevious: true };
  });
}

function actionDispatcher(actionCreator, payload) {
  (0, _invariant2.default)((0, _is.isFunction)(actionCreator), '[actionDispatcher]: actionCreator should be function');
  var transformer = (0, _is.isFunction)(payload) ? payload : function () {
    return payload;
  };
  return (/*#__PURE__*/_regenerator2.default.mark(function actionDispatcherSaga(triggerAction) {
      return _regenerator2.default.wrap(function actionDispatcherSaga$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _io.put)(actionCreator(transformer(triggerAction)));

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, actionDispatcherSaga, this);
    })
  );
}

function composeSaga(saga, options) {
  if (saga.call) return saga;
  var handlers = Array.isArray(saga) ? saga : Object.keys(saga).map(function (type) {
    return composeActionHandler(type, saga[type], options);
  });
  return (/*#__PURE__*/_regenerator2.default.mark(function runSaga() {
      return _regenerator2.default.wrap(function runSaga$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _io.all)(handlers.map(function (fn) {
                return (0, _io.fork)(fn);
              }));

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, runSaga, this);
    })
  );
}

function composeActionHandler(type, handler, options) {
  var matchLatest = matchAction(type, true, options);
  var matchEvery = matchAction(type, false, options);
  var args = Array.isArray(handler) ? handler : [handler];
  return (/*#__PURE__*/_regenerator2.default.mark(function handleAction() {
      return _regenerator2.default.wrap(function handleAction$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _io.all)([_io.takeLatest.apply(undefined, [matchLatest].concat(_toConsumableArray(args))), _io.takeEvery.apply(undefined, [matchEvery].concat(_toConsumableArray(args)))]);

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, handleAction, this);
    })
  );
}

function matchAction(type, cancelPrevious) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$rejectAction = _ref.rejectAction,
      rejectAction = _ref$rejectAction === undefined ? function () {
    return false;
  } : _ref$rejectAction;

  var filtered = function filtered(action) {
    return action.type !== type || action.error || rejectAction(action);
  };
  return function (action) {
    if (filtered(action)) return false;
    var shouldCancel = action.meta && action.meta.cancelPrevious;
    return shouldCancel ? cancelPrevious : !cancelPrevious;
  };
}