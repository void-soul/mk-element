const i18n = {
  routers: {
    no_user: '请登录后访问!',
    no_role: '您无权访问此菜单!',
    not_found: '页面不存在'
  },
  data: {
    empty: '亲，没有找到符合条件的记录!',
    loading: '拼命加载中...',
    saveing: '正在保存,请稍候...'
  },
  findI18n(key) {
    if (key) {
      let keys = key.split('.');
      let i = 0;
      let j = keys.length;
      let obj = i18n;
      while (obj !== undefined && i < j) {
        obj = obj[keys[i++]];
      }
      return obj;
    } else {
      return '';
    }
  }
};

module.exports = i18n;
