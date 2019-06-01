import mkCache from '../utils/mk-cache-util';
const install = (Vue, { productMode }) => {
  mkCache.productMode = productMode;
  Vue.prototype.$cache = mkCache;
};
export default {
  install
};
