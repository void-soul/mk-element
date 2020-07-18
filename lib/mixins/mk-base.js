/**
 * 通用vue模版
 * */
import { mapMutations, mapState } from 'vuex';
import i18n from '../datas/mk-i18n';

export default {
  computed: mapState({
    user: 'user',
    basePath: 'basePath',
    config: 'config',
    wsPath: 'wsPath',
    token: 'token',
    viewAction: 'viewAction',
    uploadAction: 'uploadAction'
  }),
  methods: {
    BIND_USER: mapMutations(['BIND_USER']).BIND_USER,
    BIND_LOADING: mapMutations(['BIND_LOADING']).BIND_LOADING,
    i18n (key) {
      const keys = key.split('.');
      let i = 0;
      const j = keys.length;
      let obj = i18n;

      while (obj !== undefined && i < j) {
        obj = obj[keys[i++]];
      }
      return obj;
    }
  },
  mounted () {
    this.BIND_LOADING(false);
  },
  activated () {
    this.BIND_LOADING(false);
  }
};
