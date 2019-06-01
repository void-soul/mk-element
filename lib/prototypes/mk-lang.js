import patterns from '../datas/mk-patterns';
const _empty = ooo => {
  Object.keys(ooo).forEach(key => {
    ooo[key] = null;
  });
};
const _emptyIf = ooo => {
  Object.keys(ooo).forEach(key => {
    if (ooo[key] === '') ooo[key] = null;
  });
};
const _promise = function({ fn, target, nodejs = true, last = true }) {
  return (...args) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      args[last === true ? 'push' : 'unshift']((err, ...data) => {
        if (nodejs === false) {
          return resolve.apply(this, [err, ...data]);
        }
        if (err === null || err === undefined) {
          return resolve.apply(this, data);
        }
        return reject(err);
      });
      if (target) {
        fn.apply(target, args);
      } else {
        fn.apply(null, args);
      }
    });
  };
};
const _sleep = function(time) {
  // eslint-disable-next-line no-undef
  return new Promise(resolve => setTimeout(resolve, time));
};
const install = Vue => {
  Vue.prototype.$empty = _empty;
  Vue.prototype.$emptyIf = _emptyIf;
  Vue.prototype.$promise = _promise;
  Vue.prototype.$sleep = _sleep;
  Vue.prototype.$pattern = patterns;
};
export default {
  install
};
