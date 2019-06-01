const install = (Vue, { store }) => {
  Vue.prototype.$auth = Vue.prototype.$authority = (checkcode) =>
    store.state.dataPermission.findIndex((ele) => ele === checkcode) > -1;
};
export default {
  install
};
