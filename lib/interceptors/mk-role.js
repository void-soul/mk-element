import i18n from '../datas/mk-i18n';
import { keys, get } from '../utils/mk-cache-util';
import isEmpty from 'lodash.isempty';
import { BIND_CONFIG, BIND_TABS, BIND_USER, BIND_DATAPERMISSION, BIND_MENUS, BIND_URIS } from '../store/mutation-types';
const install = (Vue, { router, loginPath, store, beforeEach, afterEach }) => {
  if (!router) return;
  /**
   * 重定向
   * @param ms
   * @param url false表示取消跳转
   * @param next
   * @returns {*}
   */
  const redirects = ({ ms, url, next }) => {
    if (ms) {
      Vue.prototype.$message({
        message: ms,
        type: 'warning'
      });
    }
    return next({
      path: url
    });
  };
  /**
   * 严格权限检测
   * @param path 目标路由
   * @returns {boolean}
   */
  const strictRole = path => {
    // store.state.ui 递归
    return true;
  };

  // 过渡效果自动关闭定时器
  router.beforeEach((to, from, next) => {
    if (beforeEach && beforeEach(to, from, next) === false) {
      return;
    }
    // 未知路由, 取消跳转
    if (to.name === null) {
      return redirects({
        ms: i18n.routers.not_found,
        url: false,
        next
      });
    }
    // 当状态没有菜单用户信息时，尝试从cache中读取
    if (isEmpty(store.state.user) === true) {
      let ui = get(keys.menus);
      if (ui) {
        ui = JSON.parse(ui);
        store.commit(BIND_MENUS, ui);
      }
      let dataPermissions = get(keys.dataPermission);
      if (dataPermissions) {
        dataPermissions = JSON.parse(dataPermissions);
        store.commit(BIND_DATAPERMISSION, dataPermissions);
      }
      let user = get(keys.user);
      if (user) {
        user = JSON.parse(user);
        store.commit(BIND_USER, user);
      }
      let config = get(keys.config);
      if (config) {
        config = JSON.parse(config);
        store.commit(BIND_CONFIG, config);
      }
      let menu = get(keys.tabs);
      if (menu) {
        menu = JSON.parse(menu);
        store.commit(BIND_TABS, menu);
      }
      let uris = get(keys.uris);
      if (uris) {
        uris = JSON.parse(uris);
        store.commit(BIND_URIS, uris);
      }
    }

    // 目标路由不允许跳过登录信息检测，同时状态中没有用户信息时，跳转登录页面
    if (to.meta.skip !== true && isEmpty(store.state.user) === true) {
      return redirects({
        url: loginPath,
        next
      });
    }
    // 目标路由需要检测用户是否具有访问权限，同时权限检测失败时，取消跳转
    if (to.meta.strict === true && strictRole(to.path) === false) {
      // 检测菜单
      return redirects({
        ms: i18n.routers.no_role,
        url: loginPath,
        next
      });
    }

    // 绑定全局filters
    // 因为state的config会发生变化,而定义好之后不会更新
    Vue.filter('dataConfig', (value, configName, def) => {
      try {
        return store.state.config.GlobalMap[configName][value] || def;
      } catch (e) {
        return def;
      }
    });
    Vue.filter('dataConfigs', (value, configName, split = ',') => {
      try {
        const result = [];
        value = value ? value.split(split) : '';
        for (let vl of value) {
          result.push(store.state.config.GlobalMap[configName][vl] || value);
        }
        return result.join(',');
      } catch (e) {
        return '';
      }
    });
    Vue.filter('dataConfig2', (value, ...configNames) => {
      try {
        for (let configName of configNames) {
          const label = store.state.config.GlobalMap[configName][value];
          if (label !== undefined) {
            return label;
          }
        }
        return '';
      } catch (e) {
        return '';
      }
    });
    // 检测通过
    next();
  });
  router.afterEach((to, from) => {
    afterEach && afterEach(to, from);
  });
};
export default {
  install
};
