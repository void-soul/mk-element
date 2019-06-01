/* eslint-disable */
import axios from 'axios';
import VueAxios from 'vue-axios';
import mkCache from '../utils/mk-cache-util';
const actMessages = ['Okay', 'Created'];
const install = (
  Vue,
  {
    baseURL = '/',
    timeout = 50000,
    productMode = false,
    productErrorTip = 'sorry，系统发生错误！',
    defaultTip = '未知错误',
    sessionTimeoutCode = '201001',
    loginPath = '/login',
    systemErrorCodeStartWith = 1
  }
) => {
  const axiosInstance = axios.create({
    baseURL,
    timeout,
    responseType: 'json',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json'
    },
    validateStatus(status) {
      return status < 500;
    }
  });
  axiosInstance.interceptors.request.use(
    config => {
      const devid = mkCache.get(mkCache.keys.devid);
      config.headers.devid = devid;
      return config;
    },
    // eslint-disable-next-line no-undef
    error => Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    // eslint-disable-next-line no-undef
    error => Promise.reject(error)
  );
  Vue.use(VueAxios, axiosInstance);
  const axiosHandelExcption = ({ message = defaultTip, status = 500, url }) => {
    // 非用户异常
    let type = 'warning';
    if (status.toString().startsWith(`${systemErrorCodeStartWith}`)) {
      type = 'error';
      if (productMode === true) {
        message = productErrorTip;
      }
    }
    if (productMode === false) {
      message = `${message}(${status}) ${url}`;
    }
    Vue.prototype.$message({
      showClose: true,
      message,
      type
    });
    if (status === sessionTimeoutCode) {
      return Vue.prototype.$router.push(loginPath);
    }
    // eslint-disable-next-line
    throw {
      status,
      message
    };
  };
  const axiosHandel = (response, url) => {
    if (response.status - 300 > 0) {
      axiosHandelExcption({
        message: response.data.message,
        status: response.status,
        url
      });
    } else if (
      response.data.status ||
      (response.data.message &&
        actMessages.indexOf(response.data.message) === -1)
    ) {
      axiosHandelExcption({
        message: response.data.message,
        status: response.data.status || response.status,
        url
      });
    } else {
      return response.data;
    }
  };

  Vue.prototype.$post = async (url, params) => {
    let response;

    try {
      response = await axiosInstance.post(url, params);
    } catch (e) {
      axiosHandelExcption({
        msg: e.message,
        url
      });
    }
    return axiosHandel(response, url);
  };
  Vue.prototype.$get = async (url, params) => {
    let response;

    try {
      response = await axiosInstance.get(url, {
        params: params
      });
    } catch (e) {
      axiosHandelExcption({
        msg: e.message,
        url
      });
    }
    return axiosHandel(response, url);
  };
  Vue.prototype.$delete = async (url, params) => {
    let response;

    try {
      response = await axiosInstance.delete(url, {
        params: params
      });
    } catch (e) {
      axiosHandelExcption({
        msg: e.message,
        url
      });
    }
    return axiosHandel(response, url);
  };
  Vue.prototype.$put = async (url, params) => {
    let response;

    try {
      response = await axiosInstance.put(url, params);
    } catch (e) {
      axiosHandelExcption({
        msg: e.message,
        url
      });
    }
    return axiosHandel(response, url);
  };

  Vue.prototype.$query = async ({
    sqlCode,
    params = {},
    currentPage,
    pageSize = -1,
    sortName,
    sortType
  }) => {
    const data = await Vue.prototype.$get('/query.json', {
      sqlCode,
      currentPage,
      pageSize,
      sortName,
      sortType,
      ...params
    });
    return data.list;
  };
};

export default {
  install
};
