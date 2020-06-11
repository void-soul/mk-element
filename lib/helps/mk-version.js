import * as pack from '../../package';
const install = (Vue, { version }) => {
  let c = 5;
  let args = [
    '%c %c %c v' +
      version +
      ' | Vue.js v' +
      Vue.version +
      ' | element v' +
      pack.version +
      ' |mk | 2017  %c %c ' +
      ' http://emelife.cn  %c %c \u263b%c\u263b%c\u263b ',
    'background: #006DE8',
    'background: #0078E8',
    'color: #ffffff; background: #00A9E8;',
    'background: #00BAE8',
    'background: #00D5E8',
    'background: #00E8BA'
  ];

  for (let i = 0; i < 3; i++) {
    if (i < c) {
      args.push('color: #ED1C24; background: #fff');
    } else {
      args.push('color: #00E837; background: #fff');
    }
  }
  console.log.apply(console, args);
};

export default {
  install
};
