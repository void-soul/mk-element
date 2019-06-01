import MkAuth from './lib/mk-auth/index.vue';
import MkBottomBox from './lib/mk-bottom-box/index.vue';
import MkButton from './lib/mk-button/index.vue';
import MkCard from './lib/mk-card/index.vue';
import MkConfigRadio from './lib/mk-config-radio/index.vue';
import MkConfigSelect from './lib/mk-config-select/index.vue';
import MkFormItem from './lib/mk-form-item/index.vue';
import MkHr from './lib/mk-hr/index.vue';
import MkImgView from './lib/mk-img-view/index.vue';
import MkInline from './lib/mk-inline/index.vue';
import MkLazyRender from './lib/mk-lazy-render/index.vue';
import MkRow from './lib/mk-row/index.vue';
import MkSearchBox from './lib/mk-search-box/index.vue';
import MkSearchButtons from './lib/mk-search-buttons/index.vue';
import MkTable from './lib/mk-table/index.vue';
import MkTabs from './lib/mk-tabs/index.vue';
import MkUeditor_ from './lib/mk-ueditor/index.vue';
import MkUpload_ from './lib/mk-upload/index.vue';
import MkUpload2_ from './lib/mk-upload2/index.vue';
import MkUpload3_ from './lib/mk-upload3/index.vue';
import MkUpload4_ from './lib/mk-upload4/index.vue';
import Tag from './lib/tag/index.vue';

import MkAxios from './lib/prototypes/mk-axios.js';
import MkBus from './lib/prototypes/mk-bus.js';
import MkCache from './lib/prototypes/mk-cache.js';
import MkDataPrototypes from './lib/prototypes/mk-data-prototypes.js';
import MkDom from './lib/prototypes/mk-dom.js';
import MkLang from './lib/prototypes/mk-lang.js';
import MkMathPrototypes from './lib/prototypes/mk-math-prototypes.js';

import MkData from './lib/filters/mk-data.js';
import MkMath from './lib/filters/mk-math.js';

import MkAutoHeight from './lib/directives/mk-auto-height.js';
import MkAutoMaxHeight from './lib/directives/mk-auto-max-height.js';
import MkCursor from './lib/directives/mk-cursor.js';
import MkFocus from './lib/directives/mk-focus.js';

import MkStore from './lib/store/mk-store.js';

import MkRole from './lib/interceptors/mk-role.js';

import MkVersion from './lib/helps/mk-version.js';

import MkBase_ from './lib/mixins/mk-base.js';

const components = [
  Tag,
  MkBottomBox,
  MkButton,
  MkImgView,
  MkSearchBox,
  MkTable,
  MkSearchButtons,
  MkConfigSelect,
  MkHr,
  MkConfigRadio,
  MkCard,
  MkFormItem,
  MkInline,
  MkRow,
  MkTabs,
  MkAuth,
  MkLazyRender
];

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  Vue.use(MkAxios, opts);
  Vue.use(MkCache, opts);
  Vue.use(MkDom, opts);
  Vue.use(MkLang, opts);
  Vue.use(MkBus, opts);
  Vue.use(MkMathPrototypes, opts);
  Vue.use(MkDataPrototypes, opts);
  Vue.use(MkMath, opts);
  Vue.use(MkData, opts);
  Vue.use(MkAutoHeight, opts);
  Vue.use(MkAutoMaxHeight, opts);
  Vue.use(MkCursor, opts);
  Vue.use(MkFocus, opts);
  Vue.use(MkRole, opts);
  Vue.use(MkVersion, opts);
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  MkStore
};

export const MkUpload = MkUpload_;
export const MkUpload2 = MkUpload2_;
export const MkUpload3 = MkUpload3_;
export const MkUpload4 = MkUpload4_;
export const MkUeditor = MkUeditor_;
export const MkBase = MkBase_;
