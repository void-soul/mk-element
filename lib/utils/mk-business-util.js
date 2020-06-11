/**
 * option对象
 * source : 源数据
 * key : 数据的主键名称
 * label：转为label的字段名称
 * children：转为children的字段名称
 * disabledarr : 不可选择列表
 * return：返回所有key的列表
 */
let recursionTree = function(option) {
  let result = [];

  if (!option) {
    return result;
  }
  if (!(option.source instanceof Array)) {
    return result;
  }
  let source = option.source;
  let key = option.key;
  let label = option.label;
  let children = option.children;
  let disabledarr = option.disabledarr || [];

  for (let i in source) {
    let o = source[i];

    if (key) {
      result.push(o[key]);
    }
    o.label = o[label];
    if (key) {
      o.id = o[key];
    }

    let index = disabledarr.findIndex(n => n === o.id);

    if (index > -1) {
      o.disabled = true;
      disabledarr.splice(index, 1);
    }

    if (o[children] && o[children].length > 0) {
      let suboption = {
        source: o[children],
        key: key,
        label: label,
        children: children,
        disabledarr: disabledarr
      };

      recursionTree(suboption);
      o.children = o[children];
      o[children] = [];
    }
  }
  return result;
};

export default recursionTree;
