export default {
  user: null,
  menus: null, // 读取回来的菜单
  config: null, // 通用配置
  index: null, // 首页
  basePath: null, // 服务器根路径,不是以/结尾哦!
  wsPath: null, // 服务器websocket路径
  dataPermission: null, // 数据权限
  tabs: null, // 已经打开i的菜单
  uris: null, // 路由映射
  title: null, // 基本标题
  loading: false, // 加载中
  token: null, // 文件token
  viewAction: null,
  uploadAction: null,
  noticeAction: null,
  environment: 'pc', // 操作环境
  fileFolder: null
};
