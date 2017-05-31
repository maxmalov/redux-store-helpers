import invariant from 'invariant';
import createAction from 'redux-actions/es/createAction';
import { put, takeLatest, takeEvery, fork, all } from 'redux-saga/es/internal/io';
import { isFunction } from './is';

export function createFetchAction(type, payloadCreator) {
  return createAction(type, payloadCreator, () => ({ cancelPrevious: true }));
}

export function actionDispatcher(actionCreator, payload) {
  invariant(isFunction(actionCreator), '[actionDispatcher]: actionCreator should be function');
  const transformer = isFunction(payload) ? payload : () => payload;
  return function* actionDispatcherSaga(triggerAction) {
    yield put(actionCreator(transformer(triggerAction)));
  };
}

export function composeSaga(saga, options) {
  if (saga.call) return saga;
  const handlers = Array.isArray(saga)
    ? saga
    : Object.keys(saga).map(type => composeActionHandler(type, saga[type], options));
  return function* runSaga() {
    yield all(handlers.map(fn => fork(fn)));
  };
}

export function composeActionHandler(type, handler, options) {
  const matchLatest = matchAction(type, true, options);
  const matchEvery = matchAction(type, false, options);
  const args = Array.isArray(handler) ? handler : [handler];
  return function* handleAction() {
    yield all([
      takeLatest(matchLatest, ...args),
      takeEvery(matchEvery, ...args),
    ]);
  };
}

function matchAction(type, cancelPrevious, { rejectAction = () => false } = {}) {
  const filtered = (action) => action.type !== type || action.error || rejectAction(action);
  return (action) => {
    if (filtered(action)) return false;
    const shouldCancel = action.meta && action.meta.cancelPrevious;
    return shouldCancel ? cancelPrevious : !cancelPrevious;
  };
}
