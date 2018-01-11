'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStoreWithSagas;

var _middleware = require('redux-saga/es/internal/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _channel = require('redux-saga/es/internal/channel');

var _create_store = require('./create_store');

var _create_store2 = _interopRequireDefault(_create_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createStoreWithSagas(rootReducer, initialState) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var sagaMiddleware = (0, _middleware2.default)();
  var middlewares = (options.middlewares || []).concat([sagaMiddleware]);
  var store = (0, _create_store2.default)(rootReducer, initialState, Object.assign({}, options, { middlewares: middlewares }));

  var sagaTasks = [];

  store.runSagas = function (newSagas) {
    store.dispatch(_channel.END);
    return sagaTasks = newSagas.map(sagaMiddleware.run);
  };

  store.endSagas = function endSagas() {
    store.dispatch(_channel.END);
    var tasks = sagaTasks.filter(function (task) {
      return task.isRunning();
    });
    return Promise.all(tasks.map(function (task) {
      return task.done;
    }));
  };

  return store;
}