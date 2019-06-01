import { getPropByPath } from 'element-ui/src/utils/util';
import Vue from 'vue';
const patterns = {
  'upper-letter': ['只能输入大写字母', /^[A-Z]+$/],
  'lower-letter': ['只能输入小写字母', /^[a-z]+$/],
  letter: ['只能输入字母', /^[a-zA-Z]+$/],
  'letter-2': ['只能是两位字母', /^[a-zA-Z]{2}$/],
  chinese: ['只能输入中文', /^[\u0391-\uFFE5]+$/],
  zonecode: ['邮编格式错误', /^\d{6}$/],
  qq: ['QQ格式错误', /^[1-9]\d{4,}$/],
  wechat: ['微信号码错误', /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/],
  email: [
    '邮箱格式错误',
    /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/
  ],
  mobile: ['手机号码格式错误', /^1(3|4|5|6|7|8)\d{9}$/],
  tel: ['电话号码格式错误', /^0\d{2,3}-?\d{7,8}$/],
  allphone: ['电话号码格式错误', /^1(3|4|5|6|7|8)\d{9}$|(^0\d{2,3}-?\d{7,8}$)/],
  license: ['营业执照格式错误', /^[A-Za-z0-9]{15}$|^[A-Za-z0-9]{18}$/],
  organ: ['组织机构代码格式错误', /^[0-9A-Za-z]{8}\-[0-9A-Za-z]$/],
  bank: ['银行卡号格式错误', /^(\d{15}|\d{16}|\d{17}|\d{18}|\d{19})$/],
  float: ['只能输入小数', /^-?(\d+\.\d+)$/],
  string: ['不可输入回车、tab', /^[^\n\r\t]$/],
  plus: ['只能输入正数', /^\d*[1-9]\d*$|^\d+\.\d*[0-9]\d*$/],
  'plus-int': ['只能输入正整数', /^\d*[1-9]\d*$/],
  'plus-float': ['只能输入正小数', /^\d+\.\d*[0-9]\d*$/],
  minus: ['只能输入负数', /^-\d*[1-9]\d*$|^-\d+\.\d*[0-9]\d*$/],
  'minus-int': ['只能输入负整数', /^-\d*[1-9]\d*$/],
  'minus-float': ['只能输入负小数', /^-\d+\.\d*[0-9]\d*$/],
  'un-plus': ['只能输入0或负数', /^(-[0-9]\d*|-\d+\.\d+|0[0]*|0\.[0]+)$/],
  'un-plus-int': ['只能输入0或负整数', /^(-[0-9]\d*|0[0]*)$/],
  'un-plus-float': ['只能输入0或负小数', /^(-\d+\.\d+|0[0]*|0\.[0]+)$/],
  'un-minus': ['只能输入0或者正数', /^([0-9]\d*|\d+\.\d+|0[0]*)$/],
  'un-minus-int': ['只能输入0或者正整数', /^([0-9]\d*)$/],
  'un-minus-float': ['只能输入0或正小数', /^(\d+\.\d+|0[0]*|0\.[0]+)$/],
  'id-card': [
    '身份证号码错误',
    /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
  ],
  number: [
    '只能输入数字',
    /^[1-9]\d*$|^0\.\d*[0-9]\d*$|^[1-9]\d*\.\d*[0-9]\d*$|^-[1-9]\d*$|^-0\.\d*[0-9]\d*$|^-[1-9]\d*\.\d*[0-9]\d*$/
  ],
  int: ['只能输入整数', /^[1-9]\d*$|^-[1-9]\d*$/],
  price: ['只能是正数且最多两位小数', /^([0-9]\d*|\d+\.\d{1,2}|0[0]*)$/],
  'price-3': ['只能是正数且最多3位小数', /^([0-9]\d*|\d+\.\d{1,3}|0[0]*)$/],
  'price-4': ['只能是正数且最多4位小数', /^([0-9]\d*|\d+\.\d{1,4}|0[0]*)$/],
  'price-5': ['只能是正数且最多5位小数', /^([0-9]\d*|\d+\.\d{1,5}|0[0]*)$/],
  'rebate-1': ['只能在0到1之间且最多两位小数', /^(0|1|(0\.([0-9]){1,2}))$/],
  'rebate-10': [
    '只能在0到10之间且最多两位小数',
    /^((([0-9])\.([0-9]){1,2})$)|(^([1-9]|10)$)/
  ],
  'rebate-100': [
    '只能在0到100之间且最多两位小数',
    /^((([0-9]){1,2}\.([0-9]){1,2})$)|(^([1-9]{1,2}|10|100)$)/
  ],
  url: [
    '网址格式错误',
    /http(s)*:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!#]*([^<>\"\"])*$/
  ],
  post: ['邮编格式错误', /^\d{6}$/]
};
const ms = {
  required: (trg, lab) => `请${trg === 'change' ? '选择' : '输入'}${lab}`,
  mkEq: (vl, lab) => `${lab}必须等于${vl}`,
  mkNe: (vl, lab) => `${lab}不能等于${vl}`,
  mkLt: (vl, lab) => `${lab}必须小于${vl}`,
  mkLe: (vl, lab) => `${lab}必须小于或等于${vl}`,
  mkGt: (vl, lab) => `${lab}必须大于${vl}`,
  mkGe: (vl, lab) => `${lab}必须大于或等于${vl}`,
  mkEqLength: (vl, lab) => `${lab}必须等于${vl}个字`,
  mkNeLength: (vl, lab) => `${lab}不能等于${vl}个字`,
  mkLtLength: (vl, lab) => `${lab}必须少于${vl}个字`,
  mkLeLength: (vl, lab) => `${lab}最多${vl}个字`,
  mkGtLength: (vl, lab) => `${lab}必须多于${vl}个字`,
  mkGeLength: (vl, lab) => `${lab}最少${vl}个字`,
  mkEnum: (vl, lab) => `${lab}只能输入${vl.join(',')}中的一个`,
  mkPattern: lab => `${lab}格式错误`
};
const isEmptyValue = value =>
  value === '' || value === undefined || value === null;
const valueConvert = (value, type) => {
  switch (type) {
    case 'string':
      return isEmptyValue(value) ? '' : value + '';
    case 'number':
      return isEmptyValue(value) ? null : value - 0;
    case 'boolean':
      return isEmptyValue(value) ? null : value === 'true' || value === true;
    default:
      return value;
  }
};
const getValue = function(vl) {
  let targetValue = vl;
  if (typeof vl === 'function') {
    targetValue = vl();
  }
  return valueConvert(targetValue, this.mkType);
};
export const getProp = function(vl) {
  const model = this.form.model;
  if (!model || !vl) {
    return;
  }

  let path = vl;
  if (path.indexOf(':') !== -1) {
    path = path.replace(/:/, '.');
  }

  return getPropByPath(model, path, true).v;
};
const getLength = vl => (isEmptyValue(vl) ? 0 : (vl + '').length);
const toString = vl => (isEmptyValue(vl) ? '' : vl + '');
const readLength = vl => {
  if (typeof vl === 'function') {
    return vl();
  } else if (typeof vl === 'string') {
    return vl - 0;
  } else {
    return vl;
  }
};
const patternFn = function(rule, value) {
  if (isEmptyValue(value) === true) {
    return null;
  } else if (rule[1].length > 1) {
    for (const p2 of rule[1]) {
      if (p2.test(value) === true) {
        return null;
      }
    }
  } else if (rule[1].test(value)) {
    return null;
  } else {
    return new Error(rule[0]);
  }
};
export const inlays = Object.keys(patterns);
export const types = ['string', 'number', 'boolean'];
export const fns = [
  async function required(rule, value) {
    if (this.required === true) {
      if (isEmptyValue(value) === true) {
        return new Error(ms.required(this.mkTrigger, this.realLabel));
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
  async function mkEnum(rule, value) {
    if (this.mkEnum !== undefined) {
      let target = this.mkEnum;
      if (typeof this.mkEnum === 'function') {
        target = this.mkEnum();
      }
      const vl = valueConvert(value, this.mkType);
      if (target.indexOf(vl) > -1) {
        return null;
      } else {
        return new Error(ms.mkEnum(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkInlay(rule, value) {
    if (this.mkInlay !== undefined) {
      if (patterns.hasOwnProperty(this.mkInlay) === true) {
        return patternFn(patterns[this.mkInlay], toString(value));
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
  async function mkPattern(rule, value) {
    if (this.mkPattern !== undefined) {
      if (this.mkPattern.test(toString(value)) === true) {
        return null;
      } else {
        return new Error(ms.mkPattern(this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkCustom(rule, value) {
    if (this.mkCustom !== undefined) {
      return await this.mkCustom(rule, value);
    } else {
      return null;
    }
  },
  async function mkRemote(rule, value) {
    if (this.mkRemote !== undefined) {
      const model = this.form.model;
      if (!model || !value) {
        return null;
      }
      let data;
      if (this.mkRemoteSkipField !== undefined) {
        data = {};
        for (const key in model) {
          if (this.mkRemoteSkipField.indexOf(key) === -1) {
            data[key] = model[key];
          }
        }
      } else {
        data = model;
      }
      const validResult = await Vue.prototype.$post(this.mkRemote, data);
      if (validResult) {
        return new Error(validResult);
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
  async function mkEq(rule, value) {
    if (this.mkEq !== undefined) {
      const target = getValue.call(this, this.mkEq);
      if (valueConvert(value, this.mkType) === target) {
        return null;
      } else {
        return new Error(ms.mkEq(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkNe(rule, value) {
    if (this.mkNe !== undefined) {
      const target = getValue.call(this, this.mkNe);
      if (valueConvert(value, this.mkType) !== target) {
        return null;
      } else {
        return new Error(ms.mkNe(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLt(rule, value) {
    if (this.mkLt !== undefined) {
      const target = getValue.call(this, this.mkLt);
      if (valueConvert(value, this.mkType) < target) {
        return null;
      } else {
        return new Error(ms.mkLt(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLe(rule, value) {
    if (this.mkLe !== undefined) {
      const target = getValue.call(this, this.mkLe);
      if (valueConvert(value, this.mkType) <= target) {
        return null;
      } else {
        return new Error(ms.mkLe(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGt(rule, value) {
    if (this.mkGt !== undefined) {
      const target = getValue.call(this, this.mkGt);
      if (valueConvert(value, this.mkType) > target) {
        return null;
      } else {
        return new Error(ms.mkGt(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGe(rule, value) {
    if (this.mkGe !== undefined) {
      const target = getValue.call(this, this.mkGe);
      if (valueConvert(value, this.mkType) >= target) {
        return null;
      } else {
        return new Error(ms.mkGe(target, this.realLabel));
      }
    } else {
      return null;
    }
  },

  async function mkEqProp(rule, value) {
    if (this.mkEqProp !== undefined) {
      const target = getProp.call(this, this.mkEqProp);
      if (valueConvert(value, this.mkType) === target) {
        return null;
      } else {
        return new Error(ms.mkEq(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkNeProp(rule, value) {
    if (this.mkNeProp !== undefined) {
      const target = getProp.call(this, this.mkNeProp);
      if (valueConvert(value, this.mkType) !== target) {
        return null;
      } else {
        return new Error(ms.mkNe(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLtProp(rule, value) {
    if (this.mkLtProp !== undefined) {
      const target = getProp.call(this, this.mkLtProp);
      if (valueConvert(value, this.mkType) < target) {
        return null;
      } else {
        return new Error(ms.mkLt(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLeProp(rule, value) {
    if (this.mkLeProp !== undefined) {
      const target = getProp.call(this, this.mkLeProp);
      if (valueConvert(value, this.mkType) <= target) {
        return null;
      } else {
        return new Error(ms.mkLe(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGtProp(rule, value) {
    if (this.mkLeProp !== undefined) {
      const target = getProp.call(this, this.mkGtProp);
      if (valueConvert(value, this.mkType) > target) {
        return null;
      } else {
        return new Error(ms.mkGt(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGeProp(rule, value) {
    if (this.mkGeProp !== undefined) {
      const target = getProp.call(this, this.mkGeProp);
      if (valueConvert(value, this.mkType) >= target) {
        return null;
      } else {
        return new Error(ms.mkGe(target, this.realLabel));
      }
    } else {
      return null;
    }
  },

  async function mkEqLength(rule, value) {
    if (this.mkEqLength !== undefined) {
      const target = readLength(this.mkEqLength);
      const len = getLength(value);
      if (len === target) {
        return null;
      } else {
        return new Error(ms.mkEqLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkNeLength(rule, value) {
    if (this.mkNeLength !== undefined) {
      const target = readLength(this.mkNeLength);
      const len = getLength(value);
      if (len !== target) {
        return null;
      } else {
        return new Error(ms.mkNeLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLtLength(rule, value) {
    if (this.mkLtLength !== undefined) {
      const target = readLength(this.mkLtLength);
      const len = getLength(value);
      if (len < target) {
        return null;
      } else {
        return new Error(ms.mkLtLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLeLength(rule, value) {
    if (this.mkLeLength !== undefined) {
      const target = readLength(this.mkLeLength);
      const len = getLength(value);
      if (len <= target) {
        return null;
      } else {
        return new Error(ms.mkLeLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGeLength(rule, value) {
    if (this.mkGeLength !== undefined) {
      const target = readLength(this.mkGeLength);
      const len = getLength(value);
      if (len >= target) {
        return null;
      } else {
        return new Error(ms.mkGeLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGtLength(rule, value) {
    if (this.mkGtLength !== undefined) {
      const target = readLength(this.mkGtLength);
      const len = getLength(value);
      if (len > target) {
        return null;
      } else {
        return new Error(ms.mkGtLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },

  async function mkEqLengthProp(rule, value) {
    if (this.mkEqLengthProp !== undefined) {
      const targetVal = getProp.call(this, this.mkEqLengthProp);
      const target = getLength(targetVal);
      const len = getLength(value);
      if (len === target) {
        return null;
      } else {
        return new Error(ms.mkEqLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkNeLengthProp(rule, value) {
    if (this.mkNeLengthProp !== undefined) {
      const targetVal = getProp.call(this, this.mkNeLengthProp);
      const target = getLength(targetVal);
      const len = getLength(value);
      if (len !== target) {
        return null;
      } else {
        return new Error(ms.mkNeLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLtLengthProp(rule, value) {
    if (this.mkLtLengthProp !== undefined) {
      const targetVal = getProp.call(this, this.mkLtLengthProp);
      const target = getLength(targetVal);
      const len = getLength(value);
      if (len < target) {
        return null;
      } else {
        return new Error(ms.mkLtLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkLeLengthProp(rule, value) {
    if (this.mkLeLengthProp !== undefined) {
      const targetVal = getProp.call(this, this.mkLeLengthProp);
      const target = getLength(targetVal);
      const len = getLength(value);
      if (len <= target) {
        return null;
      } else {
        return new Error(ms.mkLeLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGeLengthProp(rule, value) {
    if (this.mkGeLengthProp !== undefined) {
      const targetVal = getProp.call(this, this.mkGeLengthProp);
      const target = getLength(targetVal);
      const len = getLength(value);
      if (len >= target) {
        return null;
      } else {
        return new Error(ms.mkGeLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  },
  async function mkGtLengthProp(rule, value) {
    if (this.mkGtLengthProp !== undefined) {
      const targetVal = getProp.call(this, this.mkGtLengthProp);
      const target = getLength(targetVal);
      const len = getLength(value);
      if (len > target) {
        return null;
      } else {
        return new Error(ms.mkGtLength(target, this.realLabel));
      }
    } else {
      return null;
    }
  }
];
