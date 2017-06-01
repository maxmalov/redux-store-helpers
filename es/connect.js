import invariant from 'invariant';
import mapValues from 'lodash/mapValues';
import bindActionCreators from 'redux/es/bindActionCreators';
import reduxConnect from 'react-redux/es/connect/connect';
import { isObject, isFunction } from './is';

export default function connect(getters, actions, options) {
  const propsBinder = isFunction(getters) ? getters : bindProps(getters);
  const actionsBinder = actions && (isFunction(actions) ? actions : bindActions(actions));
  return reduxConnect(propsBinder, actionsBinder, undefined, options);
}

export function connectActions(actions, options) {
  const actionsBinder = isFunction(actions) ? actions : bindActions(actions);
  return reduxConnect(null, actionsBinder, undefined, options);
}

export function bindProps(getters) {
  invariant(isObject(getters), '[connect]: getters should be an object');
  return function bindStateToProps(state, ownProps) {
    return mapValues(getters, (getter, key) => {
      invariant(isFunction(getter), '[connect]: getter %s should be function', key);
      return getter(state, ownProps);
    })
  };
}

export function bindActions(actions) {
  invariant(isObject(actions), '[connect]: actions should be an object');
  return function bindActionsToDispatch(dispatch) {
    return bindActionCreators(actions, dispatch);
  };
}
