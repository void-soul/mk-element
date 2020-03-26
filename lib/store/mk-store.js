import mutations from './mutations';
import actions from './action';
import getters from './getters';
import state from './state';
import * as mutationTypes from './mutation-types';

const store = {
  state,
  getters,
  actions,
  mutations,
  transform(vuexStore, { basePath, baseTitle, index, wsPath, token, uploadAction, viewAction, environment, noticeAction, fileFolder }) {
    vuexStore.commit(mutationTypes.BIND_BASEPATH, basePath);
    vuexStore.commit(mutationTypes.BIND_TITLE, baseTitle);
    vuexStore.commit(mutationTypes.BIND_INDEX, index);
    vuexStore.commit(mutationTypes.BIND_WSPATH, wsPath);
    vuexStore.commit(mutationTypes.BIND_TOKEN, token);
    vuexStore.commit(mutationTypes.BIND_VIEW_ACTION, viewAction);
    vuexStore.commit(mutationTypes.BIND_UPLOAD_ACTION, uploadAction);
    vuexStore.commit(mutationTypes.BIND_ENVIRONMENT, environment || 'pc');
    vuexStore.commit(mutationTypes.BIND_NOTICEACTION, noticeAction);
    vuexStore.commit(mutationTypes.BIND_FILEFOLDER, fileFolder);
  }
};
Object.assign(store, mutationTypes);
export default store;
