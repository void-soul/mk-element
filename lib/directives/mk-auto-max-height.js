const install = Vue => {
  Vue.directive('auto-max-height', {
    inserted: function(el, binding) {
      el.style.maxHeight =
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
