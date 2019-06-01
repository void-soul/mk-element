/* eslint-disable */
import fs from 'fs';
import path from 'path';
const p = function({ fn, target, nodejs = true }) {
  return (...args) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      args.push((err, ...data) => {
        if (nodejs === false) return resolve.apply(this, [err, ...data]);
        if (err === null || err === undefined) return resolve.apply(this, data);
        return reject(err);
      });
      if (target) fn.apply(target, args);
      else fn.apply(null, args);
    });
  };
};
const ensure = (poiont, msg) => {
  if (!poiont) throw msg;
};
const argv = process.argv;
ensure(
  argv.length === 3,
  '必须指明文件路径!如npm run create cpChargeLevel/charge-level-form'
);
const fil = argv[2];
const f = fil.split('/');
const temp = {
  vue: name => `<template>
    <div></div>
  </template>
  <script>
      import mix from '@/mix'
      import msg from '@/msg/${name}'
      
      export default {
        mixins: [mix],
        data(){
            return {}
        },
        components:{},
        methods:{
            
        }
      }
  </script>`,
  ms: () => `export default {
  }`
};
const exists = p({ fn: fs.stat, nodejs: false });
const mkdir = p({ fn: fs.mkdir });
// eslint-disable-next-line 
const mkdirsSync = async(dirpath, mode) => {
  if (!(await exists(dirpath))) {
    let pathtmp;
    let ps = dirpath.split(path.sep);
    for (let dirname of ps) {
      if (pathtmp) pathtmp = path.join(pathtmp, dirname);
      else pathtmp = dirname;
      if (!(await exists(pathtmp))) {
        try {
          await mkdir(pathtmp, mode);
        } catch (e) {
          return false;
        }
      }
    }
  }
  return true;
};
const writeFile = p({ fn: fs.writeFile });
const main = async() => {
  let viewPath = path.resolve(
    argv[1],
    '../../',
    'src',
    'views',
    f.slice(0, -1).join('/')
  );
  let msgPath = path.resolve(
    argv[1],
    '../../',
    'src',
    'msg',
    f.slice(0, -1).join('/')
  );
  await mkdirsSync(viewPath);
  await mkdirsSync(msgPath);
  viewPath = viewPath + path.sep + f.slice(-1) + '.vue';
  msgPath = msgPath + path.sep + f.slice(-1) + '.js';
  ensure((await exists(viewPath)) === false, `${viewPath}已经存在!`);
  ensure((await exists(msgPath)) === false, `${msgPath}已经存在!`);
  await writeFile(viewPath, temp.vue(f.slice(-1)));
  await writeFile(msgPath, temp.ms());
};
main()
  .then(() => {
    console.log('over');
    process.exit();
  })
  .catch(e => console.log(e));
