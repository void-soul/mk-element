import i18n from '../datas/mk-i18n';
const install = (Vue, store) => {
  Vue.prototype.$dataI18n = value => i18n.findI18n(value);
  Vue.prototype.$dataI18nIf = (value, flag = true) => {
    if (flag === false) {
      return '';
    } else {
      return i18n.findI18n(value);
    }
  };
  Vue.prototype.$dataI18nIfElse = (value, value2, flag = true) => {
    if (flag === true) {
      return i18n.findI18n(value);
    } else {
      return i18n.findI18n(value2);
    }
  };
  Vue.prototype.$dataConfig = (value, configName, def) => {
    try {
      return store.state.config.GlobalMap[configName][value] || def;
    } catch (e) {
      return def;
    }
  };
};
export default {
  install
};
