import invariant from 'invariant';
import mapValues from 'lodash/mapValues';
import bindActionCreators from 'redux/es/bindActionCreators';
import reduxConnect from 'react-redux/es/connect/connect';
import { isObject, isFunction } from './is';

export default function connect(getters, actions, options) {
  const propsBinder = isFunction(getters) ? getters : bindProps(getters);
  const actionsBinder = actions && bindActions(actions);
  return reduxConnect(propsBinder, actionsBinder, undefined, options);
}

export function connectActions(actions, options) {
  return reduxConnect(null, bindActions(actions), undefined, options);
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
  invariant(isObject(actions) || isFunction(actions), '[connect]: actions should be an object of function');
  return isFunction(actions)
    ? (dispatch, props) => bindActionCreators(actions(props, dispatch), dispatch)
    : (dispatch) => bindActionCreators(actions, dispatch);
}
