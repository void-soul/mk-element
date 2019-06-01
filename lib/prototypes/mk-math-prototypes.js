import util from '../utils/mk-number-util';

const install = Vue => {
  Vue.prototype.$mathMoney = (value, prefix, def) => {
    return util.money(value, prefix, def);
  };
  Vue.prototype.$mathMoneyIf = (value, flag = true, prefix, def) => {
    if (flag === true) {
      return util.money(value, prefix, def);
    } else {
      return value;
    }
  };
  Vue.prototype.$mathAdd = (...args) => {
    return util.add(...args);
  };
  Vue.prototype.$mathRound = (value, numDigits, upOrDown) => {
    return util.round(value, numDigits, upOrDown);
  };
  Vue.prototype.$mathSub = (...args) => {
    return util.sub(...args);
  };
  Vue.prototype.$mathDiv = (...args) => {
    return util.div(...args);
  };
  Vue.prototype.$mathMul = (...args) => {
    return util.mul(...args);
  };
  Vue.prototype.$mathMax = (...args) => {
    return util.max(...args);
  };
  Vue.prototype.$mathMin = (...args) => {
    return util.min(...args);
  };
};
export default {
  install
};
