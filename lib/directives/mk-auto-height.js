const install = Vue => {
  Vue.directive('auto-height', {
    inserted: function(el, binding) {
      el.style.height =
        document.documentElement.clientHeight -
        el.getBoundingClientRect().top +
        (binding.value || 0) +
        'px';
      el.style.overflowY = 'auto';
    }
  });
};
export default {
  install
};
