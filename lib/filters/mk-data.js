import i18n from '../datas/mk-i18n';
const install = (Vue, store) => {
  Vue.filter('dataI18n', value => i18n.findI18n(value));
  Vue.filter('dataI18nIf', (value, flag = true) => {
    if (flag === false) {
      return '';
    } else {
      return i18n.findI18n(value);
    }
  });
  Vue.filter('dataI18nIfElse', (value, value2, flag = true) => {
    if (flag === true) {
      return i18n.findI18n(value);
    } else {
      return i18n.findI18n(value2);
    }
  });
};
export default {
  install
};
