import reduxCreateStore from 'redux/es/createStore';
import applyMiddleware from 'redux/es/applyMiddleware';
import reduxCompose from 'redux/es/compose';
import createSagaMiddleware from 'redux-saga/es/internal/middleware';
import { END as END_SAGAS } from 'redux-saga/es/internal/channel';

export default function createStore(rootReducer, initialState, {
  compose = reduxCompose,
  middlewares = [],
}) {
  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const store = reduxCreateStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
    ),
  );

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
