import util from '../utils/mk-number-util';

const install = Vue => {
  Vue.filter('mathMoney', (value, style, currency, prefix, def) => {
    return util.money(value, style, currency, prefix, def);
  });
  Vue.filter(
    'mathMoneyIf',
    (value, flag = true, style, currency, prefix, def) => {
      if (flag === true) {
        return util.money(value, style, currency, prefix, def);
      } else {
        return value;
      }
    }
  );
  Vue.filter('mathAdd', (value, ...args) => {
    return util.add(value, ...args);
  });
  Vue.filter('mathRound', (value, numDigits, upOrDown) => {
    return util.round(value, numDigits, upOrDown);
  });
  Vue.filter('mathSub', (value, ...args) => {
    return util.sub(value, ...args);
  });
  Vue.filter('mathDiv', (value, ...args) => {
    return util.div(value, ...args);
  });
  Vue.filter('mathMul', (value, ...args) => {
    return util.mul(value, ...args);
  });
  Vue.filter('mathMax', (value, ...args) => {
    return util.max(value, ...args);
  });
  Vue.filter('mathMin', (value, ...args) => {
    return util.min(value, ...args);
  });
  Vue.filter('mathAbs', value => {
    return Math.abs(value);
  });
};
export default {
  install
};
