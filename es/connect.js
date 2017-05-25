import invariant from 'invariant';
import bindActionCreators from 'redux/es/bindActionCreators';
import reduxConnect from 'react-redux/es/connect/connect';
import { isObject, isFunction } from './is';

export default function connect(props, actions, options) {
  return reduxConnect(bindProps(props), actions && bindActions(actions), undefined, options);
}

export function connectActions(actions, options) {
  return reduxConnect(null, bindActions(actions), undefined, options);
}

export function bindProps(props) {
  invariant(isObject(props), '[connect]: getters should be an object');
  return function bindStateToProps(state) {
    const boundProps = {};
    Object.keys(props).forEach((prop) => {
      const getter = props[prop];
      invariant(isFunction(getter), '[connect]: getter %s should be function', prop);
      boundProps[prop] = getter.length > 1
        ? (...args) => getter(state, ...args)
        : getter(state);
    });
    return boundProps;
  };
}

export function bindActions(actions) {
  invariant(isObject(actions), '[connect]: actions should be an object');
  return function bindActionsToDispatch(dispatch) {
    return bindActionCreators(actions, dispatch);
  };
}
