/* eslint-disable */
import numberUtil from '../utils/mk-number-util';

let CreatedOKLodop7766 = null;

// ====判断是否需要安装CLodop云打印服务器:====
function needCLodop() {
  try {
    let ua = navigator.userAgent;

    if (ua.match(/Windows\sPhone/i) != null) {
      return true;
    }
    if (ua.match(/iPhone|iPod/i) != null) {
      return true;
    }
    if (ua.match(/Android/i) != null) {
      return true;
    }
    if (ua.match(/Edge\D?\d+/i) != null) {
      return true;
    }

    let verTrident = ua.match(/Trident\D?\d+/i);
    let verIE = ua.match(/MSIE\D?\d+/i);
    let verOPR = ua.match(/OPR\D?\d+/i);
    let verFF = ua.match(/Firefox\D?\d+/i);
    let x64 = ua.match(/x64/i);

    if (verTrident == null && verIE == null && x64 !== null) {
      return true;
    } else if (verFF !== null) {
      verFF = verFF[0].match(/\d+/);
      if (verFF[0] >= 41 || x64 !== null) {
        return true;
      }
    } else if (verOPR !== null) {
      verOPR = verOPR[0].match(/\d+/);
      if (verOPR[0] >= 32) {
        return true;
      }
    } else if (verTrident == null && verIE == null) {
      let verChrome = ua.match(/Chrome\D?\d+/i);

      if (verChrome !== null) {
        verChrome = verChrome[0].match(/\d+/);
        if (verChrome[0] >= 41) {
          return true;
        }
      }
    }
    return false;
  } catch (err) {
    return true;
  }
}

// ====获取LODOP对象的主过程：====
export function getLodop(oOBJECT, oEMBED, vueObj) {
  let strHtmInstall =
    "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  let strHtmUpdate =
    "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  let strHtm64Install =
    "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  let strHtm64Update =
    "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  let strHtmFireFox =
    "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
  let strHtmChrome =
    "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
  let strCLodopInstall =
    "<br><font color='#FF00FF'>请安装新版CLodop云打印服务!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>下载插件</a>,安装后请刷新页面。</font>";
  let strCLodopUpdate =
    "<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
  let LODOP;

  try {
    var isIE =
      navigator.userAgent.indexOf('MSIE') >= 0 ||
      navigator.userAgent.indexOf('Trident') >= 0;

    if (needCLodop()) {
      try {
        /* eslint-disable no-undef */
        LODOP = getCLodop();
      } catch (err) {}

      if (!LODOP && document.readyState !== 'complete') {
        alert('C-Lodop没准备好，请稍后再试！');
        return;
      }
      if (!LODOP) {
        if (isIE) {
          document.write(strCLodopInstall);
        } else {
          vueObj.$alert(strCLodopInstall, '请安装C-Lodop新版本', {
            dangerouslyUseHTMLString: true
          });
          return;
        }
      } else {
        if (CLODOP.CVERSION < '3.0.2.5') {
          if (isIE) {
            document.write(strCLodopUpdate);
          } else {
            vueObj.$alert(strCLodopUpdate, '请安装C-Lodop新版本', {
              dangerouslyUseHTMLString: true
            });
          }
        }
        if (oEMBED && oEMBED.parentNode) {
          oEMBED.parentNode.removeChild(oEMBED);
        }
        if (oOBJECT && oOBJECT.parentNode) {
          oOBJECT.parentNode.removeChild(oOBJECT);
        }
      }
    } else {
      var is64IE = isIE && navigator.userAgent.indexOf('x64') >= 0;
      // =====如果页面有Lodop就直接使用，没有则新建:==========

      if (oOBJECT !== undefined || oEMBED !== undefined) {
        if (isIE) {
          LODOP = oOBJECT;
        } else {
          LODOP = oEMBED;
        }
      } else if (CreatedOKLodop7766 == null) {
        LODOP = document.createElement('object');
        LODOP.setAttribute('width', 0);
        LODOP.setAttribute('height', 0);
        LODOP.setAttribute(
          'style',
          'position:absolute;left:0px;top:-100px;width:0px;height:0px;'
        );
        if (isIE) {
          LODOP.setAttribute(
            'classid',
            'clsid:2105C259-1E0C-4534-8141-A753534CB4CA'
          );
        } else {
          LODOP.setAttribute('type', 'application/x-print-lodop');
        }
        document.documentElement.appendChild(LODOP);
        CreatedOKLodop7766 = LODOP;
      } else {
        LODOP = CreatedOKLodop7766;
      }
      // =====Lodop插件未安装时提示下载地址:==========
      if (LODOP == null || typeof LODOP.VERSION === 'undefined') {
        if (navigator.userAgent.indexOf('Chrome') >= 0) {
          document.body.innerHTML = strHtmChrome + document.body.innerHTML;
        }
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
          document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
        }
        if (is64IE) {
          document.write(strHtm64Install);
        } else if (isIE) {
          document.write(strHtmInstall);
        } else {
          document.body.innerHTML = strHtmInstall + document.body.innerHTML;
        }
        return LODOP;
      }
    }
    if (LODOP.VERSION < '6.2.2.0') {
      if (!needCLodop()) {
        if (is64IE) {
          document.write(strHtm64Update);
        } else if (isIE) {
          document.write(strHtmUpdate);
        } else {
          document.body.innerHTML = strHtmUpdate + document.body.innerHTML;
        }
      }
      return LODOP;
    }
    // ===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
    LODOP.SET_LICENSES(
      '山西四和创想科技有限公司',
      'F3F6CC898EE17DEF52FD13E8A683CA27',
      '',
      ''
    );
    // ===========================================================
    return LODOP;
  } catch (err) {
    alert('getLodop出错:' + err);
  }
}

// printAttr:打印设置的一些属性
// --orient:打印方向
// --width:打印页宽
// --height:打印页高

// list：打印设计时托运的显示项

// refs：页面上VUE定义的变量，取DOM元素时用到，目前只支持表格。

// data：为JSON数据项，用于替换list参数中数据源为JSON数据源。

// selectedPrinter:用户选择的打印机。
export async function excutePrint(
  printAttr,
  list,
  refs,
  data,
  selectedPrinter
) {
  LODOP.SET_PRINT_STYLEA(0, 'HtmWaitMilSecs', 1000);
  LODOP.PRINT_INIT('口袋仓打印' + new Date().getTime() + Math.random());
  LODOP.SET_PRINTER_INDEX(selectedPrinter != null ? selectedPrinter : -1);
  LODOP.SET_PRINT_PAGESIZE(
    printAttr.orient,
    printAttr.width + 'mm',
    printAttr.height + 'mm',
    'CreateCustomPage'
  );
  // LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
  if (printAttr.printimage === 'true') {
    let imgdata = await new Promise(function(resolve) {
      let image = new Image();

      image.setAttribute('crossOrigin', 'anonymous');
      image.src = refs.backimg.src;
      image.onload = function() {
        let canvas = document.createElement('canvas');

        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, image.width, image.height);
        let dataURL = canvas.toDataURL('image/jpeg');

        resolve(dataURL);
      };
    });

    LODOP.ADD_PRINT_IMAGE(
      0,
      0,
      printAttr.width + 'mm',
      printAttr.height + 'mm',
      imgdata
    );
    LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2); // 按原图比例(不变形)缩放模式
  }

  let seeWidth;
  let seeHeight;

  if (refs.backimg && printAttr.pagename !== 'A4') {
    // 换算实际打印和图片的长宽比例，有两种情况，第一种是有图片时，按照图片来
    if (printAttr.orient === '1') {
      seeWidth = (1000 * 25.4) / 96 / printAttr.width;
      seeHeight = seeWidth;
    } else if (printAttr.orient === '2') {
      seeHeight = (1000 * 25.4) / 96 / printAttr.height;
      seeWidth = seeHeight;
    }
  } else {
    // 目前没有图片只支持A4，页面上用div来模拟，794*1123  和210mm*297mm是1:1
    seeWidth = 1;
    seeHeight = 1;
  }

  for (let j in list) {
    let item = list[j];
    let ttop = numberUtil.round((item.ttop * 25.4) / 96 / seeHeight);
    let tleft = numberUtil.round((item.tleft * 25.4) / 96 / seeWidth);

    if (item.datasource === '1') {
      // JSON取数据的情况
      LODOP.ADD_PRINT_TEXT(
        `${ttop}mm`,
        `${tleft}mm`,
        item.width,
        item.height,
        item.ismoney === 'true'
          ? numberUtil.money(data[item.field])
          : data[item.field]
      );
    } else if (item.datasource === '2') {
      // DOM取数据的情况
      // let dom_height = refs[item.field].clientHeight*25.4/96/seeWidth;
      // LODOP.ADD_PRINT_TABLE(`${ttop}mm`, `${tleft}mm`, item.width, item.height, `${refs[item.field].outerHTML}`);
      for (let table of refs[item.field]) {
        LODOP.ADD_PRINT_TABLE(
          `${ttop}mm`,
          `${tleft}mm`,
          item.width,
          item.height,
          `${table.outerHTML}`
        );
      }
    } else if (item.datasource === '3') {
      // 自定义文本取数据的情况
      LODOP.ADD_PRINT_TEXT(
        `${ttop}mm`,
        `${tleft}mm`,
        item.width,
        item.height,
        item.name
      );
    }
    if (item.itemtype) {
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', item.itemtype);
    }
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', item.fontsize);
    LODOP.SET_PRINT_STYLEA(0, 'FontName', item.fontfamily);
    LODOP.SET_PRINT_STYLEA(0, 'Bold', item.fontweight === 'bold' ? 1 : 0);
  }
  // LODOP.PREVIEW(); //在新的浏览器窗口显示打印预览
  LODOP.PRINT(); // 在新的浏览器窗口显示打印预览
}
