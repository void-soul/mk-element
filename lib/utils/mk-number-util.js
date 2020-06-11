import Decimal from 'decimal.js';
const isNum = function(a) {
  return a !== '' && a !== null && !isNaN(a);
};

const filterNumber = function(array) {
  const res = [];
  array.forEach(element => {
    if (isNum(element)) {
      res.push(+element);
    }
  });
  return res;
};

const max = function(...args) {
  const arr = filterNumber(args);
  return Math.max.apply(null, arr);
};

const min = function(...args) {
  const arr = filterNumber(args);
  return Math.min.apply(null, arr);
};

const div = function(...args) {
  const arr = filterNumber(args);
  if (arr.length > 1) {
    return arr.reduce((a, b) => new Decimal(a).div(b)).toNumber();
  } else if (arr.length > 0) {
    return new Decimal(arr[0]).toNumber();
  } else {
    return 0;
  }
};

const add = function(...args) {
  const arr = filterNumber(args);
  if (arr.length > 1) {
    return arr.reduce((a, b) => new Decimal(a).add(b)).toNumber();
  } else if (arr.length > 0) {
    return new Decimal(arr[0]).toNumber();
  } else {
    return 0;
  }
};

const mul = function(...args) {
  const arr = filterNumber(args);
  if (arr.length > 1) {
    return arr.reduce((a, b) => new Decimal(a).mul(b)).toNumber();
  } else if (arr.length > 0) {
    return new Decimal(arr[0]).toNumber();
  } else {
    return 0;
  }
};

const sub = function(...args) {
  const arr = filterNumber(args);
  if (arr.length > 1) {
    return arr.reduce((a, b) => new Decimal(a).sub(b)).toNumber();
  } else if (arr.length > 0) {
    return new Decimal(arr[0]).toNumber();
  } else {
    return 0;
  }
};

const roundMode = [Decimal.ROUND_HALF_UP, Decimal.ROUND_UP, Decimal.ROUND_DOWN];
const round = (number, numDigits, upOrDown = 0) => {
  if (isNum(number)) {
    const nu = new Decimal(number);
    return nu.toDP(numDigits, roundMode[upOrDown]).toNumber();
  } else {
    return 0;
  }
};

/**
 *
 * @param {*} value  数字
 * @param {*} style 样式：decimal\percent\currency
 * @param {*} currency 货币类型 CNY等
 * @param {*} prefix 保留位数
 * @param {*} def 默认值
 */
const money = function(value, style = 'currency', currency = 'CNY', prefix = 2, def = 0) {
  return (isNum(value) ? +value : def).toLocaleString('zh', {
    style,
    currency,
    minimumFractionDigits: prefix
  });
};

const calc = function(start = 0) {
  let result = start;
  const bus = {
    add(...args) {
      result = add(result, ...args);
      return bus;
    },
    sub(...args) {
      result = sub(result, ...args);
      return bus;
    },
    div(...args) {
      result = div(result, ...args);
      return bus;
    },
    mul(...args) {
      result = mul(result, ...args);
      return bus;
    },
    max(...args) {
      result = max(result, ...args);
      return bus;
    },
    min(...args) {
      result = min(result, ...args);
      return bus;
    },
    round(numDigits, upOrDown) {
      result = round(result, numDigits, upOrDown);
      return bus;
    },
    over() {
      return result;
    },
    money(style, currency, prefix, def) {
      return money(result, style, currency, prefix, def);
    },
    ac() {
      result = sub(0, result);
      return bus;
    },
    abs() {
      result = Math.abs(result);
      return bus;
    }
  };
  return bus;
};

export default {
  /**
   * 流式计算
   * 终结方式1
   * calc(5).add(1,2,3).sub(4,5,6).div(80).mul(10,20).round(6,2).over()
   * 终结方式2
   * calc(7.99).add(1, 2, 3).money(2)
   */
  calc,
  /**
   * 作者 冯浩
   * 说明 在数字类型上加了自己实现的四舍五入方法
   * @param tofixednum 要处理的数字
   * @param numDigits 保留几位小数，为大于等于0的整数,如果输入小数则丢弃小数部分,保留整数部分,如果输入非数字或负数则视为0
   * @param upOrDown 入或舍,当0----四舍五入,1----入,2----舍,不传默认四舍五入.
   * @returns 返回四舍五入后的结果
   */
  round,
  /**
   * 减法运算 arg1-arg2
   * @param arg1 this 被减数
   * @param arg2 减数
   * @returns {string}运算结果
   * @author 冯浩
   * @create date 2016/04/19
   */
  sub,
  /**
   * 除法运算 arg1÷arg2
   * @param arg1 被除数
   * @param arg2 除数
   * @returns {number}运算结果
   * @author 冯浩
   * @create date 2016/04/19
   */
  div,
  /**
   * 乘法运算 多个参数
   * @returns {number}运算结果
   * @author 冯浩
   * @create date 2016/04/19
   */
  mul,
  /**
   * 加法运算 乘法运算 多个参数 减法传负数
   * @returns {number}运算结果
   * @author 冯浩
   * @create date 2016/04/19
   */
  add,
  /**
   * 金额格式化
   */
  money,
  max,
  min,
  /** 是否是数字 */
  isNum
};
