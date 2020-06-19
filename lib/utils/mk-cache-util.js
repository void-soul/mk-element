import { Base64 } from 'js-base64';
import md5 from 'md5';

const __guid = () => {
  const c = new Date();
  let b = String(c.getSeconds());
  let d = String(c.getMinutes());
  let e = String(c.getMilliseconds());

  for (let i = b.length, j = 2; i < j; i++) {
    b = '0' + b;
  }
  for (let i = d.length, j = 2; i < j; i++) {
    d = '0' + d;
  }
  for (let i = e.length, j = 3; i < j; i++) {
    e = '0' + e;
  }
  return (
    b +
    d +
    e +
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
    (((1 + Math.random()) * 0x10000) | 0).toString(16)
  );
};
export const guid = (time = 1) => {
  let result = '';

  for (let i = 0; i < time; i++) {
    result += __guid();
  }
  return result.toUpperCase();
};
const _SPLIT = '^*^';
const _SCRIT = 'O0o1IliI01lIl0oooOOO';
export let productMode;
const _set = (key, value) => {
  if (productMode === true) {
    const randomKey = guid();
    const saveTime = Number(new Date());
    const signToken = md5(key + saveTime + randomKey + value + _SCRIT);

    value = signToken + _SPLIT + saveTime + _SPLIT + randomKey + _SPLIT + value;
    window.sessionStorage.setItem(key, Base64.encode(value));
  } else {
    window.sessionStorage.setItem(key, value);
  }
};
const _get = (key) => {
  let value = window.sessionStorage.getItem(key);
  if (value && productMode === true) {
    value = Base64.decode(value);
    value = value.split(_SPLIT);
    if (value.length === 4) {
      const signToken = value[0];
      const saveTime = value[1];
      const randomKey = value[2];
      const value_ = value[3];
      const sign = md5(key + saveTime + randomKey + value_ + _SCRIT);

      if (signToken === sign) {
        return value_;
      }
    }
  } else {
    return value;
  }
};
export const keys = {
  user: 'oo0OOO0o',
  menus: 'O0o0OOoo',
  config: 'oO0o0O00',
  tabs: 'oOoo0Ooo',
  dataPermission: 'ooOO00Oo',
  uris: '00ooOOoo',
  devid: 'xxxx98'
};
export const set = (name, content) => {
  if (!name) {
    return;
  }
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  _set(name, content);
};
export const get = (name) => {
  if (!name) {
    return;
  }
  return _get(name);
};
export const remove = (name) => {
  if (!name) {
    return;
  }
  window.sessionStorage.removeItem(name);
};
export const clear = () => {
  window.sessionStorage.clear();
};
export default {
  keys,
  set,
  get,
  remove,
  clear,
  productMode,
  guid
};
