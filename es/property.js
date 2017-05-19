import { isNil } from './is';

export const getPath = path => (
  path.length > 1
  ? (value) => {
    let res = value;
    for (let i = 0; i < path.length; i += 1) {
      if (isNil(res)) return undefined;
      res = res[path[i]];
    }
    return res;
  }
  : value => isNil(value) ? undefined : value[path[0]]
);

export default name => getPath(Array.isArray(name) ? name : name.split('.'));
