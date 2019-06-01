/**
 * 正则表达式
 * */
export default {
  // 非负数
  number: /^([0-9]\d*|\d+\.\d+|0[0]*)$/,
  // 价格统一数字格式，两位小数
  price: /^([0-9]\d*|\d+\.\d{1,2}|0[0]*)$/,
  // 自然数用N  非负整数
  n_zero: /^([0-9]\d*)$/,
  // 自然数用N 正整数
  n_plus: /^\d*[1-9]\d*$/,
  // 自然数用N 负整数
  n_minus: /^-\d*[1-9]\d*$/,
  // R表示实数，也就是数字
  r: /^\d+$/,
  // 非负数
  r_zero: /^([0-9]\d*|\d+\.\d+|0[0]*)$/,
  // 小数
  decimal: /^-?(\d+\.\d+)$/,
  // 小于1的小数
  rebate: /^(0|1|(0\.([0-9]){1,2}))$/,
  // 0~10之间的2位小数
  rebate1: /^((([0-9])\.([0-9]){1,2})$)|(^([1-9]|10)$)/,
  // 手机号码
  phone: /^1(3|4|5|6|7|8)\d{9}$/,
  mobile: /^0\d{2,3}-?\d{7,8}$/,
  allphone: /^1(3|4|5|6|7|8)\d{9}$|(^0\d{2,3}-?\d{7,8}$)/,
  // 电子邮件
  email: /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/,
  // 两位字母
  two_char: /[A-Za-z]{1}[A-Za-z]{1}/,
  // 网址
  url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
  // QQ
  qq: /[1-9][0-9]{4,14}/,
  // 邮编
  post: /^\d{6}$/,
  // 自定义验证函数
  custom({
    minLength = Number.MIN_SAFE_INTEGER,
    maxLength = Number.MAX_SAFE_INTEGER,
    required = false,
    msg,
    getValue,
    max,
    min,
    p
  }) {
    return {
      validator: (rule, value, callback) => {
        if (getValue !== undefined) {
          value = getValue();
        }
        if (required === true && !value) {
          return callback(new Error(msg));
        }
        if (value) {
          if (value.length < minLength || value.length > maxLength) {
            return callback(new Error(msg));
          }
          if (max) {
            let maxValue = max;
            if (typeof max === 'function') {
              maxValue = max();
            }
            if (value > maxValue) {
              return callback(new Error(msg));
            }
          }
          if (min) {
            let minValue = min;
            if (typeof min === 'function') {
              minValue = min();
            }
            if (value < minValue) {
              return callback(new Error(msg));
            }
          }
          if (p && !p.test(value)) {
            return callback(new Error(msg));
          }
        }
        callback();
      },
      trigger: 'blur'
    };
  }
};
