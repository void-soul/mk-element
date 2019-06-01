import i18n from '../datas/mk-i18n';

export default key => {
  let keys = key.split('.');
  let i = 0;
  let j = keys.length;
  let obj = i18n;

  while (obj !== undefined && i < j) {
    obj = obj[keys[i++]];
  }
  return obj;
};
