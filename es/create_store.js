import reduxCreateStore from 'redux/es/createStore';
import applyMiddleware from 'redux/es/applyMiddleware';
import reduxCompose from 'redux/es/compose';

export default function createStore(rootReducer, initialState, {
  compose = reduxCompose,
  middlewares = [],
}) {
  return reduxCreateStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
    ),
  );
}
