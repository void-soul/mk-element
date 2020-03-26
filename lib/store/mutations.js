import * as type from './mutation-types';
import { set, keys, clear } from '../utils/mk-cache-util';

export default {
  [type.BIND_USER](state, info) {
    state.user = info;
    if (info.devid) {
      set(keys.devid, info.devid);
    }
    set(keys.user, info);
  },
  [type.BIND_MENUS](state, menus) {
    state.menus = menus;
    set(keys.menus, state.menus);
  },
  [type.BIND_DATAPERMISSION](state, permissions) {
    state.dataPermission = permissions;
    set(keys.dataPermission, state.dataPermission);
  },
  [type.UNBIND_ALL](state) {
    state.user = null;
    clear();
  },
  [type.BIND_CONFIG](state, config) {
    state.config = config;
    set(keys.config, config);
  },
  [type.BIND_TABS](state, menus) {
    state.tabs = menus;
    set(keys.tabs, state.tabs);
  },
  [type.BIND_LOADING](state, menus) {
    state.loading = menus;
  },
  [type.BIND_BASEPATH](state, path) {
    state.basePath = path;
  },
  [type.BIND_INDEX](state, index) {
    state.index = index;
  },
  [type.BIND_WSPATH](state, path) {
    state.wsPath = path;
  },
  [type.BIND_URIS](state, path) {
    state.uris = path;
    set(keys.uris, state.uris);
  },
  [type.BIND_TITLE](state, path) {
    state.title = path;
  },
  [type.BIND_TOKEN](state, token) {
    state.token = token;
  },
  [type.BIND_VIEW_ACTION](state, act) {
    state.viewAction = act;
  },
  [type.BIND_UPLOAD_ACTION](state, act) {
    state.uploadAction = act;
  },
  [type.BIND_ENVIRONMENT](state, act) {
    state.environment = act;
  },
  [type.BIND_NOTICEACTION](state, act) {
    state.noticeAction = act;
  },
  [type.BIND_FILEFOLDER](state, act) {
    state.fileFolder = act;
  }
};
