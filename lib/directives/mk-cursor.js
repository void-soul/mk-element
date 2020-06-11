const install = Vue => {
  Vue.directive('cursor', {
    inserted: function(el, value = 'pointer') {
      el.style.cursor = value;
    }
  });
};
export default {
  install
};
