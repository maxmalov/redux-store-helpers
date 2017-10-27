import createSagaMiddleware from 'redux-saga/es/internal/middleware';
import { END as END_SAGAS } from 'redux-saga/es/internal/channel';

import createStore from './create_store';

export default function createStoreWithSagas(rootReducer, initialState, options = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = (options.middlewares || []).concat([sagaMiddleware]);
  const store = createStore(rootReducer, initialState, { ...options, middlewares });

  let sagaTasks = [];

  store.runSagas = (newSagas) => {
    store.dispatch(END_SAGAS);
    return sagaTasks = newSagas.map(sagaMiddleware.run);
  };

  store.endSagas = function endSagas() {
    store.dispatch(END_SAGAS);
    const tasks = sagaTasks.filter(task => task.isRunning());
    return Promise.all(tasks.map(task => task.done));
  };

  return store;
}
